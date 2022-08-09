const port = document.querySelector('meta[name="dev-port"]').content

const socket = new WebSocket(`ws://localhost:${ port }/ws`)

export default socket