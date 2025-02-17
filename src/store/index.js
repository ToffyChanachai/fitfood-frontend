import { createStore } from 'vuex'
import api from '@/services/auth';
// import axios from 'axios';
// const API_URL = "http://127.0.0.1:3333"; // ใส่ URL ของ AdonisJS ที่คุณใช้งาน

const store = createStore({
  state: {
    role: localStorage.getItem('role') || null,
  },
  mutations: {
    setUserRole(state, role) {
      state.role = role; 
      localStorage.setItem('role', role);
    }
  },
  actions: {
    async fetchUserRole({ commit }) {
        try {
          const response = await api.getProfile(); // เรียก API เพื่อลากข้อมูลจาก backend
        //   console.log("API Response:", response);
          const role = response.role || 'customer';  // ถ้าไม่มี role จะตั้งเป็น 'customer'
          commit('setUserRole', role);  
        //   console.log("User role set in Vuex:", role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      
  },
  getters: {
    getUserRole(state) {
      return state.role; // คืนค่าค่า role จาก state
    }
  }
});

export default store;
