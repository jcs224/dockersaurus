import { Webview, SizeHint } from "https://deno.land/x/webview@0.7.5/mod.ts";
import { getPort } from 'https://deno.land/x/getport@2.0.0/mod.ts'

const port = await getPort()
const worker_server = new Worker(new URL("./worker_server.ts", import.meta.url).href, { type: "module" })
const worker_events = new Worker(new URL("./worker_events.ts", import.meta.url).href, { type: "module" })

const channel = new MessageChannel()

worker_server.postMessage({
  message_port: channel.port1,
  command: 'serve', 
  port: port, 
  dev_mode: Deno.env.get('DEV_MODE') || false
}, [
  channel.port1
])

worker_events.postMessage({
  message_port: channel.port2,
  command: 'get_docker_events'
}, [
  channel.port2
])

const webview = new Webview();
webview.size = {
  width: 1280,
  height: 720,
  hint: SizeHint.NONE
}

worker_server.onmessage = (e) => {
  if (e.data == 'server_started') {
    webview.navigate(`http://localhost:${port}`);
    webview.run();
    worker_server.postMessage({ command: 'quit' })
    worker_events.postMessage({ command: 'quit' })
  }
}

