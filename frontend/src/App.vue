<script setup>
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();  // ใช้ useRoute เพื่อตรวจสอบเส้นทาง (route)
</script>

<template>
  <!-- เพิ่ม class ที่แตกต่างกันสำหรับหน้าแต่ละหน้า -->
  <div :class="['app-container', route.name]">
    <RouterView />
  </div>
</template>

<style scoped>
/* สไตล์ที่ใช้ทั่วทั้งแอป */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Kanit', sans-serif;
}

.login, .register {
  /* หน้า login, register จะจัดเต็มหน้าจอ */
  height: 100vh;
  width: 100vw;
  background: #f6f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
