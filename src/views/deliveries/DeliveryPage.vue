<template>
  <div class="mt-[-20px]">
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

    <div
      class="fixed top-4 right-8 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
      :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
      <span class="material-symbols-outlined text-white">cancel</span>
      <span>{{ toastErrorMessage }}</span>
      <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
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
        <span class="material-symbols-outlined text-2xl text-gray-700">delivery_truck_speed</span>
        <span class="text-m text-gray-700">จำนวนการจัดส่งอาหารทั้งหมด: </span>
        <span class="text-m text-custom-orange font-bold"> {{ filteredUniqueOrders.length }} รายการ</span>
      </div>

      <div>
        <button
          v-if="selectedOrders.some(order => order.status === 'pending') && !selectedOrders.some(order => order.status === 'confirm')"
          @click="confirmMultipleOrders"
          class="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md flex items-center space-x-1 "
          :disabled="selectedOrders.length === 0">
          ยืนยันการสั่งซื้อที่เลือก ({{ selectedOrders.length }})
        </button>

        <button
          v-if="selectedOrders.some(order => order.status === 'confirm') && !selectedOrders.some(order => order.status === 'pending')"
          @click="pendingMultipleOrders"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-md flex items-center space-x-1"
          :disabled="selectedOrders.length === 0">
          ยกเลิกยืนยันการสั่งซื้อที่เลือก ({{ selectedOrders.length }})
        </button>
      </div>

      <button @click="handlePrint"
        class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
        <span class="material-symbols-outlined text-white text-xl leading-none">print</span>
        <span class="text-white text-base leading-none">Print</span>
      </button>


      <div class="sort relative inline-block" ref="sortDropdown">
        <button @click="toggleSortDropdown"
          class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
          <span class="material-symbols-outlined text-white text-xl leading-none">sort</span>
          <span class="text-white text-base leading-none">จัดเรียง</span>
          <span :class="{ 'rotate-180': isSortDropdownOpen }"
            class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto duration-300">arrow_drop_down</span>
        </button>

        <div v-if="isSortDropdownOpen"
          class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-52 z-50 border border-gray-300">
          <ul class="list-none p-0 m-0">
            <li @click="sortData('id')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามลำดับ</span>
              <span v-if="sortColumn === 'id'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["id"] === 1 ? "arrow_upward" : "arrow_downward"
                }}
              </span>
            </li>
            <li @click="sortData('user_id')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามชื่อลูกค้า</span>
              <span v-if="sortColumn === 'user_id'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["user_id"] === 1
                    ? "arrow_upward"
                    : "arrow_downward"
                }}
              </span>
            </li>
            <li @click="sortData('order_date')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามวันที่สั่งซื้อ</span>
              <span v-if="sortColumn === 'order_date'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["order_date"] === 1
                    ? "arrow_upward"
                    : "arrow_downward"
                }}
              </span>
            </li>
            <li @click="clearSort"
              class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-right border-t hover:underline">
              <span>รีเซ็ตจัดเรียง</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex w-[250px] relative">
        <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
          class="border border-gray-300 rounded-l px-4 py-2 w-full" @keyup.enter="search" />
        <button v-if="searchQuery" @click="clearSearch"
          class="material-symbols-outlined absolute right-[55px] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
          close
        </button>
        <button @click="search"
          class="bg-custom-orange material-symbols-outlined text-white text-xl px-4 py-2 rounded-r hover:bg-custom-orange-hover">
          search
        </button>
      </div>
    </div>

    <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white text-sm">
          <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
            :style="{ width: headerWidths[index] }">
            {{ header }}
          </th>
        </tr>

      </thead>
      <tbody>
        <tr v-if="isLoading" class="bg-white">
          <td colspan="11" class="py-16 text-center">
            <div class="flex justify-center items-center space-x-2">
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></div>
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-400"></div>
            </div>
          </td>
        </tr>

        <template v-else>
          <tr v-for="(order, index) in filteredOrders" :key="index"
            class="border-b border-b-gray-200 bg-white relative">

            <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="px-4 py-2 align-top text-custom-orange font-bold pb-5"> {{ getCustomerName(order.user_id) }}</td>


            <td class="px-4 py-2 align-top pb-5">
              <div class="flex items-center">
                <span class="material-symbols-outlined mr-1 text-xl">phone</span>{{
                  getCustomerTel(order.user_id) }}
              </div>
            </td>

            <td class="px-4 py-2 align-top pb-5">
              <input v-if="isEditing && editingOrderId === order.id" v-model="editedDeliveryTime" type="time"
                class="border px-2 py-1 rounded w-full" />
              <span v-else>{{ formattedDeliveryTime(getCustomerDeliveryTime(order.customer_id)) }}</span>
            </td>

            <td class="px-4 py-2 align-top pb-5">
              <textarea v-if="isEditing && editingOrderId === order.id" v-model="editedDeliveryRound"
                class="border px-2 py-1 rounded w-full h-24"></textarea>
              <span v-else>{{ getCustomerDeliveryRound(order.customer_id) }}</span>
            </td>
            <td class="px-4 py-2 align-top pb-5">
              <textarea v-if="isEditing && editingOrderId === order.id" v-model="editedDeliver"
                class="border px-2 py-1 rounded w-full h-24"></textarea>
              <span v-else>{{ getCustomerDeliver(order.customer_id) }}</span>
            </td>
            <td class="px-4 py-2 align-top pb-5">
              <textarea v-if="isEditing && editingOrderId === order.id" v-model="editedDeliveryZone"
                class="border px-2 py-1 rounded w-full h-24"></textarea>
              <span v-else>{{ getCustomerDeliveryZone(order.customer_id) }}</span>
            </td>

            <td class="px-4 py-2 align-top pb-5">
              <select v-if="isEditing && editingOrderId === order.id" v-model="selectedAddresses[order.id]"
                class="border px-2 py-1 rounded w-full">
                <option :value="getCustomerAddress1(order.customer_id)">
                  ที่อยู่ 1: {{ getCustomerAddress1(order.customer_id) }}
                </option>
                <option :value="getCustomerAddress2(order.customer_id)">
                  ที่อยู่ 2: {{ getCustomerAddress2(order.customer_id) }}
                </option>
                <option :value="getCustomerAddress3(order.customer_id)">
                  ที่อยู่ 3: {{ getCustomerAddress3(order.customer_id) }}
                </option>
              </select>
              <span v-else>{{ selectedAddresses[order.id] || 'เลือกที่อยู่' }}</span>
            </td>

            <td class="px-4 py-2 text-right pb-5 relative">
              <div class="flex justify-end space-x-2">
                <button v-if="!isEditing || editingOrderId !== order.id" @click="startEditing(order)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                  <span class="material-symbols-outlined">edit_square</span>
                  <span>แก้ไข</span>
                </button>

                <button v-if="isEditing && editingOrderId === order.id" @click="saveUpdatedDelivery(order)"
                  class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-1">
                  <span class="material-symbols-outlined">check</span>
                  <span>บันทึก</span>
                </button>

                <button v-if="isEditing && editingOrderId === order.id" @click="cancelEditing"
                  class="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 flex items-center space-x-1">
                  <span class="material-symbols-outlined">close</span>
                  <span>ยกเลิก</span>
                </button>
              </div>
            </td>


          </tr>

          <tr v-if="filteredOrders.length === 0">
            <td colspan="11" class="py-10 bg-white text-center text-gray-500 font-bold">ไม่พบข้อมูล </td>
          </tr>

        </template>
      </tbody>

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

    <div ref="componentRef" class="hidden-print p-4 relative">
      <div class="relative flex justify-between items-center ">
        <div class="flex flex-col">
          <strong class="text-xl">Delivery Report</strong>
          <span class="text-sm">Date : {{ formattedDate }}</span>
        </div>


        <div class="flex items-center space-x-4">
          <img src="@/assets/logo_fitfood_full.png" alt="Logo" class="w-48 h-18" />
        </div>
      </div>

      <table class="report-content min-w-full table-auto mt-4 p-4">
        <thead>
          <tr class="bg-gray-100 text-black text-[12px]">
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 20%;">ชื่อ - นามสกุล</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 10%;">โทร</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 10%;">เวลา</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 10%;">รอบ</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 10%;">ผู้ส่ง</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 15%;">โซนจัดส่ง</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 25%;">ที่อยู่จัดส่ง</th>
          </tr>

        </thead>

        <tbody>
          <tr v-for="(order, index) in filteredUniqueOrders" :key="index"
            class="bg-white border-b border-gray-300 hover:bg-gray-100">

            <td class="px-6 py-4 text-[12px]  text-black border-b border-b-gray-300">
              {{ getCustomerName(order.user_id) }}
            </td>


            <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">
              <div class="flex items-center">
                {{ getCustomerTel(order.user_id) }}
              </div>
            </td>


            <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ formattedDeliveryTime(getCustomerDeliveryTime(order.customer_id))
            }}</td>
            <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ getCustomerDeliveryRound(order.customer_id) }}</td>
            <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ getCustomerDeliver(order.customer_id) }}</td>
            <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ getCustomerDeliveryZone(order.customer_id) }}</td>

            <template v-if="selectedAddresses[order.id]">
              <td class="px-6 py-4 text-[12px]">{{ selectedAddresses[order.id] }}</td>
            </template>


          </tr>

          <tr v-if="filteredUniqueOrders.length === 0">
            <td colspan="11" class="py-10 bg-white text-center text-gray-500 font-bold">ไม่พบข้อมูล </td>
          </tr>
        </tbody>

      </table>
    </div>

  </div>


</template>

<script>
import axios from 'axios';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useVueToPrint } from "vue-to-print";
import { ref } from "vue";

import { API_URL } from "@/services/api";

//import Multiselect from 'vue-multiselect';

export default {
  setup() {
    const componentRef = ref();
    const { handlePrint } = useVueToPrint({
      content: componentRef,
      documentTitle: "Delivery Report",
    });

    return { componentRef, handlePrint };
  },

  data() {
    return {
      headers: [
        "#",
        `ชื่อ-นามสกุล`,
        "โทร",
        "เวลา",
        "รอบ",
        "ผู้ส่ง",
        "โซนจัดส่งตามที่อยู่ตาม Routing",
        "ที่อยู่จัดส่ง",
        "",
      ],
      headerWidths: ["5%", "15%", "10%", "10%", "10%", "10%", "15%", "20%", "5%"],
      // sortDateDirection: 'asc', // กำหนดทิศทางการเรียงลำดับ (asc หรือ desc)
      sortIcon: 'arrow_downward',

      orders: [],
      searchQuery: "",


      // filteredOrders: [],
      selectedDate: "",
      customers: [],
      menus: [],
      menu_types: [],

      selectedOrder: [],
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

      isFilterDropdownOpen: false,
      isSortDropdownOpen: false,
      sortDirection: {
        id: 1,
        name: 1
      },
      sortColumn: '',
      isLoading: false,

      isEditing: false,
      editingOrderId: null,

      editedDeliveryRound: "",
      editedDeliver: "",
      editedDeliveryZone: "",
      editedDeliveryTime: "",

    };
  },
  // components: {
  //     Multiselect
  // },
  computed: {
    filteredMenuTypes() {
      return this.menu_types.filter(type => !type.name.startsWith('Happy'));
    },
    filteredOrdersWithoutHappy() {
      return this.orders.filter(order => {
        const menuTypeName = this.getMenuTypeName(order.menu_type_id) || ''; // ป้องกัน undefined
        return !menuTypeName.startsWith("Happy");
      });
    },

    filteredOrders() {
      const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : ''; // ป้องกัน undefined
      return this.filteredUniqueOrders.filter(order => {
        const customerName = this.getCustomerName(order.user_id) || ''; // ป้องกัน undefined
        const matchesSearch = searchQuery === '' || customerName.toLowerCase().includes(searchQuery);
        const matchesPromotionType = !Array.isArray(this.selectedOrder) || this.selectedOrder.length === 0 || this.selectedOrder.includes(order.menu_type_id);
        return matchesSearch && matchesPromotionType;
      }).slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    },

    totalPages() {
      const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : ''; // ป้องกัน undefined
      return Math.ceil(
        this.filteredUniqueOrders.filter(order => {
          const customerName = this.getCustomerName(order.user_id) || ''; // ป้องกัน undefined
          const matchesSearch = searchQuery === '' || customerName.toLowerCase().includes(searchQuery);
          const matchesPromotionType = !Array.isArray(this.selectedOrder) || this.selectedOrder.length === 0 || this.selectedOrder.includes(order.menu_type_id);
          return matchesSearch && matchesPromotionType;
        }).length / this.itemsPerPage
      );
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
    formattedDeliveryTime() {
      return (time) => {
        if (!time) return "-"; // กรณีไม่มีข้อมูล
        return time.slice(0, 5); // ตัดเอาแค่ HH:mm
      };
    },
    selectedAddresses() {
      let addresses = {};
      this.filteredUniqueOrders.forEach(order => {
        // หาข้อมูลลูกค้าจาก customer_id ในแต่ละ order
        const customer = this.customers.find(c => c.id === order.customer_id);
        if (customer) {
          // ตั้งค่า selectedAddresses ให้เป็นที่อยู่จากลูกค้า
          addresses[order.id] = customer.delivery_address || ''; // ถ้าไม่มีค่าให้เป็นค่าว่าง
        }
      });
      return addresses;
    },
    filteredUniqueOrders() {
      const uniqueOrders = [];
      const seenUserIds = new Set();

      this.filteredOrdersWithoutHappy.forEach(order => {
        if (!seenUserIds.has(order.user_id)) {
          uniqueOrders.push(order);
          seenUserIds.add(order.user_id);
        }
      });

      return uniqueOrders;
      // return this.filteredOrdersWithoutHappy; 
    },
    formattedDate() {
      return new Date().toLocaleDateString("en-UK", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
    },


  },
  methods: {

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

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

    async fetchOrders(startDate, endDate) {
      this.isLoading = true;

      try {
        const response = await axios.get(`${API_URL}/orders/date-range`, {
          params: { start_date: startDate, end_date: endDate }, // ส่งค่าพารามิเตอร์ start_date และ end_date
        });

        this.orders = response.data.orders;
        this.filteredOrders = this.orders;

        this.orders.sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);

          if (dateA.getTime() === dateB.getTime()) {
            return a.id - b.id; // เรียงจากน้อยไปหามากตาม id
          }

          return dateA - dateB; // เรียงจากน้อยไปหามากตาม order_date
        });



      } catch (error) {
        // console.error('Error fetching orders data:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchLookupData() {
      try {
        const [customersRes, menuRes, menuTypeRes] = await Promise.all([
          axios.get(`${API_URL}/customers`),
          axios.get(`${API_URL}/menus`),
          axios.get(`${API_URL}/menu-types`),
        ]);
        this.customers = customersRes.data;
        this.menus = menuRes.data;
        this.menu_types = menuTypeRes.data;

      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },

    startEditing(Order) {
      this.isEditing = true;
      this.editingOrderId = Order.id;
      this.editedDeliveryRound = this.getCustomerDeliveryRound(Order.customer_id);
      this.editedDeliveryTime = this.getCustomerDeliveryTime(Order.customer_id);
      this.editedDeliveryZone = this.getCustomerDeliveryZone(Order.customer_id);
      this.editedDeliver = this.getCustomerDeliver(Order.customer_id);

    },

    saveUpdatedDelivery(Order) {
      this.updateDelivery(Order);
      this.isEditing = false;
      this.editingOrderId = null;
    },

    cancelEditing() {
      this.fetchOrders();
      this.isEditing = false;
      this.editingOrderId = null;

    },

    async updateDelivery(order) {
      try {
        // ตรวจสอบให้แน่ใจว่าเรากำลังใช้ customer_id ที่ถูกต้อง
        const customer = this.customers.find(c => c.id === order.customer_id);

        if (customer) {
          customer.delivery_round = this.editedDeliveryRound;
          customer.deliver = this.editedDeliver;
          customer.delivery_zone = this.editedDeliveryZone;
          customer.delivery_time = this.editedDeliveryTime;

          await axios.put(`${API_URL}/customers/${customer.id}`, {
            delivery_round: customer.delivery_round || '',
            deliver: customer.deliver || '',
            delivery_zone: customer.delivery_zone || '',
            delivery_time: customer.delivery_time || '',
            delivery_address: this.selectedAddresses[order.id] || null,
          });

          // รีเฟรชข้อมูล orders
          await this.fetchOrders();
          this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
        } else {
          this.showErrorToastNotification("ไม่พบข้อมูลลูกค้า");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการแก้ไข!");
      }
    },

    // async updateDelivery(Order) {
    //   try {
    //     await axios.put(`${API_URL}/customers/${Order.customer_id}`, {
    //       delivery_round: Order.delivery_round || '',
    //       deliver: Order.deliver || '',
    //       delivery_zone: Order.delivery_zone || '',
    //       delivery_time: Order.delivery_time || '',
    //       // delivery_address: this.selectedAddresses[Order.customer_id] || null,  // ✅ เพิ่ม delivery_address
    //     });

    //     await this.fetchOrders();
    //     this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
    //   } catch (error) {
    //     console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง:", error);
    //     this.showErrorToastNotification("เกิดข้อผิดพลาดในการแก้ไข!");
    //   }
    // },

    search() {
      this.currentPage = 1;
    },
    clearSearch() {
      this.searchQuery = "";
      this.currentPage = 1;
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
    getCustomerTel(customerId) {
      const customer = this.customers.find((c) => c.user_id === customerId);
      return customer ? customer.tel : "ไม่พบข้อมูล";
    },
    getCustomerAddress1(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.address_1 : "ไม่พบข้อมูล";
    },
    getCustomerAddress2(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.address_2 : "ไม่พบข้อมูล";
    },
    getCustomerAddress3(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.address_3 : "ไม่พบข้อมูล";
    },
    getCustomerDeliveryTime(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.delivery_time : null;
    },
    getCustomerDeliveryRound(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.delivery_round : null;
    },
    getCustomerDeliver(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.deliver : null;
    },
    getCustomerDeliveryZone(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.delivery_zone : null;
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
      return index === 0 || this.filteredOrders[index - 1].user_id !== userId;
    },
    getRowspan(userId, index) {
      let count = 0;
      // คำนวณจำนวนแถวที่มี user_id ซ้ำ
      for (let i = index; i < this.filteredOrders.length; i++) {
        if (this.filteredOrders[i].user_id === userId) {
          count++;
        } else {
          break;
        }
      }
      return count;
    },

    shouldDisplayOrderDate(index, orderDate) {
      return index === 0 || this.filteredOrders[index - 1].order_date !== orderDate;
    },
    getOrderDateRowspan(orderDate, index) {
      let count = 0;
      for (let i = index; i < this.filteredOrders.length; i++) {
        if (this.filteredOrders[i].order_date === orderDate) {
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

    toggleFiltterDropdown() {
      this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    },
    applyFilter() {
      if (this.selectedOrder.length > 0) {
        this.filteredOrders = this.menu_types.filter(packageType =>
          this.selectedOrder.includes(packageType.menu_type_id)
        );
      } else {
        this.filteredOrders = this.orders;
      }
      this.isFilterDropdownOpen = false;
    },
    clearFilter() {
      this.selectedOrder = [];
      this.filteredOrders = this.orders;
    },

    toggleSortDropdown() {
      this.isSortDropdownOpen = !this.isSortDropdownOpen;
    },
    sortData(column) {
      if (this.sortColumn === column) {
        this.sortDirection[column] = -this.sortDirection[column];
      } else {
        this.sortColumn = column;
        this.sortDirection[column] = 1;
      }

      this.orders.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        if (aValue < bValue) return -this.sortDirection[column];
        if (aValue > bValue) return this.sortDirection[column];
        return 0;
      });

      this.currentPage = 1;
    },
    clearSort() {
      this.sortColumn = 'id';
      this.sortDirection.id = 1;
      this.orders.sort((a, b) => {
        const dateA = new Date(a.order_date);
        const dateB = new Date(b.order_date);
        return dateA - dateB; // เรียงจากน้อยไปหามาก
      });
      this.currentPage = 1;
    },

    handleClickOutside(event) {
      if (
        this.$refs.sortDropdown &&
        !this.$refs.sortDropdown.contains(event.target)
      ) {
        this.isSortDropdownOpen = false;
      }

      if (
        this.$refs.filterDropdown &&
        !this.$refs.filterDropdown.contains(event.target)
      ) {
        this.isFilterDropdownOpen = false;
      }

      if (
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest("button")
      ) {
        this.moreOpenDropdownIndex = null;
      }

      if (event.target.closest(".sort")) {
        this.moreOpenDropdownIndex = null;
      }

      if (event.target.closest(".more")) {
        this.isSortDropdownOpen = false;
      }

      if (
        this.$refs.filterDropdown &&
        !this.$refs.filterDropdown.contains(event.target) &&
        !event.target.closest(".filter")
      ) {
        this.isFilterDropdownOpen = false;
      }
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
    this.sortData('id');
    this.fetchLookupData();
    this.fetchOrders(this.selectedDate);
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
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
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  watch: {
  }
};
</script>

<style scoped>
.dropdown-up {
  bottom: 100%;
  margin-bottom: 4px;
}
</style>