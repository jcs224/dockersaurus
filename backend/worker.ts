import { Application, Context, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import html from './html.ts'
import Docker from "https://deno.land/x/denocker@v0.2.0/index.ts"

const docker = new Docker('/var/run/docker.sock')

self.onmessage = async (e) => {
  const oakApp = new Application()

  switch (e.data.command) {
    case 'serve': {
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
        const ws = ctx.upgrade()
        ws.onopen = () => {
          console.log('connected to client')
        }

        ws.onmessage = async (event) => {
          const msg = event.data

          if (msg == 'get_containers') {
            const containers = await docker.containers.list({ all: true })
            ws.send(JSON.stringify({
              type: 'get_containers',
              payload: containers
            }))
          }
        }

        ws.onclose = () => {
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
    case 'quit':
      self.close()
      break
  }
}