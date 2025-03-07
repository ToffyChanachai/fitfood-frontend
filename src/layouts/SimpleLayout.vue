<template>
  <div>
    <header class="flex justify-between items-center p-4 sm:px-32 bg-white text-white shadow-lg relative">
      <!-- Logo Section -->
      <div class="flex justify-center items-center cursor-pointer" @click="goToHome">
        <img src="@/assets/logo_fitfood_full.png" alt="Logo" class="w-24 h-8 sm:w-40 sm:h-12">
      </div>

      <div v-if="['/premium-health', '/', '/happy-healthy-box'].includes($route.path)"
        class="hidden sm:flex items-center space-x-6 text-black font-bold">
        <router-link to="/premium-health" class="hover:text-custom-orange"
          :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/premium-health' || $route.path === '/' }">
          Premium Health
        </router-link>

        <router-link to="/happy-healthy-box" class="hover:text-custom-orange"
          :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/happy-healthy-box' }">
          Happy Healthy Box
        </router-link>
      </div>

      <div v-if="isLoggedIn" class="flex items-center space-x-4">
        <div class="flex items-center space-x-4">
          <!-- Logged In User -->
          <div v-if="isLoggedIn" class="relative flex items-center space-x-4" ref="menuDropdown">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center space-x-2">
              <!-- Show Text on Desktop -->
              <span class="text-black hidden sm:inline">Welcome,</span>
              <!-- Show Loading Spinner on Mobile -->
              <div class="sm:hidden">
                <div class="w-6 h-6 border-2 border-gray-300 border-t-custom-orange rounded-full animate-spin"></div>
              </div>
              <!-- Show Loading Bar on Desktop -->
              <div class="bg-gray-100 animate-pulse h-6 w-32 rounded-md hidden sm:block"></div>
            </div>

            <!-- User Menu -->
            <span v-else>
              <span @click="toggleMenu" class="cursor-pointer flex items-center space-x-2">
                <!-- Show User Icon on Mobile -->
                <span class="material-symbols-outlined text-black sm:hidden">
                  account_circle
                </span>
                <!-- Show Welcome Text on Desktop -->
                <span class="text-black hidden sm:inline">Welcome, <strong class="text-custom-orange">{{ username
                }}</strong></span>
                <!-- Show Arrow Icon on Desktop -->
                <span :class="{ 'rotate-180': isMenuOpen }"
                  class="material-symbols-outlined text-black transition-transform duration-300 hidden sm:inline">
                  arrow_drop_down
                </span>
              </span>
            </span>

            <!-- Dropdown Menu -->
            <div v-show="isMenuOpen"
              class="absolute right-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-72 sm:w-72 z-50 border">
              <ul class="list-none p-0 m-0">
                <li
                  class="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-custom-orange hover:font-bold border-b flex items-center justify-between"
                  @click="goToProfile">
                  <span class="material-symbols-outlined"> person </span>
                  <span>Profile</span>
                </li>

                <li v-if="!(isUserRegistered && isUserRegisteredHHB)"
                  class="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-custom-orange hover:font-bold border-b flex items-center justify-between"
                  @click="goToRegister">
                  <span class="material-symbols-outlined"> person_add </span>
                  <span>Register Customer Profile</span>
                </li>

                <li
                  class="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-custom-orange hover:font-bold border-b flex items-center justify-between"
                  @click="goToOrderHistory">
                  <span class="material-symbols-outlined">history</span>
                  <span>Orders History</span>
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

    <main class="flex-1 p-4 px-4 sm:px-32 relative min-h-[calc(100vh-80px)] bg-fixed"
      :class="{ 'bg-gradient-to-r from-custom-orange via-orange-500 to-custom-orange-hover text-black': $route.path === '/register-aff' || $route.path === '/register-hhb' }">
      
      <div v-if="['/premium-health', '/', '/happy-healthy-box'].includes($route.path)"
        class="sm:hidden flex justify-center space-x-6 text-black font-bold mb-4 text-sm">
        <router-link to="/premium-health" class="hover:text-custom-orange"
            :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/premium-health' || $route.path === '/' }">
            Premium Health
        </router-link>

        <router-link to="/happy-healthy-box" class="hover:text-custom-orange"
            :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/happy-healthy-box' }">
            Happy Healthy Box
        </router-link>
    </div>
      
      <div v-if="$route.path === '/register-aff' || $route.path === '/register-hhb'"
        class="flex flex-row justify-center space-x-4 sm:space-x-6">
        <span v-if="!isUserRegistered" class="cursor-pointer hover:text-gray-700 text-center"
          @click="$router.push('/register-aff')"
          :class="{ 'border-b-2 border-gray-700 text-gray-700 font-bold': $route.path === '/register-aff' }">
          Absolute FitFood
        </span>

        <span v-if="!isUserRegisteredHHB" class="cursor-pointer hover:text-gray-700 text-center"
          @click="$router.push('/register-hhb')"
          :class="{ 'border-b-2 border-gray-700 text-gray-700 font-bold': $route.path === '/register-hhb' }">
          Happy Healthy Box
        </span>
      </div>

      <div v-if="isOrderHistoryPath"
    class="flex flex-row justify-center space-x-4 sm:space-x-6">
    <span class="cursor-pointer hover:text-custom-orange text-center text-sm sm:text-base"
      @click="$router.push(`/order-history-user/${getCustomerID(id)}`)"
      :class="{ 'border-b-2 border-custom-orange text-custom-orange font-bold text-sm sm:text-base  ': $route.path === `/order-history-user/${getCustomerID(id)}` }">
      Absolute FitFood
    </span>

    <span class="cursor-pointer hover:text-custom-orange text-center text-sm sm:text-base"
      @click="$router.push(`/order-history-hhb-user/${getCustomerHHBID(id)}`)"
      :class="{ 'border-b-2 border-custom-orange text-custom-orange font-bold text-sm sm:text-base': $route.path === `/order-history-hhb-user/${getCustomerHHBID(id)}` }">
      Happy Healthy Box
    </span>
</div>

      <router-view></router-view>
    </main>



  </div>
</template>

<script>
import api from '@/services/auth';
import axios from 'axios';
import { API_URL } from "@/services/api";

export default {
  data() {
    return {
      username: '',
      role: '',
      isLoggedIn: false,
      isMenuOpen: false, // สถานะการแสดงเมนู
      isUserRegistered: false,
      isUserRegisteredHHB: false,
      customers: [],
      customers_hhb: [],

      isLoading: false,
    };
  },
  created() {
    this.checkLoginStatus();
    this.fetchLookupData();
  },
  methods: {
    // ตรวจสอบสถานะการล็อกอินและดึงชื่อผู้ใช้
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.getUserProfile(); // ดึงข้อมูลโปรไฟล์ผู้ใช้
      } else {
        this.isLoggedIn = false;
      }
    },

    async getUserProfile() {
      this.isLoading = true;
      try {
        const res = await api.getProfile(); // ใช้ฟังก์ชันจาก service
        this.username = res.username; // ตั้งค่าชื่อผู้ใช้
        this.role = res.role;
        this.id = res.id;
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
      finally {
        this.isLoading = false; // หมดการโหลด
      }
    },
    async fetchLookupData() {
      try {
        const [
          customersRes,
          customersHHBRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/customers`),
          axios.get(`${API_URL}/customers-hhb`),
        ]);

        this.customers = customersRes.data;
        this.customers_hhb = customersHHBRes.data;

      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },

    goToLogin() {
      this.$router.push('/login'); // เมื่อกด login จะไปที่หน้า login
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    goToHome() {
      this.$router.push('/premium-health');
    },
    goToProfile() {
      this.$router.push('/profile');
      this.isMenuOpen = false;

    },
    goToRegister() {
      if (this.isUserRegistered) {
        this.$router.push('/register-hhb'); // เปลี่ยนเส้นทางไปที่หน้าที่ต้องการ
      } else {
        this.$router.push('/register-aff');
      }
      this.isMenuOpen = false;
    },
    goToOrderHistory() {
      const customerId = this.getCustomerID(this.id);
      this.$router.push(`/order-history-user/${customerId}`);
      this.isMenuOpen = false;
    },
    goToBackend() {
      this.$router.push('/master');
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.username = '';
      this.$router.push('/');
      window.location.reload();
    },

    handleClickOutside(event) {
      if (this.$refs.menuDropdown && !this.$refs.menuDropdown.contains(event.target)) {
        this.isMenuOpen = false;
      }
    },

    checkIfAdmin() {
      if (this.role === 'admin') {
        console.log("User is an admin.");
      } else {
        console.log("User is not an admin.");
      }
    },

    getCustomerID(customerId) {
      const customer = this.customers.find((c) => c.user_id === customerId);
      return customer ? customer.id : "ไม่พบข้อมูล";
    },
    getCustomerHHBID(customerId) {
      const customer = this.customers_hhb.find((c) => c.user_id === customerId);
      return customer ? customer.id : "ไม่พบข้อมูล";
    },

  },
  mounted() {
    if (this.isLoggedIn) {
      try {
        axios.get(`${API_URL}/check-user-registration`)
          .then(response => {
            this.isUserRegistered = response.data.isRegistered;
          });

        axios.get(`${API_URL}/check-user-registration-hhb`)
          .then(response => {
            this.isUserRegisteredHHB = response.data.isRegistered;
          });

        this.getUserProfile();
        this.fetchLookupData();

        document.addEventListener("click", this.handleClickOutside);
      } catch (error) {
        console.error('Error checking user registration', error);
      }
    } else {
      console.log('User not logged in, skipping registration check');
    }
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },



  watch: {
    '$route'() {
      this.checkLoginStatus();
    }

  },
  computed: {
    userRole() {
      return this.$store.getters.getUserRole;
    },
    isOrderHistoryPath() {
      return (
        this.$route.path === `/order-history-user/${this.getCustomerID(this.id)}` ||
        this.$route.path === `/order-history-hhb-user/${this.getCustomerHHBID(this.id)}`
      );
    }
  },
};
</script>

<style scoped>
.spinner-border {
  border-top-color: #FFB539;
  /* เปลี่ยนสีของเส้นด้านบน */
}
</style>
