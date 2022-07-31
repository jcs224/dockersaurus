import { Application, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import html from './html.ts'

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

      router.get('/public/(.*)', async (ctx, next) => {
        try {
          await ctx.send({
            root: `${Deno.cwd()}`
          })
        } catch {
          await next()
        }
      }).get('/', async (ctx) => {
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