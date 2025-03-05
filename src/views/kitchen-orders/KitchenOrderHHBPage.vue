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
        <span class="material-symbols-outlined text-2xl text-gray-700">stockpot</span>
        <span class="text-m text-gray-700">จำนวนรายการ Kitchen Orders: </span>
        <span class="text-m text-custom-orange font-bold"> {{ filteredOrdersWithoutHappy.length }} รายการ</span>
      </div>

      <button v-if="selectedOrder.length > 0" @click="clearFilter"
        class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
        <span class="material-symbols-outlined">close</span>
        <span class="ml-2">รีเซ็ตตัวกรอง ({{ selectedOrder.length }})</span>
      </button>

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

    <table class="min-w-full table-auto rounded-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white">
          <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
            :style="{ width: headerWidths[index], cursor: 'pointer' }">
            <span>{{ header }}</span>
            <span v-if="header === 'Transaction Date'" class="ml-2 items-center">
              <span class="material-symbols-outlined text-sm">{{ sortIcon }}</span>
            </span>
          </th>
        </tr>

      </thead>

      <tbody>
        <tr v-if="isLoading" class="bg-white">
          <td colspan="10" class="py-16 text-center">
            <div class="flex justify-center items-center space-x-2">
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></div>
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-400"></div>
            </div>
          </td>
        </tr>

        <template v-else>

        <tr v-for="(order, index) in filteredOrders" :key="index" class="border-b border-b-gray-200 bg-white relative">
          <td class="px-4 py-2 align-top pb-5">{{ index + 1 }}</td>

          <td class="px-4 py-2 align-top pb-5">{{ formatDate(order.order_date) }}</td>
          <td class="px-4 py-2 align-top pb-5">{{ getMenuTypeName(order.menu_type_id) }}</td>
          <td class="px-4 py-2 align-top pb-5">{{ getMealTypeName(getMealTypeID(order.menu_id)) }}</td>
          <td class="px-4 py-2 align-top font-bold pb-5">
            <div>{{ order.menu_eng_name }}</div>
            <div>({{ order.menu_name }})</div>
          </td>

          <td class="px-4 py-2 align-top pb-5">{{ order.quantity }}</td>
        </tr>

        <tr v-if="filteredOrders.length === 0">
          <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">ไม่พบข้อมูล </td>
        </tr>

        </template>
      </tbody>

    </table>

    <div ref="componentRef" class="hidden-print p-4 relative">
  <div class="relative flex justify-between items-center ">
    <div class="flex flex-col">
      <strong class="text-xl">Kitchen Orders Report</strong>
      <span class="text-sm">Date : {{ formattedDate }}</span>
    </div>

    <div class="flex items-center space-x-4">
      <img src="@/assets/logo_fitfood_full.png" alt="Logo" class="w-48 h-18" />
    </div>
  </div>

  <!-- แยกข้อมูลตามวัน -->
  <div v-for="(group, index) in groupedOrdersPrint" :key="index" class="mb-6" :style="{ pageBreakBefore: index > 0 ? 'always' : 'auto' }">
    <!-- แสดงวันที่ข้างบน -->
    <h2 class="text-lg font-bold mb-2 text-center w-full">{{ formatFullDate(group.date) }}</h2>

    <div v-for="(menuGroup, menuIndex) in group.menuTypes" :key="menuIndex" class="mb-4">
      <h3 class="text-md font-semibold mb-2 text-custom-orange">
        {{ menuGroup.menuTypeName }}
      </h3>

      <table class="report-content min-w-full table-auto mt-4 p-4">
        <thead>
          <tr class="bg-gray-100 text-black text-[12px]">
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 35%;">ประเภทอาหาร</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 65%;">รายการอาหาร</th>
            <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 10%;">จำนวน</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(mealGroup, mealIndex) in menuGroup.orders" :key="mealIndex">
            <tr v-for="(order, orderIndex) in mealGroup.items" :key="orderIndex" class="bg-white hover:bg-gray-100">
              <!-- แสดง getMealTypeName() เฉพาะแถวแรกของกลุ่ม -->
              <td v-if="orderIndex === 0" :rowspan="mealGroup.items.length"
                class="px-6 py-4 text-[12px] border-b border-b-gray-300 align-top font-semibold">
                {{ mealGroup.meal_type_name }}
              </td>

              <td class="px-6 py-4 text-[12px] border-b border-b-gray-300 block">
                <div class="font-bold">{{ order.menu_eng_name }}</div>
                <div class="">{{ order.menu_name }}</div>
              </td>
              <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ order.quantity }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</div>

    <!-- <div ref="componentRef" class="hidden-print p-4 relative">
      <div class="relative flex justify-between items-center p-4">
        <div class="flex flex-col">
          <strong class="text-xl">Kitchen Orders Report</strong>
          <span class="text-sm">Date : {{ formattedDate }}</span>
        </div>


        <div class="flex items-center space-x-4">
          <img src="@/assets/logo_fitfood_full.png" alt="Logo" class="w-48 h-18" />
        </div>
      </div>



      <div v-for="(orders, index) in groupedOrdersPrint" :key="index" class="mb-4 mt-2 p-4">
        <span class="font-bold text-lg text-center w-full block">{{ orders.menu_type }}</span>
        <div v-for="(order, idx) in orders.items" :key="idx">
          <h2 class="font-medium text-lg mt-4">{{ formatDate(order.order_date) }}</h2>
          <div v-for="(meal, index) in order.items" :key="index">
            <div class="mt-2">
              <span class="font-semibold text-custom-orange underline">{{ meal.meal_type }}</span>
              <ul class="ml-4">
                <li v-for="(item, itemIndex) in meal.items" :key="itemIndex">
                  <strong>{{ item.quantity }}</strong> x {{ item.menu_name }} ({{ item.menu_eng_name  }})
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div> -->



  </div>


</template>

<script>
import axios from 'axios';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useVueToPrint } from "vue-to-print";
import { ref } from "vue";
import { API_URL } from "@/services/api";


export default {
  setup() {
    const componentRef = ref();
    const { handlePrint } = useVueToPrint({
      content: componentRef,
      documentTitle: "Kitchen Orders Report",
    });

    return { componentRef, handlePrint };
  },
  data() {
    return {
      headers: ['#', 'วันที่สั่งซื้อ', 'Packge Type', 'ประเภทอาหาร', 'รายการอาหาร', 'จำนวน'],
      headerWidths: ['5%', '10%', '15%', '20%', '35%', '10%'],

      orders: [],
      searchQuery: "",

      // filteredOrders: [],
      selectedDate: "",
      customers: [],
      menus: [],
      menu_types: [],
      meal_types: [],

      // selectedOrder: {
      //   id: '',
      //   menu_id: '',
      //   quantity: 0,
      //   order_date: '',
      //   user_id: '',
      //   menu_type_id: '',
      //   status: '',
      // },
      selectedOrders: [],
      selectedOrder: [],

      isConfirmStatusModalOpen: false,
      isAllSelected: false,

      currentPage: 1,
      itemsPerPage: 5,

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

    };
  },
  computed: {
    filteredMenuTypes() {
      return this.menu_types.filter(type => !type.name.startsWith('Happy'));
    },

    filteredOrdersWithoutHappy() {
      return this.groupedOrders.filter(order => {
        const menuTypeName = this.getMenuTypeName(order.menu_type_id) || ''; // ป้องกัน undefined
        return menuTypeName.startsWith("Happy");
      });
    },


    filteredOrders() {
      const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : ''; // ป้องกัน undefined
      return this.filteredOrdersWithoutHappy.filter(order => {
        const menuEngName = this.getMenuEngName(order.menu_id) || '';
        const menuThaiName = this.getMenuName(order.menu_id) || '';
        const matchesSearch = searchQuery === '' || menuEngName.toLowerCase().includes(searchQuery) || menuThaiName.toLowerCase().includes(searchQuery);
        const matchesPromotionType = !Array.isArray(this.selectedOrder) || this.selectedOrder.length === 0 || this.selectedOrder.includes(order.menu_type_id);
        return matchesSearch && matchesPromotionType;
      })
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

    formattedDate() {
      return new Date().toLocaleDateString("en-UK", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
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
    },

    groupedOrdersPrint() {
      const groupedByDate = this.filteredOrders.reduce((acc, order) => {
        if (!acc[order.order_date]) {
          acc[order.order_date] = {};
        }

        if (!acc[order.order_date][order.menu_type_id]) {
          acc[order.order_date][order.menu_type_id] = [];
        }

        const existingOrder = acc[order.order_date][order.menu_type_id].find(item => item.menu_id === order.menu_id);
        if (existingOrder) {
          existingOrder.quantity += order.quantity;
        } else {
          acc[order.order_date][order.menu_type_id].push({
            menu_id: order.menu_id,
            quantity: order.quantity,
            menu_name: this.getMenuName(order.menu_id),
            menu_eng_name: this.getMenuEngName(order.menu_id),
            order_date: order.order_date,
            menu_type_id: order.menu_type_id,
            meal_type_name: this.getMealTypeName(this.getMealTypeID(order.menu_id)), // เพิ่ม field
          });
        }

        return acc;
      }, {});

      return Object.keys(groupedByDate).map(date => ({
        date,
        menuTypes: Object.keys(groupedByDate[date]).map(menu_type_id => {
          const numMenuTypeId = Number(menu_type_id);
          return {
            menu_type_id: numMenuTypeId,
            menuTypeName: this.getMenuTypeName(numMenuTypeId),
            orders: groupedByDate[date][menu_type_id]
              .reduce((acc, order) => {
                const existingGroup = acc.find(group => group.meal_type_name === order.meal_type_name);
                if (existingGroup) {
                  existingGroup.items.push(order);
                } else {
                  acc.push({ meal_type_name: order.meal_type_name, items: [order] });
                }
                return acc;
              }, []),
          };
        }),
      }));
    },

    // groupedOrdersPrint() {
    //   const groupedByMenuTypeAndDate = this.filteredOrders.reduce((acc, order) => {
    //     const menuType = this.getMenuTypeName(order.menu_type_id);
    //     const mealType = this.getMealTypeName(this.getMealTypeID(order.menu_id));

    //     if (!acc[menuType]) {
    //       acc[menuType] = [];
    //     }

    //     const existingDate = acc[menuType].find(item => item.order_date === order.order_date);

    //     if (existingDate) {
    //       const existingMealType = existingDate.items.find(item => item.meal_type === mealType);

    //       if (existingMealType) {
    //         const existingMenu = existingMealType.items.find(item => item.menu_name === this.getMenuName(order.menu_id));
    //         if (existingMenu) {
    //           existingMenu.quantity += order.quantity; // รวม quantity
    //         } else {
    //           existingMealType.items.push({
    //             menu_name: this.getMenuName(order.menu_id),
    //             menu_eng_name: this.getMenuEngName(order.menu_id),
    //             quantity: order.quantity,
    //             meal_type: mealType,
    //           });
    //         }
    //       } else {
    //         existingDate.items.push({
    //           meal_type: mealType,
    //           items: [{
    //             menu_name: this.getMenuName(order.menu_id),
    //             menu_eng_name: this.getMenuEngName(order.menu_id),
    //             quantity: order.quantity,
    //             meal_type: mealType,
    //           }]
    //         });
    //       }
    //     } else {
    //       acc[menuType].push({
    //         menu_type: menuType,
    //         order_date: order.order_date,
    //         items: [{
    //           meal_type: mealType,
    //           items: [{
    //             menu_name: this.getMenuName(order.menu_id),
    //             menu_eng_name: this.getMenuEngName(order.menu_id),
    //             quantity: order.quantity,
    //             meal_type: mealType,
    //           }]
    //         }]
    //       });
    //     }

    //     return acc;
    //   }, {});

    //   return Object.keys(groupedByMenuTypeAndDate).map(menuType => {
    //     return {
    //       menu_type: menuType,
    //       items: groupedByMenuTypeAndDate[menuType].map(item => ({
    //         order_date: item.order_date,
    //         items: item.items.map(subItem => ({
    //           meal_type: subItem.meal_type,
    //           items: subItem.items
    //         }))
    //       }))
    //     };
    //   });
    // },

  },
  methods: {
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
    formatFullDate(dateString) {
  if (!dateString) return ""; // หากยังไม่ได้เลือกวันที่

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const date = new Date(dateString);
  const day = date.getDate(); // วันที่
  const month = months[date.getMonth()]; // ชื่อเดือนเต็ม
  const year = date.getFullYear(); // ปี

  return `${day} ${month} ${year}`; // รูปแบบ "28 January 2025"
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

    // sortColumn(header) {
    //   if (header === 'Transaction Date') {
    //     // สลับทิศทางการเรียงลำดับเมื่อคลิก
    //     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    //     // กำหนดไอคอนให้เหมาะสมกับทิศทางการเรียงลำดับ
    //     this.sortIcon = this.sortDirection === 'asc' ? 'arrow_downward' : 'arrow_upward';

    //     // เรียงลำดับข้อมูลตามวันที่ชำระเงิน
    //     this.filteredOrders.sort((a, b) => {
    //       const dateA = new Date(a.paid_date);
    //       const dateB = new Date(b.paid_date);

    //       return this.sortDirection === 'asc'
    //         ? dateA - dateB
    //         : dateB - dateA;
    //     });
    //   }
    // },

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
          return dateA - dateB; // เรียงจากน้อยไปหามาก
        });


      } catch (error) {
        console.error('Error fetching orders data:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchLookupData() {
      this.isLoading = true;

      try {
        const [customersRes, menuRes, menuTypeRes, mealTypeRes] = await Promise.all([
          axios.get(`${API_URL}/customers`),
          axios.get(`${API_URL}/menus`),
          axios.get(`${API_URL}/menu-types`),
          axios.get(`${API_URL}/meal-types`),
        ]);
        this.customers = customersRes.data;
        this.menus = menuRes.data;
        this.menu_types = menuTypeRes.data;
        this.meal_types = mealTypeRes.data;
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      } finally {
        this.isLoading = false;
      }
    },

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

    // openConfirmSatatusModal(saleRecord) {
    //   this.selectedOrder = saleRecord;
    //   this.isConfirmStatusModalOpen = true;
    // },
    // closeConfirmStatusModal() {
    //   this.isConfirmStatusModalOpen = false;
    //   // this.selectedOrder = null;
    //   this.selectedPaidDate = "";
    // },
    // async confirmStatus() {
    //   try {
    //     const newStatus =
    //       this.selectedOrder.status === "confirm" ? "pending" : "confirm";

    //     const payload = {
    //       status: newStatus,
    //     };

    //     const response = await axios.put(
    //       `http://127.0.0.1:3333/order/${this.selectedOrder.id}/status`,
    //       payload
    //     );
    //     await this.fetchOrders();

    //     if (response.status === 200) {
    //       const updatedOrder = response.data.data;
    //       const index = this.orders.findIndex(
    //         (record) => record.id === updatedOrder.id
    //       );
    //       if (index !== -1) {
    //         this.orders[index] = updatedOrder;
    //       }
    //       this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
    //     } else {
    //       throw new Error("Unexpected response status");
    //     }
    //   } catch (error) {
    //     console.error("Error updating payment status:", error);
    //     console.error(
    //       "Error response data:",
    //       error.response?.data || "No additional data"
    //     );
    //     this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
    //   }
    //   this.closeConfirmStatusModal();
    // },

    // async confirmMultipleOrders() {
    //   if (this.selectedOrders.length === 0) return;
    //   const orderIds = this.selectedOrders.map(order => order.id);
    //   console.log("Selected Orders:", this.selectedOrders);

    //   try {
    //     const response = await fetch("http://127.0.0.1:3333/order/update-status", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         order_ids: orderIds,
    //         status: "confirm",
    //       }),
    //     });
    //     await response.json();

    //     if (response.ok) {
    //       this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
    //       this.selectedOrders = [];
    //       await this.fetchOrders(this.startDate, this.endDate);
    //     } else {
    //       this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //     this.showErrorToastNotification("เกิดข้อผิดพลาดในการเชื่อมต่อ!");
    //   }
    // },
    // async pendingMultipleOrders() {
    //   if (this.selectedOrders.length === 0) return;
    //   const orderIds = this.selectedOrders.map(order => order.id);

    //   try {
    //     const response = await fetch("http://127.0.0.1:3333/order/update-status", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         order_ids: orderIds,
    //         status: "pending",
    //       }),
    //     });
    //     await response.json();

    //     if (response.ok) {
    //       this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
    //       this.selectedOrders = [];
    //       await this.fetchOrders(this.startDate, this.endDate);
    //     } else {
    //       this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //     this.showErrorToastNotification("เกิดข้อผิดพลาดในการเชื่อมต่อ!");
    //   }
    // },
    // selectOrder(order) {
    //   if (!this.selectedOrders.includes(order)) {
    //     this.selectedOrders.push(order);
    //   } else {
    //     this.selectedOrders = this.selectedOrders.filter(item => item.id !== order.id);
    //   }
    // },
    // toggleSelectAll(event) {
    //   if (event.target.checked) {
    //     this.selectedOrders = [...this.filteredOrders];  // เลือกคำสั่งซื้อทั้งหมด
    //   } else {
    //     this.selectedOrders = [];  // ยกเลิกการเลือกทั้งหมด
    //   }
    //   this.isAllSelected = event.target.checked;
    // },


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

<style >
.dropdown-up {
  bottom: 100%;
  margin-bottom: 4px;
}


@media screen {
  .hidden-print {
    display: none;
  }
}

/*   */

@media print {
  @page {
    size: auto;
    margin: 10mm;
    /* margin-top: 10mm;
    margin-bottom: 10mm; */
  }
}
</style>