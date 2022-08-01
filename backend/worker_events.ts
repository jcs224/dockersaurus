/// <reference lib="deno.worker" />

import { readLines } from "https://deno.land/std@0.150.0/io/mod.ts";

interface EventWorkerArguments{
  command: string,
  message_port: MessagePort
}

self.onmessage = async (e) => {
  const { message_port } : EventWorkerArguments = e.data

  switch (e.data.command) {
    case 'get_docker_events':
      const cmd = ["docker", "events", "--format", "{{json .}}"]
      const process = Deno.run({ cmd, stdout: 'piped', stderr: 'piped' })

      for await (const line of readLines(process.stdout)) {
        message_port.postMessage({
          payload: line
        })
      }

      await process.status()

      break
    case 'quit':
      self.close()
      break
  }
}
