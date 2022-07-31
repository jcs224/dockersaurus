export async function manifest() {
  const file = await Deno.readTextFile(`${Deno.cwd()}/public/build/manifest.json`)
  const fileParsed = JSON.parse(file)
  return fileParsed
}