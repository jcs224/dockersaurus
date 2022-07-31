<template>
<div class="d-flex">
  <div class="rounded-start border border-end-0 px-3 py-2 w-100">
    {{ container.Names[0].substring(1) }}
  </div>
  
  <button class="btn btn-success rounded-0">Start</button>
  <button class="btn btn-danger rounded-0 rounded-end">Delete</button>
</div>
</template>

<script setup>
const props = defineProps({
  container: Object
})
</script>