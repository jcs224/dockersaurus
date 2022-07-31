import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { Webview, SizeHint } from "https://deno.land/x/webview@0.7.3/mod.ts";
import { getPort } from 'https://deno.land/x/getport@2.0.0/mod.ts'

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

webview.run();
worker.postMessage({ command: 'quit' })
