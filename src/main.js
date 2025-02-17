// import { createApp } from 'vue'
// import App from './App.vue'
// import './assets/tailwind.css';

// createApp(App).mount('#app')

import { createApp } from 'vue';
import App from './App.vue';
import store from './store'
import router from './router'; // Import Vue Router
import './assets/tailwind.css'; // Tailwind CSS

const app = createApp(App);
app.use(store);
app.use(router); // ใช้ Vue Router
app.mount('#app');
