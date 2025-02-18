<template>
  <div>
    <div
      class="fixed top-4 right-8 bg-green-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
      :class="{
        'opacity-100': showSuccessToast,
        'opacity-0': !showSuccessToast,
      }">
      <span class="material-symbols-outlined text-white">check_circle</span>
      <span>{{ toastSuccessMessage }}</span>
      <button @click="showSuccessToast = false" class="text-white hover:text-gray-200 focus:outline-none">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <div
      class="fixed top-4 right-8 bg-red-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
      :class="{ 'opacity-100': showFailToast, 'opacity-0': !showFailToast }">
      <span class="material-symbols-outlined text-white">cancel</span>
      <span>{{ toastFailMessage }}</span>
      <button @click="showFailToast = false" class="text-white hover:text-gray-200 focus:outline-none">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <button @click="printTable" class="bg-blue-500 text-white px-4 py-2 rounded">
      พิมพ์ข้อมูล
    </button>

    <div class="flex items-center space-x-3 py-2">
      <!-- ปุ่มลูกศรย้อนกลับ -->
      <button @click="changeDate(-1)" class="flex items-center">
        <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
          chevron_backward
        </span>
      </button>

      <button @click="setToday" class="flex items-center text-custom-orange hover:underline hover:text-custom-orange">
        <span class="mr-2 font-bold">วันนี้</span>
      </button>

      <button @click="changeDate(1)" class="flex items-center">
        <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
          chevron_forward
        </span>
      </button>

      <strong class="text-gray-700">Start Date:</strong>
      <input ref="startDatepicker" type="text" v-model="formattedStartDate" @input="onStartDateChange"
        class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-[150px]"
        placeholder="เลือกวันที่เริ่มต้น" />

      <strong class="text-gray-700">End Date:</strong>
      <input ref="endDatepicker" type="text" v-model="formattedEndDate" @input="onEndDateChange"
        class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-[150px]"
        placeholder="เลือกวันที่สิ้นสุด" />


    </div>


    <div class="flex justify-end items-center space-x-2 relative">
      <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
        <span class="material-symbols-outlined text-2xl text-gray-700">calendar_month</span>
        <span class="text-m text-gray-700">จำนวนการยอดขายประจำวันทั้งหมด: </span>
        <span class="text-m text-custom-orange font-bold"> {{ orders.length }} รายการ</span>
      </div>

      <div class="mt-4 px-4 flex justify-end space-x-1">
        <button
          v-if="selectedOrders.some(order => order.status === 'pending') && !selectedOrders.some(order => order.status === 'confirm')"
          @click="confirmMultipleOrders" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
          :disabled="selectedOrders.length === 0">
          ยืนยันการสั่งซื้อที่เลือก ({{ selectedOrders.length }})
        </button>

        <button
          v-if="selectedOrders.some(order => order.status === 'confirm') && !selectedOrders.some(order => order.status === 'pending')"
          @click="pendingMultipleOrders" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
          :disabled="selectedOrders.length === 0">
          ยกเลิกยืนยันการสั่งซื้อที่เลือก ({{ selectedOrders.length }})
        </button>
      </div>
    </div>





    <table ref="printTable" class="min-w-full table-auto rounded-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white">
          <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
            :style="{ width: headerWidths[index], cursor: 'pointer' }" @click="sortColumn(header)"
            class="items-center hover:text-gray-200">
            <span>{{ header }}</span>
            <span v-if="header === 'Transaction Date'" class="ml-2 items-center">
              <span class="material-symbols-outlined text-sm">{{ sortIcon }}</span>
            </span>
          </th>
        </tr>

      </thead>

      <tbody>
        <tr v-for="(order, index) in groupedOrders" :key="index" class="border-b border-b-gray-200 bg-white relative">
          <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

          <!-- <td class="px-4 py-2 align-top font-bold border-l border-r text-custom-orange pb-5"
    v-if="shouldDisplayOrderDate(index, order.order_date)" 
    :rowspan="getOrderDateRowspan(order.order_date, index)">
  {{ formatDate(order.order_date) }}
</td> -->


          <td class="px-4 py-2 align-top pb-5">{{ formatDate(order.order_date) }}</td>
          <td class="px-4 py-2 align-top pb-5">{{ getMenuTypeName(order.menu_type_id) }}</td>
          <td class="px-4 py-2 align-top pb-5">{{ getMealTypeName(getMealTypeID(order.menu_id)) }}</td>
          <td class="px-4 py-2 align-top pb-5">
            <div>{{ order.menu_eng_name }}</div>
            <div>({{ order.menu_name }})</div>
          </td>

          <td class="px-4 py-2 align-top pb-5">{{ order.quantity }}</td>
        </tr>

        <tr v-if="groupedOrders.length === 0">
          <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">ไม่พบข้อมูล </td>
        </tr>
      </tbody>

    </table>

  </div>


</template>

<script>
import axios from 'axios';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
//import Multiselect from 'vue-multiselect';

export default {
  data() {
    return {
      headers: ['#', 'วันที่สั่งซื้อ', 'Packge Type', 'ประเภทอาหาร', 'รายการอาหาร', 'จำนวน'],
      headerWidths: ['5%', '15%', '15%', '20%', '30%', '10%'],
      sortDirection: 'asc', // กำหนดทิศทางการเรียงลำดับ (asc หรือ desc)
      sortIcon: 'arrow_downward',

      orders: [],

      // filteredOrders: [],
      selectedDate: "",
      customers: [],
      menus: [],
      menu_types: [],
      meal_types: [],

      selectedOrder: {
        id: '',
        menu_id: '',
        quantity: 0,
        order_date: '',
        user_id: '',
        menu_type_id: '',
        status: '',
      },
      selectedOrders: [],

      isConfirmStatusModalOpen: false,
      isAllSelected: false,

      currentPage: 1,
      itemsPerPage: 10,

      startDate: '', // วันที่เริ่มต้น
      endDate: '',

      toastSuccessMessage: "",
      showSuccessToast: false,
      toastFailMessage: "",
      showFailToast: false,
      showErrorToast: false,
      toastErrorMessage: "",

    };
  },
  // components: {
  //     Multiselect
  // },
  computed: {
    filteredOrders() {
      // เรียกดูรายการทั้งหมด และคำนวณการแสดงผลในแต่ละหน้า
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = this.currentPage * this.itemsPerPage;
      return this.orders.slice(startIndex, endIndex);
    },
    // totalPages() {
    //   return Math.ceil(this.orders.length / this.itemsPerPage);
    // },
    // totalPagesArray() {
    //   const maxVisiblePages = 5;
    //   const halfVisible = Math.floor(maxVisiblePages / 2);

    //   let start = this.currentPage - halfVisible;
    //   let end = this.currentPage + halfVisible;

    //   if (start < 1) {
    //     start = 1;
    //     end = Math.min(maxVisiblePages, this.totalPages);
    //   }

    //   if (end > this.totalPages) {
    //     end = this.totalPages;
    //     start = Math.max(1, this.totalPages - maxVisiblePages + 1);
    //   }

    //   return {
    //     start,
    //     end,
    //     range: Array.from({ length: end - start + 1 }, (_, i) => start + i),
    //   };
    // },
    formattedStartDate() {
      if (!this.startDate) return ""; // หากยังไม่ได้เลือกวันที่
      return new Intl.DateTimeFormat("en-UK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(this.startDate));
    },
    formattedEndDate() {
      if (!this.endDate) return ""; // หากยังไม่ได้เลือกวันที่
      return new Intl.DateTimeFormat("en-UK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(this.endDate));
    },

    groupedOrders() {
      const groupedByDate = this.orders.reduce((acc, order) => {
        if (!acc[order.order_date]) {
          acc[order.order_date] = [];
        }

        const existingOrder = acc[order.order_date].find(item => item.menu_id === order.menu_id);
        if (existingOrder) {
          existingOrder.quantity += order.quantity;
        } else {
          acc[order.order_date].push({
            menu_id: order.menu_id,
            quantity: order.quantity,
            menu_name: this.getMenuName(order.menu_id),
            menu_eng_name: this.getMenuEngName(order.menu_id),
            order_date: order.order_date,
            menu_type_id: order.menu_type_id,
          });
        }

        return acc;
      }, {});

      // แปลง object เป็น array
      return Object.keys(groupedByDate).flatMap(order_date => groupedByDate[order_date]);
    }



  },
  methods: {
    // goToPage(page) {
    //   if (page >= 1 && page <= this.totalPages) {
    //     this.currentPage = page;
    //   }
    // },
    // updatePage() {
    //     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    //     const endIndex = startIndex + this.itemsPerPage;

    //     this.filteredPackage = this.packages.filter((packaged) => {
    //         const matchesSearch = packaged.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
    //             packaged.id.toString().includes(this.searchQuery);
    //         const matchesProgram = this.selectedProgram.length === 0 || this.selectedProgram.includes(packaged.program_id);
    //         return matchesSearch && matchesProgram;
    //     }).slice(startIndex, endIndex);
    // },

    formatDate(dateString) {
      if (!dateString) return ""; // หากยังไม่ได้เลือกวันที่

      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const date = new Date(dateString);
      const day = date.getDate(); // วันที่
      const month = months[date.getMonth()]; // ชื่อเดือนแบบย่อ
      const year = date.getFullYear(); // ปี

      return `${day} ${month} ${year}`; // รูปแบบ "28 Jan 2025"
    },
    formatPrice(price) {
      return '฿' + new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,  // ตั้งค่าจำนวนตำแหน่งทศนิยมขั้นต่ำ
        maximumFractionDigits: 2   // ตั้งค่าจำนวนตำแหน่งทศนิยมสูงสุด
      }).format(price);
    },
    formatPercent(percent) {
      return new Intl.NumberFormat("th-TH").format(percent) + "%";
    },

    onStartDateChange(event) {
      const inputDate = new Date(event.target.value);
      if (!isNaN(inputDate)) {
        this.startDate = inputDate.toISOString(); // เก็บวันที่ในรูปแบบ ISO
      }
    },
    onEndDateChange(event) {
      const inputDate = new Date(event.target.value);
      if (!isNaN(inputDate)) {
        this.endDate = inputDate.toISOString(); // เก็บวันที่ในรูปแบบ ISO
      }
    },

    sortColumn(header) {
      if (header === 'Transaction Date') {
        // สลับทิศทางการเรียงลำดับเมื่อคลิก
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        // กำหนดไอคอนให้เหมาะสมกับทิศทางการเรียงลำดับ
        this.sortIcon = this.sortDirection === 'asc' ? 'arrow_downward' : 'arrow_upward';

        // เรียงลำดับข้อมูลตามวันที่ชำระเงิน
        this.filteredOrders.sort((a, b) => {
          const dateA = new Date(a.paid_date);
          const dateB = new Date(b.paid_date);

          return this.sortDirection === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        });
      }
    },

    async fetchOrders(startDate, endDate) {
      try {
        const response = await axios.get('http://127.0.0.1:3333/orders/date-range', {
          params: { start_date: startDate, end_date: endDate }, // ส่งค่าพารามิเตอร์ start_date และ end_date
        });

        this.orders = response.data.orders;
        this.filteredOrders = this.orders;

        console.log('Data', this.orders);

        this.orders.sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);
          return dateA - dateB; // เรียงจากน้อยไปหามาก
        });


      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    },

    async fetchLookupData() {
      try {
        const [customersRes, menuRes, menuTypeRes, mealTypeRes] = await Promise.all([
          axios.get("http://127.0.0.1:3333/customers"),
          axios.get("http://127.0.0.1:3333/menus"),
          axios.get("http://127.0.0.1:3333/menu-types"),
          axios.get("http://127.0.0.1:3333/meal-types"),
        ]);
        this.customers = customersRes.data;
        this.menus = menuRes.data;
        this.menu_types = menuTypeRes.data;
        this.meal_types = mealTypeRes.data;
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },

    getCustomerName(customerId) {
      const customer = this.customers.find((c) => c.user_id === customerId);
      return customer ? customer.name : null;
    },
    getMenuName(menuId) {
      const menu = this.menus.find((c) => c.id === menuId);
      return menu ? menu.name_thai : null;
    },
    getMenuEngName(menuId) {
      const menu = this.menus.find((c) => c.id === menuId);
      return menu ? menu.name_english : null;
    },
    getMenuTypeName(menuId) {
      const menu = this.menu_types.find((c) => c.id === menuId);
      return menu ? menu.name : null;
    },
    getMealTypeID(menuId) {
      const menu = this.menus.find((c) => c.id === menuId);
      return menu ? menu.meal_type_id : null;
    },
    getMealTypeName(mealId) {
      const menu = this.meal_types.find((c) => c.id === mealId);
      return menu ? menu.name : null;
    },
    getStatusText(status) {
      return status === "confirm" ? "ยืนยันการสั่งซื้อแล้ว" : "ยังไม่ได้ยืนยันการสั่งซื้อ";
    },
    getStatusClass(status) {
      return status === "confirm"
        ? "text-white bg-green-500"
        : "text-white bg-red-500";
    },

    changeDate(offset) {
      const startDate = new Date(this.startDate);
      startDate.setDate(startDate.getDate() + offset); // เลื่อนวันตาม offset
      this.startDate = startDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

      const endDate = new Date(this.endDate);
      endDate.setDate(endDate.getDate() + offset); // เลื่อนวันตาม offset
      this.endDate = endDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

      this.fetchOrdersData(); // เรียกฟังก์ชันหลังจากเลื่อนวันที่
    },

    setToday() {
      const today = new Date().toISOString().split('T')[0]; // ค่าของวันที่วันนี้
      this.startDate = today;  // กำหนด startDate เป็นวันนี้
      this.endDate = today;    // กำหนด endDate เป็นวันนี้
      this.fetchOrdersData();   // เรียกฟังก์ชันหลังจากตั้งค่า startDate และ endDate
    },

    fetchOrdersData() {
      if (this.startDate && this.endDate) {
        this.fetchOrders(this.startDate, this.endDate);
      }
    },

    shouldDisplayOrderDate(index, orderDate) {
      // แสดงวันที่ในแถวแรกของแต่ละกลุ่ม order_date ที่ซ้ำกัน
      return index === 0 || this.orders[index - 1].order_date !== orderDate;
    },

    getOrderDateRowspan(orderDate, index) {
      // คำนวณจำนวนแถวที่มีวันที่เดียวกัน
      let count = 0;
      for (let i = index; i < this.orders.length; i++) {
        if (this.orders[i].order_date === orderDate) {
          count++;
        } else {
          break;
        }
      }
      return count;
    },

    onViewDetails(dailySale) {
      this.selectedDailySaleDetail = { ...dailySale };
      this.isDetailModalOpen = true;
    },
    closeDetailModal() {
      this.isDetailModalOpen = false;
      this.selectedDailySaleDetail = {};
    },

    formatLabel(key) {
      const labels = {
        paid_date: 'Transaction Date',
        customer_id: `Customer's Name`,
        package_type_id: 'Package Type',
        package_id: 'Package/Purchase Details',
        promotion_type_id: 'Sales Category',
        package_price: 'Package Price',
        package_detail: 'Details',
        discount: 'Additional Discount',
        extra_charge: '% Extra Charge',
        extra_charge_price: 'Extra Charge Value',
        total_package_price: 'Purchase Value',
        total_delivery_price: 'ค่าจัดส่งรวม',
        total_price: 'ยอดขายรวม',
        payment_type_id: 'วิธีการชำระเงิน',
        seller_name_id: 'Sales Rep',
      };
      return labels[key] || key;
    },

    openConfirmSatatusModal(saleRecord) {
      this.selectedOrder = saleRecord;
      this.isConfirmStatusModalOpen = true;
    },
    closeConfirmStatusModal() {
      this.isConfirmStatusModalOpen = false;
      // this.selectedOrder = null;
      this.selectedPaidDate = "";
    },
    async confirmStatus() {
      try {
        const newStatus =
          this.selectedOrder.status === "confirm" ? "pending" : "confirm";

        const payload = {
          status: newStatus,
        };

        const response = await axios.put(
          `http://127.0.0.1:3333/order/${this.selectedOrder.id}/status`,
          payload
        );
        await this.fetchOrders();

        if (response.status === 200) {
          const updatedOrder = response.data.data;
          const index = this.orders.findIndex(
            (record) => record.id === updatedOrder.id
          );
          if (index !== -1) {
            this.orders[index] = updatedOrder;
          }
          this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        console.error(
          "Error response data:",
          error.response?.data || "No additional data"
        );
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
      }
      this.closeConfirmStatusModal();
    },

    async confirmMultipleOrders() {
      if (this.selectedOrders.length === 0) return;
      const orderIds = this.selectedOrders.map(order => order.id);
      console.log("Selected Orders:", this.selectedOrders);

      try {
        const response = await fetch("http://127.0.0.1:3333/order/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_ids: orderIds,
            status: "confirm",
          }),
        });
        await response.json();

        if (response.ok) {
          this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
          this.selectedOrders = [];
          await this.fetchOrders(this.startDate, this.endDate);
        } else {
          this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
        }
      } catch (error) {
        console.error("Error:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการเชื่อมต่อ!");
      }
    },
    async pendingMultipleOrders() {
      if (this.selectedOrders.length === 0) return;
      const orderIds = this.selectedOrders.map(order => order.id);

      try {
        const response = await fetch("http://127.0.0.1:3333/order/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_ids: orderIds,
            status: "pending",
          }),
        });
        await response.json();

        if (response.ok) {
          this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
          this.selectedOrders = [];
          await this.fetchOrders(this.startDate, this.endDate);
        } else {
          this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
        }
      } catch (error) {
        console.error("Error:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการเชื่อมต่อ!");
      }
    },
    selectOrder(order) {
      if (!this.selectedOrders.includes(order)) {
        this.selectedOrders.push(order);
      } else {
        this.selectedOrders = this.selectedOrders.filter(item => item.id !== order.id);
      }
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedOrders = [...this.filteredOrders];  // เลือกคำสั่งซื้อทั้งหมด
      } else {
        this.selectedOrders = [];  // ยกเลิกการเลือกทั้งหมด
      }
      this.isAllSelected = event.target.checked;
    },


    showSuccessToastNotification(message) {
      this.toastSuccessMessage = message;
      this.showSuccessToast = true;
      setTimeout(() => {
        this.showSuccessToast = false;
      }, 3000);
    },
    showFailToastNotification(message) {
      this.toastFailMessage = message;
      this.showFailToast = true;
      setTimeout(() => {
        this.showFailToast = false;
      }, 3000);
    },
    showErrorToastNotification(message) {
      this.toastErrorMessage = message;
      this.showErrorToast = true;
      setTimeout(() => {
        this.showErrorToast = false;
      }, 3000);
    },


    printTable() {
  const tableElement = this.$refs.printTable; // ดึงตารางโดยใช้ ref

  if (tableElement) { // ตรวจสอบว่าตารางมีอยู่ใน DOM หรือไม่
    // ทำการตั้งค่าสไตล์สำหรับการพิมพ์
    const printStyle = `
      <style>
        @media print {
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .header-container { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; }
          .logo { width: 180px; }
        }
      </style>
    `;

    // สร้างเนื้อหาที่จะพิมพ์
    let printContent = `
      <div class="header-container">
        <h2><span style="color: black;" class="left-align">Kitchen Orders Report</h2>
        <img src="/logo_fitfood_full.png" class="logo" id="print-logo">
      </div>
    `;

    const groupedData = this.orders.reduce((result, order) => {
      const date = order.order_date;
      const menuType = this.getMenuTypeName(order.menu_type_id);
      const mealType = this.getMealTypeName(this.getMealTypeID(order.menu_id));
      const menuId = order.menu_id;

      // ดึงชื่อเมนูโดยใช้ getMenuEngName
      const menuName = this.getMenuEngName(menuId);  // ใช้ฟังก์ชันเพื่อดึงชื่อเมนู

      if (!result[menuType]) result[menuType] = {};
      if (!result[menuType][date]) result[menuType][date] = {};
      if (!result[menuType][date][mealType]) result[menuType][date][mealType] = {};
      if (!result[menuType][date][mealType][menuName]) {
        result[menuType][date][mealType][menuName] = 0;
      }
      result[menuType][date][mealType][menuName] += order.quantity;

      return result;
    }, {});

    let isFirstPage = true;

    for (const menuType in groupedData) {
      if (isFirstPage) {
        printContent += `<h2 style="text-align: center;">${menuType}</h2>`;
        isFirstPage = false; // หลังจากหน้าแรกแล้วให้ไม่แสดงบนหน้าแรกอีก
      } else {
        printContent += `<h2 style="page-break-before: always; text-align: center;">${menuType}</h2>`;
      }

      for (const date in groupedData[menuType]) {
        printContent += `<h3>${this.formatDate(date)}</h3>`; // แสดง วันที่

        for (const mealType in groupedData[menuType][date]) {
          printContent += `<h3 style="color: #EF9118; text-decoration: underline;">${mealType}</h3>`; // แสดง Meal Type และขีดเส้นใต้

          const menuItems = groupedData[menuType][date][mealType];
          for (const menuName in menuItems) {
            printContent += `<p><strong>${menuItems[menuName]}</strong> - ${menuName}</p>`; // แสดงชื่อเมนูและจำนวน
          }
        }
        printContent += `<br>`; // แสดงชื่อเมนูและจำนวน
      }
    }

    // สร้าง HTML สำหรับการพิมพ์
    const printWindowContent = `
      <html>
        <head>
          ${printStyle}
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `;

    // สร้างไฟล์ที่ต้องการพิมพ์และเรียกคำสั่งพิมพ์
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printWindowContent);
    printWindow.document.close();

    // รอให้โหลดเสร็จแล้วสั่งพิมพ์
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  } else {
    console.error("ไม่พบตารางที่ต้องการพิมพ์");
  }
}










  },
  created() {
    this.filteredOrders = this.orders;
    this.fetchLookupData();
    this.fetchOrders(this.selectedDate);
    // this.updatePage();
  },
  mounted() {
    // document.addEventListener('click', this.handleClickOutside);
    this.fetchLookupData();
    this.fetchOrders(this.selectedDate);
    this.setToday();

    this.$nextTick(() => {
      flatpickr(this.$refs.startDatepicker, {
        dateFormat: "Y-m-d",
        todayButton: true,
        defaultDate: new Date(),
        onChange: (selectedDates, dateStr) => {
          this.startDate = dateStr;
          this.fetchOrdersData();
        }
      });

      flatpickr(this.$refs.endDatepicker, {
        dateFormat: "Y-m-d",
        todayButton: true,
        defaultDate: new Date(),
        onChange: (selectedDates, dateStr) => {
          this.endDate = dateStr;
          this.fetchOrdersData();
        }
      });
    });


  },
  watch: {
    // คอยติดตามการเปลี่ยนแปลงของ selectedOrders
    selectedOrders() {
      this.isAllSelected = this.selectedOrders.length === this.filteredOrders.length;
    },
  }
  // beforeUnmount() {
  //     document.removeEventListener('click', this.handleClickOutside);
  // },
};
</script>

<style scoped>
.dropdown-up {
  bottom: 100%;
  margin-bottom: 4px;
}
</style>