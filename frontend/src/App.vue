<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style scoped>
/* ✅ ตั้งค่าให้เต็มจอ */
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f9f6c3;
}
</style>
