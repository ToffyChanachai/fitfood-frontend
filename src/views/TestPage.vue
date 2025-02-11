<template>
  <div>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import AuthService from '@/services/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  methods: {
    async login() {
      try {
        await AuthService.login(this.email, this.password);
        this.$router.push('/test3');
      } catch (err) {
        this.error = err.message || 'Login failed';
      }
    }
  }
};
</script>
