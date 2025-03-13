<template>
  <div
    class="flex items-center justify-center min-h-screen fixed inset-0 bg-gradient-to-r from-custom-orange to-custom-orange-hover">

    <div class="flex flex-col items-center">

      <!-- Modal โลโก้ -->
      <div class="w-full max-w-md bg-white px-4 py-3 rounded-t-lg shadow-lg flex justify-center items-center relative">
        <img src="@/assets/fitfood_logo.png" alt="Logo" class="w-12 h-12">
        <div class="leading-none ml-2">
          <p class="text-lg font-bold">ABSOLUTE</p>
          <p class="text-lg font-bold text-custom-orange -mt-3">FITFOOD</p>
        </div>
      </div>

      <!-- Modal Form -->
      <div class="bg-white bg-opacity-60 backdrop-blur-md w-full max-w-md p-8 rounded-b-lg shadow-lg border">
        <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>

        <p v-if="error" class="mb-4 text-red-500 text-center font-bold">{{ error }}</p>

        <form @submit.prevent="login" class="space-y-4">
          <input type="text" v-model="identifier" placeholder="Email or Username" required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
          <input type="password" v-model="password" placeholder="Password" required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />

          <div class="flex items-center justify-between">
            <!-- Remember Me -->
            <div class="flex items-center">
              <input type="checkbox" id="rememberMe" v-model="rememberMe"
                class="w-4 h-4 accent-custom-orange focus:ring-0">
              <label for="rememberMe" class="ml-2 text-gray-700 text-sm">Remember Me</label>
            </div>

            <!-- Forgot Password -->
            <router-link to="/forgot-password" class="text-sm text-custom-orange hover:underline">
              Forgot Password?
            </router-link>
          </div>



          <button type="submit"
            class="w-full bg-custom-orange text-white py-2 rounded-md hover:bg-custom-orange-hover transition">
            Login
          </button>
        </form>

        <!-- ข้อความสมัครสมาชิก -->
        <p class="mt-4 text-center text-gray-700">
          Don't have an account?
          <button @click="goToRegister" class="text-custom-orange hover:underline font-bold">
            Register
          </button>
        </p>
      </div>

    </div>

  </div>
</template>

<script>
import AuthService from '@/services/auth';

export default {
  data() {
    return {
      identifier: localStorage.getItem('rememberedIdentifier') || '', // ดึง email จาก localStorage
      password: localStorage.getItem('rememberedPassword') || '', // ดึง password จาก localStorage
      rememberMe: localStorage.getItem('rememberMe') === 'true', // ถ้าเคยติ๊ก remember
      error: null
    };
  },
  methods: {
    async login() {
      try {
        await AuthService.login(this.identifier, this.password, this.$store);
        if (this.rememberMe) {
          localStorage.setItem('rememberedIdentifier', this.identifier); // เก็บ email
          localStorage.setItem('rememberedPassword', this.password); // เก็บ password
          localStorage.setItem('rememberMe', 'true'); // เก็บสถานะ remember
        } else {
          localStorage.removeItem('rememberedIdentifier'); // ลบ email
          localStorage.removeItem('rememberedPassword'); // ลบ password
          localStorage.removeItem('rememberMe'); // ลบสถานะ remember
        }

        this.$router.push('/'); // ไปหน้าหลังล็อกอินสำเร็จ
      } catch (err) {
        this.error = 'Login failed';
      }
    },
    goToRegister() {
      this.$router.push('/register'); // ไปหน้าสมัครสมาชิก
    }
  }
};
</script>
