import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { Webview, SizeHint } from "https://deno.land/x/webview@0.7.3/mod.ts";
import { getPort } from 'https://deno.land/x/getport@2.0.0/mod.ts'
import Docker from "https://deno.land/x/denocker@v0.2.0/index.ts"

const port = await getPort()
const worker = new Worker(new URL("./worker.ts", import.meta.url).href, { type: "module" })

worker.postMessage({ 
  command: 'serve', 
  port: port, 
  environment: Deno.env.get('ENVIRONMENT')
})

const webview = new Webview();
webview.size = {
  width: 1280,
  height: 720,
  hint: SizeHint.NONE
}

webview.navigate(`http://localhost:${port}`);

const docker = new Docker('/var/run/docker.sock')

webview.bind('get_containers', async () => {
  const containers = await docker.containers.list({ all: true})
  webview.eval("listContainers('"+ JSON.stringify(containers) +"')")
})

webview.run();
worker.postMessage({ command: 'quit' })
