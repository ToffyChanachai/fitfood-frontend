<template>
    <div>
      <h1>Welcome, {{ user.username }}</h1>
      <p>Email: {{ user.email }}</p>
      <p>Name: {{ user.fullname }}</p>
    </div>
  </template>
  
  <script>
  import AuthService from '@/services/auth';
  
  export default {
    data() {
      return {
        user: {},
        error: null
      };
    },
    created() {
      this.fetchProfile();
    },
    methods: {
      async fetchProfile() {
        try {
          this.user = await AuthService.getProfile();
        } catch (err) {
          this.error = err.message || 'Failed to fetch profile';
        }
      },
      async logout() {
        try {
          await AuthService.logout();
          this.$router.push('/test');
        } catch (err) {
          this.error = err.message || 'Logout failed';
        }
      }
    }
  };
  </script>
  