import readFileSync from './compiled_static_files.js'

export async function manifest() {
  const file = new TextDecoder().decode(readFileSync(`public/build/manifest.json`))
  const fileParsed = JSON.parse(file)
  return fileParsed
}