<template>
    <div>
      <h2>Forgot Password</h2>
      <form @submit.prevent="handleForgotPassword">
        <input v-model="email" type="email" placeholder="Enter your email" required />
        <button type="submit">Send Reset Link</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import AuthService from "@/services/auth";
  
  export default {
    data() {
      return {
        email: "",
        errorMessage: "",
        successMessage: ""
      };
    },
    methods: {
      async handleForgotPassword() {
        try {
          this.errorMessage = "";
          this.successMessage = "";
  
          const response = await AuthService.forgotPassword(this.email);
          this.successMessage = response.message || "Password reset link sent!";
        } catch (error) {
          this.errorMessage = error.message || "Failed to send reset link.";
        }
      }
    }
  };
  </script>
  