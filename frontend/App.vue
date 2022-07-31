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

const containers = reactive([
  { name: 'cool 1' },
  { name: 'cool 2' },
  { name: 'cool 3' },
  { name: 'cool 4' },
  { name: 'cool 5' },
  { name: 'cool 6' },
  { name: 'cool 7' },
  { name: 'cool 8' },
])

</script>