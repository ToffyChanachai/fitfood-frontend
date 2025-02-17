<template>
  <div>
    <!-- แสดง layout ตามที่กำหนดใน meta.layout -->
    <component :is="layoutComponent">
      <router-view></router-view>
    </component>
  </div>
</template>

<script>
import MainLayout from './layouts/MainLayout.vue';
import SimpleLayout from './layouts/SimpleLayout.vue';
import BlankLayout from './layouts/BlankLayout.vue';


export default {
  computed: {
    layoutComponent() {

      if (this.$route.meta.layout === 'BlankLayout') {
        return BlankLayout; // ใช้ BlankLayout ถ้ากำหนดใน meta
      }

      return this.$route.meta.layout === 'SimpleLayout' ? SimpleLayout : MainLayout;
    },

    userRole() {
      return this.$store.getters.getUserRole; // ดึงข้อมูล role จาก Vuex store
    }
  },
  created() {
    // เรียกใช้ action fetchUserRole เมื่อคอมโพเนนต์ถูกสร้าง
    this.$store.dispatch('fetchUserRole');
  }
};
</script>
