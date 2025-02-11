// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3333'; // ใส่ URL ของ AdonisJS ที่คุณใช้งาน

// ตั้งค่า axios ให้ส่งคุกกี้ไปพร้อมคำขอ
axios.defaults.withCredentials = true;

export default {
  async register(firstname, lastname, username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/register`, { firstname, lastname, username, email, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async login(identifier, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { identifier, password });
  
      const token = response.data.token;
  
      if (!token) {
        throw new Error('Token is undefined or invalid');
      }
  
      // เก็บ token ใน localStorage
      localStorage.setItem('token', token);
  
      // ตั้งค่า Authorization header สำหรับคำขอถัดไป
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response ? error.response.data : error.message;
    }
  },  


async logout() {
  try {
    // ลบ token ใน localStorage
    localStorage.removeItem('token');
    // ลบ Authorization header
    delete axios.defaults.headers.common['Authorization'];
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
},

async getProfile() {
    try {
      // ดึง token จาก localStorage และตั้งค่า Authorization header
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      // ตรวจสอบว่า token ส่งไปใน header
      console.log('Sending token:', token);
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : error.message;
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await axios.put(
        `${API_URL}/users/update-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data; // จะได้ข้อความสำเร็จจาก API
    } catch (error) {
      console.error('Error changing password:', error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : error.message;
    }
  }
  
  
};
