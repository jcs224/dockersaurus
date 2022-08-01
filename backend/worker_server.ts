/// <reference lib="deno.worker" />

import { Application, Context, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import html from './html.ts'
import Docker from "https://deno.land/x/denocker@v0.2.0/index.ts"

interface ServerWorkerArguments {
  message_port: MessagePort,
  command: string,
  port: number,
  environment: string
}

const docker = new Docker('/var/run/docker.sock')
let websocket: WebSocket

self.onmessage = async (e) => {

  const { message_port } : ServerWorkerArguments = e.data

  message_port.onmessage = (message_e) => {
    console.log('message sent from worker_events: '+message_e.data.payload)
    websocket.send(JSON.stringify({
      type: 'docker_event',
      payload: message_e.data.payload
    }))
  }
  
  switch (e.data.command) {
    case 'serve': {
      const oakApp = new Application()
      const router = new Router()

      oakApp.addEventListener("listen", ({ hostname, port, secure }) => {
        console.log(
          `Listening on: ${secure ? "https://" : "http://"}${
            hostname ??
              "localhost"
          }:${port}`,
        );
      });

      router
      .get('/ws', async (ctx, next) => {
        if (!ctx.isUpgradable) ctx.throw(501)
        websocket = ctx.upgrade()
        websocket.onopen = () => {
          console.log('connected to client')
        }

        websocket.onmessage = async (event) => {
          const msg : string = event.data

          if (msg == 'get_containers') {
            const containers = await docker.containers.list({ all: true })
            // console.log(containers[16])
            websocket.send(JSON.stringify({
              type: 'get_containers',
              payload: containers
            }))
          }

          if (msg.includes('start_container')) {
            const id = msg.split(':')[1]
            await docker.containers.start(id)
            websocket.send(JSON.stringify({
              type: 'start_container',
              payload: id
            }))
          }
        }

        websocket.onclose = () => {
          console.log('closing socket')
        }
      })
      .get('/public/(.*)', async (ctx, next) => {
        try {
          await ctx.send({
            root: `${Deno.cwd()}`
          })
        } catch {
          await next()
        }
      })
      .get('/', async (ctx) => {
        ctx.response.body = await html(e.data.environment)
      })

      oakApp.use(router.routes())
      oakApp.use(router.allowedMethods())

      oakApp.listen({ port: e.data.port })
    } break;
    case 'send_over_websocket':
      websocket.send(e.data.payload)
      break
    case 'quit':
      self.close()
      break
  }
}