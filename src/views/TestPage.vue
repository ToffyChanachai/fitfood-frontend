<template>
  <div>
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


    </div>


    <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
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

        <tr v-for="(order, index) in filteredOrders" :key="index" class="border-b border-b-gray-200 bg-white relative">
          <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

          <td class="px-4 py-2 align-top font-bold border-l border-r text-custom-orange"
            v-if="shouldDisplayUserName(index, order.user_id)" :rowspan="getRowspan(order.user_id, index)">
            {{ getCustomerName(order.user_id) }}
          </td>

          <td class="px-4 py-2 align-top pb-5 border-r" v-if="shouldDisplayOrderDate(index, order.order_date)"
            :rowspan="getOrderDateRowspan(order.order_date, index)">
            {{ formatDate(order.order_date) }}
          </td>
          <td class="px-4 py-2 align-top font-bold text-custom-orange">{{ getMenuName(order.menu_id) }}</td>
          <td class="px-4 py-2 align-top pb-5">{{ order.quantity }}</td>
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
      headers: ['Transaction Date', `Customer's Name`, 'Package Type', 'Sales Category', ' '],
      headerWidths: ['10%', '12%', '10%', '10%', '13%', '12%', '8%', '10%', '7%', '8%'],
      sortDirection: 'asc', // กำหนดทิศทางการเรียงลำดับ (asc หรือ desc)
      sortIcon: 'arrow_downward',

      orders: [],

      filteredOrders: [],
      selectedDate: "",
      dailySales: [],
      totalSales: 0,
      totalSalesBeforeVAT: 0,
      totalPackageBeforeVAT: 0,
      totalDeliveryBeforeVAT: 0,
      salesByPaymentType: [],

      customers: [],
      packages: [],
      menus: [],
      seller_names: [],
      payment_types: [],
      package_types: [],
      selectedPackageTypeId: "",
      additional_types: [],

      isPaymentTableVisible: false,

      selectedSeller: "",  // สำหรับเก็บผู้ขายที่เลือก
      // isSellerDropdownOpen: false,
      salesBySellerAndPackageType: [],
      sellers: [], // List of seller_name_id
      groupedsalesBySellerAndPackageType: null,

      currentPage: 1,
      itemsPerPage: 10,

      startDate: '', // วันที่เริ่มต้น
      endDate: '',

      isDetailModalOpen: false,
      selectedDailySaleDetail: {},
    };
  },
  // components: {
  //     Multiselect
  // },
  computed: {
    totalPages() {
      return Math.ceil(
        this.dailySales.length / this.itemsPerPage
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
    totalSalesSum() {
      if (!this.groupedsalesBySellerAndPackageType) return 0;
      return Object.values(this.groupedsalesBySellerAndPackageType)
        .flat()
        .reduce((sum, sale) => {
          const totalSales = parseFloat(sale.total_sales) || 0; // แปลงเป็นตัวเลข หรือค่าเริ่มต้น 0
          return sum + totalSales;
        }, 0);
    },
    totalPreVatSum() {
      if (!this.groupedsalesBySellerAndPackageType) return 0;
      return Object.values(this.groupedsalesBySellerAndPackageType)
        .flat()
        .reduce((sum, sale) => {
          const preVat = parseFloat(sale.pre_vat) || 0; // แปลงเป็นตัวเลข หรือค่าเริ่มต้น 0
          return sum + preVat;
        }, 0);
    },
    filteredSalesBySellerAddit() {
      return Object.keys(this.salesBySellerAndPackageType).map(sellerId => {
        const filteredSales = this.salesBySellerAndPackageType[sellerId].sales.filter(sale => {
          const packageTypeName = this.getPackageTypeName(sale.package_type_id).toLowerCase();
          return packageTypeName === 'additional sales' || packageTypeName === 'consignment';
        });

        return {
          sellerId,
          sales: filteredSales,
          totalSales: filteredSales.reduce((total, sale) => total + parseFloat(sale.total_sales), 0),
          totalPreVat: filteredSales.reduce((total, sale) => total + parseFloat(sale.pre_vat), 0)
        };
      }).filter(group => group.sales.length > 0); // เอาเฉพาะผู้ขายที่มียอดขาย
    },
    filteredSalesBySeller() {
      return Object.keys(this.salesBySellerAndPackageType).map(sellerId => {
        const filteredSales = this.salesBySellerAndPackageType[sellerId].sales.filter(sale => {
          const packageTypeName = this.getPackageTypeName(sale.package_type_id).toLowerCase();
          return packageTypeName !== 'additional sales' && packageTypeName !== 'consignment';  // เพิ่มเงื่อนไขกรอง 'consignment' ด้วย
        });

        return {
          sellerId,
          sales: filteredSales,
          totalSales: filteredSales.reduce((total, sale) => total + parseFloat(sale.total_sales), 0),
          totalPreVat: filteredSales.reduce((total, sale) => total + parseFloat(sale.pre_vat), 0)
        };
      }).filter(group => group.sales.length > 0); // เอาเฉพาะผู้ขายที่มียอดขาย
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

    filteredDetail() {
      return {
        paid_date: this.formatDate(this.selectedDailySaleDetail.paid_date),
        customer_id: this.getCustomerName(this.selectedDailySaleDetail.customer_id),
        package_type_id: this.getPackageTypeName(this.selectedDailySaleDetail.package_type_id),
        package_id: this.getPackageName(this.selectedDailySaleDetail.package_id) || this.getAdditionalTypeName(this.selectedDailySaleDetail.additional_type_id),
        promotion_type_id: this.getPromotionTypeName(this.selectedDailySaleDetail.promotion_type_id),
        package_price: this.formatPrice(this.getPackagePrice(this.selectedDailySaleDetail.package_id)),
        package_detail: this.getPromotionDetail(this.selectedDailySaleDetail.package_id) || this.selectedDailySaleDetail.add_detail,
        discount: this.formatPrice(this.selectedDailySaleDetail.discount),
        extra_charge: this.formatPercent(this.selectedDailySaleDetail.extra_charge),
        extra_charge_price: this.formatPrice(this.selectedDailySaleDetail.extra_charge_price),
        total_package_price: this.formatPrice(this.selectedDailySaleDetail.total_package_price),
        total_delivery_price: this.formatPrice(this.selectedDailySaleDetail.total_delivery_price),
        total_price: this.formatPrice(this.selectedDailySaleDetail.total_price),
        payment_type_id: this.getPaymentTypeName(this.selectedDailySaleDetail.payment_type_id),
        seller_name_id: this.getSellerName(this.selectedDailySaleDetail.seller_name_id),

      };
    },


  },
  methods: {
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      // this.updatePage();
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
        const [customersRes, menuRes] = await Promise.all([
          axios.get("http://127.0.0.1:3333/customers"),
          axios.get("http://127.0.0.1:3333/menus"),
        ]);
        this.customers = customersRes.data;
        this.menus = menuRes.data;

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
    // คำนวณ rowspan สำหรับ user ที่มี user_id เดียวกัน เริ่มต้นที่ index ปัจจุบัน
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


  },
  created() {
    this.filteredOrders = this.dailySales;
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