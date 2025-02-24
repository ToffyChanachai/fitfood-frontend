<template>
  <div>
    <h1>ดูประวัติการสั่งซื้อของผู้ใช้</h1>
    
    <!-- Form สำหรับเลือก user_id หรือป้อน user_id -->
    <input v-model="userId" placeholder="ป้อน user_id" type="number" />
    <button @click="fetchOrders">ดูประวัติ</button>
    
    <div v-if="loading">กำลังโหลด...</div>
    
    <div v-else>
      <table v-if="orders.length > 0">
        <thead>
          <tr>
            <th>หมายเลขคำสั่งซื้อ</th>
            <th>วันที่สั่งซื้อ</th>
            <th>สถานะ</th>
            <th>จำนวน</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.order_date }}</td>
            <td>{{ order.status }}</td>
            <td>{{ order.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="orders.length === 0">ไม่มีประวัติการสั่งซื้อสำหรับผู้ใช้คนนี้</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userId: '', // ใช้เพื่อเก็บ user_id ที่จะค้นหา
      orders: [],
      loading: false,
    };
  },
  methods: {
    async fetchOrders() {
      if (!this.userId) {
        alert("กรุณาป้อน user_id");
        return;
      }

      this.loading = true;

      try {
        // ตรวจสอบว่ามี baseURL หรือยัง หากไม่มีให้ใส่ไว้ตรงนี้
        const response = await axios.get(`http://127.0.0.1:3333/orders/user/${this.userId}`);
        this.orders = response.data.orders;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงประวัติการสั่งซื้อ:", error.response || error.message);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* สไตล์สำหรับตาราง */
table {
  width: 100%;
  margin-top: 20px;
}
th, td {
  padding: 10px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
