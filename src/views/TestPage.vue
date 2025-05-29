<template>
<div class="max-h-[400px] overflow-y-auto">
  <table class="min-w-full table-auto">
    <thead class="sticky top-0 bg-orange-500 text-white z-10">
      <tr>
        <th class="px-4 py-2 text-left">หัวข้อ 1</th>
        <th class="px-4 py-2 text-left">หัวข้อ 2</th>
        <th class="px-4 py-2 text-left">หัวข้อ 3</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in 100" :key="i">
        <td class="px-4 py-2">ข้อมูล {{ i }}</td>
        <td class="px-4 py-2">...</td>
        <td class="px-4 py-2">...</td>
      </tr>
    </tbody>
  </table>
</div>

</template>

<script>
import axios from "axios";
import { API_URL } from "@/services/api";

export default {
  data() {
    return {
      menus: [], // รายการเมนู
      customers: [], // รายการลูกค้า
      isAddModalOpen: false,
      newOrder: {
        menu_id: null,
        quantity: 0,
        order_date: "",
        customer_id: null,
        package_status: "calculate",
      },
    };
  },
  created() {
    this.fetchMenus();
    this.fetchCustomers();
  },
  methods: {
    // ดึงเมนูทั้งหมด
    async fetchMenus() {
      try {
        const response = await axios.get(`${API_URL}/menus`);
        this.menus = response.data;
      } catch (error) {
        console.error("ไม่สามารถดึงเมนู:", error);
      }
    },
    // ดึงลูกค้าทั้งหมด
    async fetchCustomers() {
      try {
        const response = await axios.get(`${API_URL}/customers`);
        this.customers = response.data;
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลลูกค้า:", error);
      }
    },

    openAddModal() {
      this.isAddModalOpen = true;
    },
    closeAddModal() {
      this.isAddModalOpen = false;
      this.resetNewMealType();
    },
    resetNewMealType() {
      this.newOrder = {
        menu_id: null,
        quantity: 0,
        order_date: "",
        customer_id: null,
        package_status: "calculate",

      };
    },
    async addOrder() {
      if (!this.newOrder.customer_id || !this.newOrder.menu_id) {
        // this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบ!");
        return;
      }
      try {
        const response = await axios.post(`${API_URL}/orders-add`, {
          menu_id: this.newOrder.menu_id.id,
          quantity: this.newOrder.quantity,
          order_date: this.newOrder.order_date,
          customer_id: this.newOrder.customer_id.id,
          package_status: this.newOrder.package_status
        });
        // this.orders.push(response.data);
        console.log("เพิ่มคำสั่งซื้อสำเร็จ:", response.data);

        this.closeAddModal();
        // await this.fetchMealTypes();
        // this.showSuccessToastNotification("เพิ่มข้อมูลสำเร็จ!");
      } catch (error) {
        // this.showErrorToastNotification("เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
      }
    },
  }
};
</script>
