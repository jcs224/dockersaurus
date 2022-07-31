<template>
  <div class="container">
    <div class="grid mt-4">
      <Container class="g-col-6" v-for="ct in containers" :key="ct.Id" :container="ct" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Container from './Container.vue'

const containers = reactive([])

const socket = new WebSocket('ws://localhost:1025/ws')

socket.onopen = () => {
  socket.send('get_containers')
}

socket.onmessage = (event) => {
  const event_result = JSON.parse(event.data)
  const { type, payload } = event_result

  switch (type) {
    case 'get_containers':
      payload.forEach(ct => {
        containers.push(ct)
      })
      break;
  }
}

</script>