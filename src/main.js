// import { createApp } from 'vue'
// import App from './App.vue'
// import './assets/tailwind.css';

// createApp(App).mount('#app')

import { createApp } from 'vue';
import App from './App.vue';
import store from './store'
import router from './router'; // Import Vue Router
import './assets/tailwind.css'; // Tailwind CSS
// import VueProgressBar from 'vue-progressbar';

// const options = {
//   color: '#ff5733', // สีของแถบโหลด
//   failedColor: '#874b4b',
//   thickness: '5px',  // ความหนาของแถบ
//   transition: {
//     speed: '0.2s',
//     opacity: '0.6s',
//     termination: 300,
//   },
//   autoRevert: true,
//   location: 'top', // แสดงที่ด้านบน
//   inverse: false,
// };

const app = createApp(App);
// app.use(VueProgressBar, options);
app.use(store);
app.use(router); // ใช้ Vue Router
app.mount('#app');
