<template>
<div class="d-flex">
  <div 
    class="rounded-start border border-end-0 px-3 py-2 w-100"
    :class="[container.State == 'running' ? 'bg-primary text-white border-0' : '']"
  >
    {{ container.Names[0].substring(1) }}
  </div>
  
  <button v-if="container.State == 'running'" class="btn btn-success rounded-0" @click="stopContainer(container.Id)">Stop</button>
  <button v-else class="btn btn-success rounded-0" @click="startContainer(container.Id)">Start</button>
  <button class="btn btn-danger rounded-0 rounded-end">Delete</button>
</div>
</template>

<script setup>
import socket from './socket'

const props = defineProps({
  container: Object
})

const startContainer = (id) => {
  socket.send('start_container:'+id)
}

const stopContainer = (id) => {
  socket.send('stop_container:'+id)
}

</script>