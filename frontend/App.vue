<template>
  <div class="container">
    <div class="grid mt-4">
      <Container 
        class="g-col-6" 
        v-for="ct in containers" 
        :key="ct.Id" 
        :container="ct" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Container from './Container.vue'
import socket from './socket'

const containers = ref([])

socket.onopen = () => {
  socket.send('get_containers')
}

socket.onmessage = (event) => {
  const event_result = JSON.parse(event.data)
  const { type, payload } = event_result

  switch (type) {
    case 'get_containers':
      containers.value = payload
      break;
    case 'start_container':
      // alert('container started')
      break;
    case 'stop_container':
      break;
    case 'docker_event':
      const parsed_payload = JSON.parse(payload)
      if (parsed_payload.Type == 'container') {
        // const index = containers.value.findIndex(ct => ct.Id == parsed_payload.id)

        if (parsed_payload.status == 'start' || parsed_payload.status == 'stop') {
          socket.send('get_containers')
        }
      }
      break;
  }
}

</script>