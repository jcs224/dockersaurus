<template>
<div class="d-flex">
  <div 
    class="rounded-start border border-end-0 px-3 py-2 w-100"
    :class="[container.State == 'running' ? 'bg-primary text-white border-0' : '']"
  >
    {{ container.Names[0].substring(1) }}
  </div>
  
  <div class="h-100" v-if="containers_changing.includes(container.Id)">
    <button class="btn btn-secondary rounded-0 h-100" disabled>
      <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </button>
  </div>
  <div v-else class="h-100">
    <button v-if="container.State == 'running'" class="btn btn-secondary rounded-0 h-100" @click="stopContainer(container.Id)">Stop</button>
    <button v-else class="btn btn-success rounded-0 h-100" @click="startContainer(container.Id)">Start</button>
  </div>
  <button class="btn btn-danger rounded-0 rounded-end">Delete</button>
</div>
</template>

<script setup>
import socket from './socket'

const props = defineProps({
  container: Object,
  containers_changing: Array
})

const startContainer = (id) => {
  socket.send('start_container:'+id)
  props.containers_changing.push(id)
}

const stopContainer = (id) => {
  socket.send('stop_container:'+id)
  props.containers_changing.push(id)
}

</script>