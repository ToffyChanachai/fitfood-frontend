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





    <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white">
          <th class="px-4 py-2 text-left align-center">
            <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
              class="w-4 h-4 accent-black focus:ring-0" />
          </th>
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

        <tr v-for="(order, index) in filteredOrders" :key="index" class="border-b border-b-gray-200 bg-white relative">
          <td class="px-4 py-2 align-top pb-5">
            <input type="checkbox" v-model="selectedOrders" :value="order"
              class="w-4 h-4 accent-custom-orange focus:ring-0" />
          </td>
          <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

          <td class="px-4 py-2 align-top font-bold border-l border-r text-custom-orange pb-5"
            v-if="shouldDisplayUserName(index, order.user_id)" :rowspan="getRowspan(order.user_id, index)">
            {{ getCustomerName(order.user_id) }}
          </td>

          <td class="px-4 py-2 align-top pb-5">{{ formatDate(order.order_date) }}</td>
          <td class="px-4 py-2 align-top pb-5">{{ getMenuTypeName(order.menu_type_id) }}</td>

          <td class="px-4 py-2 align-top pb-5">
            <div>{{ getMenuEngName(order.menu_id) }}</div>
            <div>({{ getMenuName(order.menu_id) }})</div>
          </td>

          <td class="px-4 py-2 align-top pb-5">{{ order.quantity }}</td>

          <td class="px-4 py-2 align-top font-bold pb-5">
            <button @click="openConfirmSatatusModal(order)"
              class="px-4 py-1 rounded-full font-bold focus:outline-none hover:text-gray-200"
              :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </button>

            <div v-if="isConfirmStatusModalOpen"
              class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-10 z-50">

              <div
                class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg transition-opacity duration-300 z-60"
                :class="{
                  'opacity-100': showErrorToast,
                  'opacity-0': !showErrorToast,
                }">

                <span class="material-symbols-outlined text-white">error</span>
                <span>{{ toastErrorMessage }}</span>
                <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
                  <span class="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div class="bg-white rounded-md w-1/3 max-w-lg">
                <!-- Header -->
                <div :class="{
                  'bg-green-500':
                    selectedOrder.status === 'pending',
                  'bg-red-500': selectedOrder.status === 'confirm',
                }" class="flex justify-between items-center text-white px-4 py-2 rounded-t-md">
                  <span class="font-bold">
                    {{
                      selectedOrder.status === "paid"
                        ? "เปลี่ยนสถานะเป็นยังไม่ได้ยืนยันการสั่งซื้อ"
                        : "ยืนยันการสั่งซื้อ"
                    }}
                  </span>
                  <button @click="closeConfirmStatusModal" class="text-white hover:text-gray-200">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>

                <!-- Content -->
                <div class="p-6 space-y-4">
                  <p class="text-gray-700">
                    {{
                      selectedOrder.status === "confirm"
                        ? 'คุณต้องการเปลี่ยนสถานะเป็น "ยังไม่ได้ยืนยันการสั่งซื้อ" หรือไม่?'
                        : "ยืนยันการสั่งซื้อ?"
                    }}
                  </p>

                </div>

                <!-- Footer -->
                <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md">
                  <button @click="closeConfirmStatusModal"
                    class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                    ยกเลิก
                  </button>
                  <button @click="confirmStatus" :class="{
                    'bg-green-500 hover:bg-green-600':
                      selectedOrder.status === 'pending',
                    'bg-red-500 hover:bg-red-600':
                      selectedOrder.status === 'confirm',
                  }" class="text-white px-4 py-2 rounded">
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </td>


        </tr>

        <tr v-if="filteredOrders.length === 0">
          <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">ไม่พบข้อมูล </td>
        </tr>
      </tbody>

      <!-- <div v-if="isDetailModalOpen"
              class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                  <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                      <span class="font-bold"><h2>รายละเอียดยอดขายประจำวัน</h2></span>
                      <div class="flex space-x-2">
                          <span @click="closeDetailModal"
                              class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                              close
                          </span>
                      </div>
                  </div>

                  <div class="pb-2 pt-2">
                      <div v-for="(value, key, index) in filteredDetail" :key="key"
                          :class="index % 2 === 0 ? 'bg-white rounded-none' : 'bg-gray-100 rounded-none'"
                          class="p-2 rounded-md">
                          <p class="pl-3 pr-3"><strong class="mr-2">{{ formatLabel(key) }}:</strong> {{ value }}</p>
                      </div>
                  </div>
              </div>
          </div> -->


    </table>



    <div class="rounded-b-2xl flex justify-center items-center space-x-2 bg-white px-2 py-1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
        class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>

      <div class="flex items-center space-x-1">
        <button v-if="totalPagesArray.start > 1" @click="goToPage(1)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
          1
        </button>
        <button v-if="totalPagesArray.start > 2" @click="goToPage(totalPagesArray.start - 1)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
          ...
        </button>

        <button v-for="page in totalPagesArray.range" :key="page" @click="goToPage(page)"
          :class="['px-3 py-2 rounded-md', { 'bg-custom-orange text-white': currentPage === page, 'bg-white': currentPage !== page }]"
          class="cursor-pointer hover:bg-custom-orange hover:text-white">
          {{ page }}
        </button>

        <button v-if="totalPagesArray.end < totalPages - 1" @click="goToPage(totalPagesArray.end + 1)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
          ...
        </button>
        <button v-if="totalPagesArray.end < totalPages" @click="goToPage(totalPages)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
          {{ totalPages }}
        </button>
      </div>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    </div>

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
      headers: ['#', `Customer's Name`, 'วันที่สั่งซื้อ', 'Packge Type', 'รายการอาหาร', 'จำนวน', 'สถานะ'],
      headerWidths: ['5%', '20%', '15%', '15%', '20%', '10%', '15%'],
      sortDirection: 'asc', // กำหนดทิศทางการเรียงลำดับ (asc หรือ desc)
      sortIcon: 'arrow_downward',

      orders: [],

      // filteredOrders: [],
      selectedDate: "",
      customers: [],
      menus: [],
      menu_types: [],

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

  totalPages() {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  },

  totalPagesArray() {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = this.currentPage - halfVisible;
    let end = this.currentPage + halfVisible;

    if (start < 1) {
      start = 1;
      end = Math.min(maxVisiblePages, this.totalPages);
    }

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, this.totalPages - maxVisiblePages + 1);
    }

    return {
      start,
      end,
      range: Array.from({ length: end - start + 1 }, (_, i) => start + i),
    };
  },
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


  },
  methods: {
    goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  },
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
        const [customersRes, menuRes, menuTypeRes] = await Promise.all([
          axios.get("http://127.0.0.1:3333/customers"),
          axios.get("http://127.0.0.1:3333/menus"),
          axios.get("http://127.0.0.1:3333/menu-types"),
        ]);
        this.customers = customersRes.data;
        this.menus = menuRes.data;
        this.menu_types = menuTypeRes.data;

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

    shouldDisplayUserName(index, userId) {
      return index === 0 || this.orders[index - 1].user_id !== userId;
    },
    getRowspan(userId, index) {
      let count = 0;
      for (let i = index; i < this.orders.length; i++) {
        if (this.orders[i].user_id === userId) {
          count++;
        } else {
          break;
        }
      }
      return count;
    },
    shouldDisplayOrderDate(index, orderDate) {
      return index === 0 || this.orders[index - 1].order_date !== orderDate;
    },
    getOrderDateRowspan(orderDate, index) {
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