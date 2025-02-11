<template>
    <div>
      <!-- แสดง router-view โดยไม่มี layout ใดๆ -->
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BlankLayout'
  };
  </script>
  
  <style scoped>
  /* สามารถเพิ่มสไตล์ที่ต้องการได้ (ถ้าต้องการ) */
  </style>
  