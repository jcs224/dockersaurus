import { readLines } from "https://deno.land/std@0.150.0/io/mod.ts";

const td=(d:Uint8Array)=>new TextDecoder().decode(d);
const te=(s:string) => new TextEncoder().encode(s);

const cmd = ["docker", "events"]
const process = Deno.run({ cmd, stdout: 'piped', stderr: 'piped' })

for await (const line of readLines(process.stdout)) {
  console.log(line)
}

await process.status()