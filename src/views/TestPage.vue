<template>
  <div class="add relative inline-block">
    <button @click="openAddModal"
      class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
      <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
      <span class="text-white text-base leading-none">เพิ่ม</span>
    </button>

    <div v-if="isAddModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">


      <div
        class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
        :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
        <span class="material-symbols-outlined text-white">error</span>
        <span>{{ toastErrorMessage }}</span>
        <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[500px] flex flex-col">

        <!-- Header -->
        <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
          <h2 class="text-xl font-bold">เพิ่มประเภทเมนู</h2>
          <span @click="closeAddModal" class="material-symbols-outlined cursor-pointer hover:text-gray-200">close</span>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4 ">
          <div>
            <label for="promotionType" class="block font-bold text-gray-700">ลูกค้า</label>
            <multiselect v-model="newOrder.customer_id" :options="customers" :multiple="false" :searchable="true"
              :close-on-select="true" placeholder="เลือกประเภทโปรแกรมเมนู" label="name" track-by="id" class="z-50" />
          </div>

          <div>
            <label for="menu" class="block font-bold text-gray-700">Promotion Type</label>
            <multiselect v-model="newOrder.menu_id" :options="menus" :custom-label="customLabel"
              placeholder="เลือก Promotion Type" track-by="id" label="name_thai" />
          </div>

          <div>
            <label for="menu" class="block font-bold text-gray-700">จำนวน</label>
            <input type="number" v-model="newOrder.quantity" min="0" required />
          </div>

          <div class="flex-1">
            <label for="orderDate" class="block font-bold text-gray-700">วันที่สั่ง</label>
            <input v-model="newOrder.order_date" id="orderDate" type="date"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
          </div>
          
          <div>
            <label for="package_status" class="block font-bold text-gray-700">สถานะการตัดแพ็คเกจ:</label>
            <select v-model="newOrder.package_status" class="border px-2 py-1 rounded w-full">
              <option value="calculate">ตัดแพ็คเกจ</option>
              <option value="not_calculate">ไม่ตัดแพ็คเกจ</option>
            </select>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
          <button @click="closeAddModal" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
            ยกเลิก
          </button>
          <button @click="addOrder"
            class="px-4 py-2 rounded bg-custom-orange text-white hover:bg-custom-orange-hover">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import { API_URL } from "@/services/testapi";

export default {
  components: {
    Multiselect
  },
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
