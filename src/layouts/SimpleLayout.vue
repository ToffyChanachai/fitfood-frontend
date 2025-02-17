<template>
  <div>
    <header class="flex justify-between items-center p-4 px-32 bg-white text-white shadow-lg relative">
      <div class="flex justify-center items-center cursor-pointer" @click="goToHome">
        <img src="@/assets/fitfood_logo.png" alt="Logo" class="w-12 h-12">
        <div class="leading-none ml-2">
          <p class="text-lg font-bold text-black">ABSOLUTE</p>
          <p class="text-lg font-bold text-custom-orange -mt-3">FITFOOD</p>
        </div>
      </div>


      <div v-if="['/premium-health', '/', '/happy-healthy-box', '/low-carb', '/fat-loss'].includes($route.path)"
        class="flex items-left space-x-6 text-black font-bold">
        <router-link to="/premium-health" class="hover:text-custom-orange"
          :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/premium-health' || $route.path === '/' }">
          Premium Health
        </router-link>

        <router-link to="/happy-healthy-box" class="hover:text-custom-orange"
          :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/happy-healthy-box' }">
          Happy Healthy Box
        </router-link>

        <router-link to="/low-carb" class="hover:text-custom-orange"
          :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/low-carb' }">
          Low Carb
        </router-link>

        <router-link to="/fat-loss" class="hover:text-custom-orange"
          :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/fat-loss' }">
          Fat Loss
        </router-link>
      </div>


      <div v-if="isLoggedIn" class="flex items-center space-x-4">
        <!-- คลิกที่ชื่อผู้ใช้เพื่อแสดง/ซ่อนเมนู -->
        <div class="relative flex items-center space-x-4">
          <span v-if="!isUserRegistered" class="cursor-pointer text-custom-orange font-bold"
            @click="$router.push('/register-aff')">
            Register Aff
          </span>

          <!-- <button @click="checkIfAdmin" class="text-black">Check if Admin</button> -->

          <span @click="toggleMenu" class="cursor-pointer flex items-center space-x-2">
            <span class="text-black">Welcome, <strong class="text-custom-orange">{{ username }}</strong></span>
            <span :class="{ 'rotate-180': isMenuOpen }"
              class="material-symbols-outlined text-black transition-transform duration-300">
              arrow_drop_down
            </span>
          </span>


          <div v-show="isMenuOpen"
            class="absolute right-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-48 z-50 border">
            <ul class="list-none p-0 m-0">
              <li
                class="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-custom-orange hover:font-bold border-b flex items-center justify-between"
                @click="goToProfile">
                <span class="material-symbols-outlined"> person </span>
                <span>Profile</span>
              </li>

              <li v-if="role === 'admin'"
                class="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-custom-orange hover:font-bold border-b flex items-center justify-between"
                @click="goToBackend">
                <span class="material-symbols-outlined"> shield_person </span>
                <span>Admin Page</span>
              </li>

              <li
                class="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-red-500 hover:font-bold hover:rounded-b-md border-b flex items-center justify-between"
                @click="logout">
                <span class="material-symbols-outlined"> logout </span>
                <span>Logout</span>
              </li>
            </ul>
          </div>


        </div>
      </div>

      <div v-else class="flex items-center space-x-2">
        <span class="text-black cursor-pointer flex items-center space-x-2 font-bold hover:text-custom-orange-hover"
          @click="goToLogin">
          <span class="material-symbols-outlined">
            account_circle
          </span>
          <span>Login</span>
        </span>
      </div>


    </header>

    <main class="flex-1 p-4 px-32 relative">
      <router-view></router-view>
    </main>

  </div>
</template>

<script>
import api from '@/services/auth';
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      role: '',
      isLoggedIn: false,
      isMenuOpen: false, // สถานะการแสดงเมนู
      isUserRegistered: false,
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    // ตรวจสอบสถานะการล็อกอินและดึงชื่อผู้ใช้
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.getUserProfile();
      }
    },
    async getUserProfile() {
      try {
        const res = await api.getProfile(); // ใช้ฟังก์ชันจาก service
        this.username = res.username; // ตั้งค่าชื่อผู้ใช้
        this.role = res.role;
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
    },
    goToLogin() {
      this.$router.push('/login'); // เมื่อกด login จะไปที่หน้า login
    },
    // ฟังก์ชันเพื่อแสดง/ซ่อนเมนู
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    goToHome() {
      this.$router.push('/premium-health'); // เปลี่ยนเส้นทางไปหน้า test2
    },
    goToProfile() {
      this.$router.push('/profile'); // เปลี่ยนเส้นทางไปที่หน้าโปรไฟล์
    },
    goToBackend() {
      this.$router.push('/master'); // เปลี่ยนเส้นทางไปที่หน้าโปรไฟล์
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.username = '';
      this.$router.push('/'); 
    },

    checkIfAdmin() {
      if (this.role === 'admin') {
        console.log("User is an admin.");
      } else {
        console.log("User is not an admin.");
      }
    }
  },
  async mounted() {
    try {
      // เช็คว่า user_id ของผู้ใช้ที่ล็อกอินมีอยู่ในฐานข้อมูลหรือไม่
      const response = await axios.get('http://127.0.0.1:3333/check-user-registration');
      if (response.data.isRegistered) {
        this.isUserRegistered = true;
      }
    } catch (error) {
      console.error('Error checking user registration', error);
    }
  },
  watch: {
    // เพิ่ม watch เพื่ออัพเดตสถานะการล็อกอินเมื่อ token ถูกเปลี่ยน
    '$route'() {
      this.checkLoginStatus();
    }
  },
  computed: {
    // ดึง userRole จาก Vuex store
    userRole() {
      return this.$store.getters.getUserRole;
    }
  },
};
</script>

<style scoped></style>
