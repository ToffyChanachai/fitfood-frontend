<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-custom-orange to-custom-orange-hover">
      <div class="bg-white bg-opacity-60 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Reset Password</h2>
  
        <form @submit.prevent="resetPassword" class="space-y-4">
          <input type="password" v-model="password" placeholder="New Password" required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
  
          <button type="submit"
            class="w-full bg-custom-orange text-white py-2 rounded-md hover:bg-custom-orange-hover transition">
            Reset Password
          </button>
        </form>
  
        <p v-if="message" class="mt-4 text-green-500 text-center">{{ message }}</p>
        <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
  
        <p class="text-sm text-center text-gray-600 mt-4">
          Go back to 
          <router-link to="/login" class="text-custom-orange hover:underline">Login</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import AuthService from '@/services/auth'
  
  export default {
    data() {
      return {
        password: '',
        token: this.$route.params.token, // รับ token จาก URL
        message: null,
        error: null
      }
    },
    methods: {
      async resetPassword() {
        this.message = null
        this.error = null
        try {
          const response = await AuthService.resetPassword(this.token, this.password)
          this.message = response.message
        } catch (err) {
          this.error = err.message || 'Something went wrong'
        }
      }
    }
  }
  </script>
  