// src/services/AuthService.js
import axios from "axios";
export const API_URL = process.env.VUE_APP_API_URL;
axios.defaults.withCredentials = true;

export default {
  async register(firstname, lastname, username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        firstname,
        lastname,
        username,
        email,
        password,
        role: "customer", 
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async login(identifier, password, store) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        identifier,
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("invalid Password");
      }

      localStorage.setItem("token", token);

      // เรียกใช้ Vuex action เพื่อดึง role ของผู้ใช้
      store.dispatch("fetchUserRole"); // ส่ง store ไปที่ action fetchUserRole

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  async logout() {
    try {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      return true;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
//      console.log("Sending token:", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching profile:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error.message;
    }
  },

  // async forgotPassword(email) {
  //   try {
  //     const response = await axios.post(`${API_URL}/forgot-password`, {
  //       email,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response ? error.response.data : error.message;
  //   }
  // },

  // // ฟังก์ชันสำหรับรีเซ็ตรหัสผ่าน
  // async resetPassword(token, password) {
  //   try {
  //     const response = await axios.post(`${API_URL}/reset-password/${token}`, {
  //       password,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response ? error.response.data : error.message;
  //   }
  // }
};
