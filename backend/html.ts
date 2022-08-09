import { manifest } from './helpers.ts'

export default async function(dev_mode: Number, port: Number) {
  return /* html */`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="dev-port" content="${ port }">
    <title>Dockersaurus</title>
    ${ dev_mode
    ? `
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module" src="http://localhost:5173/frontend/app.js"></script>
    `
    : `
    <link rel="stylesheet" href="/public/build/${ (await manifest())['frontend/app.js']['css'][0] }" />
    <script type="module" src="/public/build/${ (await manifest())['frontend/app.js']['file'] }" defer></script>
    `
    }
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>`;
}