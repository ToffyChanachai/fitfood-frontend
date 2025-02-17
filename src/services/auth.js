// src/services/AuthService.js
import axios from "axios";
const API_URL = "http://127.0.0.1:3333"; 
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
        throw new Error("Token is undefined or invalid");
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

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await axios.put(
        `${API_URL}/users/update-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data; // จะได้ข้อความสำเร็จจาก API
    } catch (error) {
      console.error(
        "Error changing password:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error.message;
    }
  },
};
