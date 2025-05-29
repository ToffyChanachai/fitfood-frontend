<template>
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

  <div class="mt-[-20px]">
    <div class="flex space-x-5">
      <!-- First Box (Original Box) -->
      <div class="bg-white shadow rounded-lg p-4 h-48 flex flex-col items-center justify-center space-y-5">
        <!-- Icon Section -->
        <div class="bg-gray-100 text-gray-600 shadow p-3 rounded-md">
          <span class="material-symbols-outlined text-3xl">
            payments
          </span>
        </div>

        <!-- Text Section -->
        <div class="text-center">
          <div v-if="isLoading" class="flex mb-2">
                        <div class="bg-gray-100 animate-pulse h-6 w-32 rounded-md"></div>
                    </div>
          <div v-else>
            <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(allTotalSales) }}</p>
          </div>
          <p class="text-sm text-gray-600 mt-4">ยอดขายทั้งหมด</p>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-4 h-48 flex flex-col items-center justify-center space-y-5">
        <div class="bg-gray-100 text-gray-600 shadow p-3 rounded-md">
          <span class="material-symbols-outlined text-3xl">
            payments
          </span>
        </div>

        <div class="text-center">
          <div v-if="isLoading" class="flex mb-2">
                        <div class="bg-gray-100 animate-pulse h-6 w-48 rounded-md"></div>
                    </div>
          <div v-else>
            <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(totalSales) }}</p>
          </div>
          <p class="text-sm text-gray-600 mt-4">ยอดประจำวันที่ <strong>{{ formatDate(endDate) }}</strong></p>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-4 h-48 flex flex-col items-center justify-center space-y-5">
        <div class="bg-gray-100 text-gray-600 shadow p-3 rounded-md">
          <span class="material-symbols-outlined text-3xl">
            person
          </span>
        </div>

        <div class="text-center">
          <div v-if="isLoading" class="flex mb-2">
                        <div class="bg-gray-100 animate-pulse h-6 w-32 rounded-md"></div>
                    </div>
          <div v-else>
          <p class="text-3xl font-bold text-custom-orange">{{ formatNumber(customers.length) }}</p>
          </div>
          <p class="text-sm text-gray-600 mt-4">ลูกค้าทั้งหมด (AFF)</p>
        </div>
      </div>
    </div>

    <div class="flex space-x-2 items-center relative">
      <div class="mt-4 px-4 flex items-center space-x-1 mr-auto">
        <span class="material-symbols-outlined text-2xl text-gray-700">groups</span>
        <span class="text-m text-gray-700">จำนวนลูกค้าที่ซื้อแพ็คเกจทั้งหมด: </span>
        <span class="text-m text-custom-orange font-bold">
          {{ filteredSaleRecords1standRenew.length }} รายการ</span>
      </div>

      <button v-if="selectedPackageType.length > 0" @click="clearFilter"
        class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
        <span class="material-symbols-outlined">close</span>
        <span class="ml-2">
          รีเซ็ตตัวกรอง
          <template v-if="selectedPackageType.length > 0">
            ({{ selectedPackageType.length }})
          </template>
        </span>
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
            <li @click="sortData('name')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามชื่อลูกค้า</span>
              <span v-if="sortColumn === 'name'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["name"] === 1
                    ? "arrow_upward"
                    : "arrow_downward"
                }}
              </span>
            </li>
            <li @click="sortData('paid_date')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามวันที่ชำระ</span>
              <span v-if="sortColumn === 'paid_date'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["paid_date"] === 1
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

      <div class="filter relative inline-block" ref="filterDropdown">
        <button @click="toggleFiltterDropdown"
          class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
          <span class="material-symbols-outlined text-white text-xl leading-none">filter_alt</span>
          <span class="text-white text-base leading-none">ตัวกรอง</span>
          <span :class="{ 'rotate-180': isFilterDropdownOpen }"
            class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto duration-300">arrow_drop_down</span>
        </button>

        <div v-if="isFilterDropdownOpen"
          class="absolute right-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md overflow-y-auto z-50 border border-gray-300">
          <div class="p-4 w-[500px] list-none">
            <h3 class="font-bold mb-2">กรองโดย Package Type</h3>
            <div class="grid grid-cols-3 gap-4">
              <label v-for="type in filteredPackageTypes" :key="type.id" class="flex items-center space-x-2">
                <input type="checkbox" v-model="selectedPackageType" :value="type.id"
                  class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-custom-orange checked:border-transparent">
                <span>{{ type.name }}</span>
              </label>
            </div>
          </div>
          <div class="flex justify-between space-x-4 p-4 bg-white border-t rounded-b-md list-none">
            <li @click="clearFilter"
              class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline">
              <span>รีเซ็ตตัวกรอง</span>
            </li>

            <div class="flex space-x-2">
              <button @click="toggleFiltterDropdown"
                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                ยกเลิก
              </button>
              <button @click="applyFilter"
                class="bg-custom-orange hover:bg-custom-orange-hover text-white px-4 py-2 rounded-md">
                ใช้ตัวกรอง
              </button>
            </div>
          </div>
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

    <div class="max-h-[540px] overflow-y-auto rounded-t-2xl mt-4">
        <table class="min-w-[2000px] table-auto">
          <thead class="sticky top-0 bg-custom-orange text-white z-10">
            <tr>
              <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold whitespace-nowrap']"
                :style="{ width: headerWidths[index] }">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="bg-white">
                        <td colspan="15" class="py-16 text-center">
                            <div class="flex justify-center items-center space-x-2">
                            <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                            <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                            <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-400"></div>
                            </div>
                        </td>
                    </tr>

            <template v-else>
              <template v-if="filteredSaleRecords1standRenew.length > 0">
                <tr v-for="(saleRecord, index) in filteredSaleRecords" :key="index"
                  class=" bg-white relative border-b border-b-gray-200">

                  <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ formatDate(saleRecord.paid_date) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5 font-bold text-custom-orange">
                    {{ getCustomerName(saleRecord.customer_id) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ getPackageName(saleRecord.package_id) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ formatPrice(saleRecord.total_price) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ formatDate(saleRecord.start_package_date) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ formatDate(saleRecord.expiry_date) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    <span v-if="saleRecord.remaining_days <= 0" class="text-red-500 font-bold">
                      หมดอายุ
                    </span>
                    <span v-else> {{ saleRecord.remaining_days }} วัน </span>
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ getTotalDay(saleRecord.package_id) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ getBoxperDay(saleRecord.package_id) }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ saleRecord.total_boxes_show }}
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    <span v-if="saleRecord.total_boxes <= 0" class="text-red-500 font-bold">
                      {{ saleRecord.total_boxes }}
                    </span>
                    <span v-else> {{ saleRecord.total_boxes }} </span>
                  </td>

                  <td class="px-4 py-2 align-top pb-5">
                    {{ saleRecord.credit }}
                  </td>

                </tr>
              </template>

              <template v-if="filteredSaleRecords1standRenew.length < 6 && filteredSaleRecords1standRenew.length > 0">
                <tr v-for="emptyIndex in (6 - filteredSaleRecords1standRenew.length)" :key="'empty-' + emptyIndex"
                  class="bg-white">
                  <td colspan="15" class="py-16"></td>
                </tr>
              </template>

              <template v-if="filteredSaleRecords1standRenew.length === 0">
                <tr>
                  <td colspan="15" class="py-10 bg-white text-center text-gray-500 font-bold">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
    </div>


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

        <button v-for="page in totalPagesArray.range" :key="page" @click="goToPage(page)" :class="[
          'px-3 py-2 rounded-md',
          {
            'bg-custom-orange text-white': currentPage === page,
            'bg-white': currentPage !== page,
          },
        ]" class="cursor-pointer hover:bg-custom-orange hover:text-white">
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
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { API_URL } from "@/services/api";

export default {
  data() {
    return {
      headers: [
        "#",
        `วันที่ชำระเงิน`,
        "Customer's Name",
        "Package",
        "มูลค่าขายรวม",
        "วันเริ่มแพ็คเกจ",
        "วันหมดอายุแพ็กเกจ",
        "วันคงเหลือของแพ็กเกจ",
        "Total days",
        "Box per Day",
        "Total boxes",
        "Total boxes (เหลือ)",
        "Credit",
      ],
      headerWidths: ["150px", "100px", "300px", "500px", "100px", "100px", "100px", "100px", "100px", "100px", "100px", "100px"],
      saleRecords: [],

      searchQuery: "",
      filteredSaleRecords: [],

      saleRecord: {
        customer_id: "",
        promotion_type_id: "",
        program_id: "",
        package_id: "",
        package_type_id: "",
        seller_name_id: "",
        delivery: "",

        package_price: 0,
        discount: 0,
        extra_charge: 0,
        extra_charge_price: '',
        total_package_price: "",

        zone1_id: "",
        zone1_quantity: 0,

        zone2_id: "",
        zone2_quantity: 0,

        zone3_id: "",
        zone3_quantity: 0,

        zone_outsource_id: "",
        zone_outsource_quantity: 0,

        total_delivery_zone_price: "",
        total_delivery_price: "",
        payment_status: "unpaid",
        paid_date: "",
        payment_type_id: "",
        start_package_date: "",
        expiry_date: "",
        remaining_days: 0,

        additional_type_id: "",
        add_detail: "",
        add_price: 0,

        receive_food_id: "",
        select_food_id: "",
        delivery_round_id: "",
        note: "",

        free_mad: 0,
        free_dessert: 0,
        free_brittles: 0,
        free_energy_balls: 0,
        free_dressing: 0,
        free_yoghurt: 0,
        free_granola: 0,

        free_credit: 0,
        other_promotion_detail: "",
      },
      customers: [],
      customerAddress: null,

      promotionTypes: [],
      programs: [],
      packages: [],
      packageTypes: [],
      zoneDeliveries: [],
      zoneDeliveryTypes: [],
      selectedZoneDeliveryType: "",
      sellerNames: [],
      paymentTypes: [],
      additionalTypes: [],
      deliveryRounds: [],
      receiveFoods: [],
      selectFoods: [],

      packageDetails: null,
      isShowingPackageDetails: false,

      isSortDropdownOpen: false,
      sortDirection: {
        id: 1,
        name: 1,
      },
      sortColumn: "",

      isFilterDropdownOpen: false,
      selectedPackageType: [],
      //filteredSaleRecord: [],

      isDetailModalOpen: false,
      moreOpenDropdownIndex: null,

      selectedSaleRecord: {
        id: "",
        customer_id: "",
        promotion_type_id: "",
        program_id: "",
        package_id: "",
        package_type_id: "",
        seller_name_id: "",
        delivery: "",

        package_price: 0,
        discount: 0,
        extra_charge: 0,
        extra_charge_price: 0,
        total_package_price: "",

        zone1_id: "",
        zone1_quantity: 0,

        zone2_id: "",
        zone2_quantity: 0,

        zone3_id: "",
        zone3_quantity: 0,

        zone_outsource_id: "",
        zone_outsource_quantity: 0,

        total_delivery_zone_price: "",
        total_delivery_price: "",
        payment_status: "unpaid",
        paid_date: "",
        payment_type_id: "",
        start_package_date: "",
        expiry_date: "",
        remaining_days: 0,

        additional_type_id: "",
        add_detail: "",
        add_price: 0,

        receive_food_id: "",
        select_food_id: "",
        delivery_round_id: "",
        note: "",

        free_mad: 0,
        free_dessert: 0,
        free_brittles: 0,
        free_energy_balls: 0,
        free_dressing: 0,
        free_yoghurt: 0,
        free_granola: 0,

        free_credit: 0,
        other_promotion_detail: "",
      },

      currentPage: 1,
      itemsPerPage: 10,

      allDailySales: [],
      allTotalSales: 0,
      DailySales: [],
      totalSales: 0,
      startDate: '',
      endDate: '',

      toastSuccessMessage: "",
      showSuccessToast: false,
      toastFailMessage: "",
      showFailToast: false,
      showErrorToast: false,
      toastErrorMessage: "",

      isLoading: false,

    };
  },
  computed: {
    totalPages() {
      // ใช้ข้อมูลที่กรองแล้วใน filteredSaleRecords1standRenew
      return Math.ceil(this.filteredSaleRecords1standRenew.length / this.itemsPerPage);
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

    filteredDetailSaleRecord() {
      return {
        paid_date: this.formatDate(this.selectedSaleRecord.paid_date),
        name: this.selectedSaleRecord.customer?.name || "",
        package: this.selectedSaleRecord.package?.name || "",
        total_price: this.formatPrice(this.selectedSaleRecord.total_price),
        delivery_date: this.selectedSaleRecord.customer?.delivery_date || "",
        food_allergies: (this.formatFoodAllergies(this.selectedSaleRecord.customer?.food_allergies) || "") + "\n" + (this.selectedSaleRecord.customer?.note || ""),
        start_package_date: this.formatDate(this.selectedSaleRecord.start_package_date),
        expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
        total_days: this.selectedSaleRecord.package?.total_days || "",
        boxes_per_day: this.selectedSaleRecord.package?.boxes_per_day || "",
        total_boxes_show: this.selectedSaleRecord.total_boxes_show || "",
        total_boxes: this.selectedSaleRecord.total_boxes || "",
        credit: this.selectedSaleRecord.credit,

      };
    },

    zone1_info() {
      const zoneName = this.getZoneName(this.selectedSaleRecord.zone1_id);
      const zoneQuantity = this.selectedSaleRecord.zone1_quantity;
      return `${zoneName} (${zoneQuantity})`;
    },

    zone1Name() {
      return this.selectedSaleRecord.zone1_id
        ? this.getZoneName(this.selectedSaleRecord.zone1_id)
        : "ไม่พบข้อมูล";
    },
    zone2Name() {
      return this.selectedSaleRecord.zone2_id
        ? this.getZoneName(this.selectedSaleRecord.zone2_id)
        : "ไม่พบข้อมูล";
    },
    zone3Name() {
      return this.selectedSaleRecord.zone3_id
        ? this.getZoneName(this.selectedSaleRecord.zone3_id)
        : "ไม่พบข้อมูล";
    },
    zoneOutsourceName() {
      return this.selectedSaleRecord.zone_outsource_id
        ? this.getZoneName(this.selectedSaleRecord.zone_outsource_id)
        : "ไม่พบข้อมูล";
    },

    filteredSaleRecords1standRenew() {
      return this.saleRecords
        .filter((record) => {
          const packageTypeName = this.getPackageTypeName(
            record.package_type_id
          ).toLowerCase();
          return (
            packageTypeName !== "additional sales" &&
            packageTypeName !== "consignment"
          );
        })
        .filter((saleRecord) => {
          const matchesSearch = this.getCustomerName(
            saleRecord.customer_id
          ).toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id);
          const matchesPaymentStatus = saleRecord.payment_status === "paid"; // เพิ่มเงื่อนไขการชำระเงินเป็น "paid"
          return matchesSearch && matchesPackageType && matchesPaymentStatus;
        });
    },

    filteredPackageTypes() {
      return this.packageTypes.filter(type =>
        !type.name.toLowerCase().includes('additional sales') &&
        !type.name.toLowerCase().includes('consignment')
      );
    },

    ...mapGetters(["saleRecords"]),
  },
  methods: {
    ...mapActions([
      "fetchSaleRecords",
      "fetchLookupData",
      "fetchCustomerAddress",
    ]),

    resetProgramAndPackage() {
      this.saleRecord.program_id = null;
      this.saleRecord.package_id = null;
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
      return "฿" + new Intl.NumberFormat("th-TH").format(price);
    },
    formatPercent(percent) {
      return new Intl.NumberFormat("th-TH").format(percent) + "%";
    },

    fetchCustomerAddress(selectedCustomer) {
      if (!selectedCustomer || !selectedCustomer.id) {
        this.customerAddress = "เลือกลูกค้าใหม่";
        this.saleRecord.address_1 = "";
        this.saleRecord.address_2 = "";
        this.saleRecord.address_3 = "";
        return;
      }

      const selectedCustomerId =
        selectedCustomer.id || selectedCustomer.customer_id;
      const customer = this.customers.find((c) => c.id === selectedCustomerId);

      if (customer) {
        this.customerAddress = `${customer.address_1 || ""} ${customer.address_2 || ""
          } ${customer.address_3 || ""}`.trim();
        this.saleRecord.address_1 = customer.address_1;
        this.saleRecord.address_2 = customer.address_2;
        this.saleRecord.address_3 = customer.address_3;

        if (!this.customerAddress) {
          this.customerAddress = "ไม่มีที่อยู่";
        }
      } else {
        this.customerAddress = "ไม่พบข้อมูลลูกค้า";
        // console.log('Customer not found');
      }
    },

    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.updatePage();
    },
    updatePage() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      // ใช้ข้อมูลที่กรองแล้วใน filteredSaleRecords1standRenew
      this.filteredSaleRecords = this.filteredSaleRecords1standRenew.slice(startIndex, endIndex);
    },

    search() {
      const filtered = this.saleRecords.filter((saleRecord) => {
        const matchesSearch = this.getCustomerName(
          saleRecord.customer_id
        ).toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id);
        return matchesSearch && matchesPackageType;
      });

      this.currentPage = 1;
      this.filteredSaleRecords1standRenew = filtered;
      this.updatePage();
    },
    clearSearch() {
      this.searchQuery = "";
      this.search();
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

      this.saleRecords.sort((a, b) => {
        let aValue, bValue;

        if (column === "name") {
          aValue = this.getCustomerName(a.customer_id);
          bValue = this.getCustomerName(b.customer_id);
        } else if (column === "paid_date") {
          // แปลง paid_date เป็น Date object เพื่อให้สามารถจัดเรียงวันที่ได้
          aValue = new Date(a[column]);
          bValue = new Date(b[column]);
        } else {
          aValue = a[column];
          bValue = b[column];
        }

        // เปรียบเทียบค่า
        if (aValue < bValue) return -this.sortDirection[column];
        if (aValue > bValue) return this.sortDirection[column];
        return 0;
      });

      this.currentPage = 1;
      this.updatePage();
    },
    clearSort() {
      this.sortColumn = "id";
      this.sortDirection.id = 1;
      this.saleRecords.sort((a, b) => a.id - b.id);
      this.currentPage = 1;
      this.updatePage();
    },

    toggleFiltterDropdown() {
      this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    },
    applyFilter() {
      if (this.selectedPackageType.length > 0) {
        this.filteredSaleRecords = this.packageTypes.filter(packageType =>
          this.selectedPackageType.includes(packageType.package_type_id)
        );
      } else {
        this.filteredSaleRecords = this.saleRecords;
      }
      this.isFilterDropdownOpen = false;
      this.updatePage();
    },
    clearFilter() {
      this.selectedPackageType = [];
      this.filteredSaleRecords = this.saleRecords;
      this.updatePage();
    },

    toggleMoreDropdown(index) {
      this.moreOpenDropdownIndex =
        this.moreOpenDropdownIndex === index ? null : index;
    },
    moreDropdownPositionClass(index) {
      if (index >= this.filteredSaleRecords.length - 2) {
        return "dropdown-up";
      }
      return "dropdown-down";
    },

    getPaymentStatusText(status) {
      return status === "paid" ? "ชำระเงินแล้ว" : "ยังไม่ได้ชำระเงิน";
    },
    getPaymentStatusClass(status) {
      return status === "paid"
        ? "text-white bg-green-500"
        : "text-white bg-red-500";
    },
    getAddPaymentStatusClass(status) {
      return status === "paid"
        ? "text-green-500 font-bold"
        : "text-red-500 font-bold";
    },

    filterPrograms() {
      if (
        this.saleRecord.promotion_type_id &&
        this.saleRecord.promotion_type_id.id
      ) {
        this.programs = this.allPrograms.filter(
          (program) =>
            program.promotion_type_id === this.saleRecord.promotion_type_id.id
        );
      } else {
        this.programs = this.allPrograms; // หรือค่า default ที่คุณต้องการ
      }
      this.saleRecord.program_id = [];
    },

    filterPackages() {
      if (this.saleRecord.program_id && this.saleRecord.program_id.id) {
        this.packages = this.allPackages.filter(
          (pkg) => pkg.program_id === this.saleRecord.program_id.id
        );
      } else {
        this.packages = this.allPackages; // ค่า default ที่คุณต้องการ
      }
      this.saleRecord.package_id = []; // รีเซ็ตค่า package_id
    },

    filterEditPrograms() {
      if (
        this.selectedSaleRecord.promotion_type_id &&
        this.selectedSaleRecord.promotion_type_id.id
      ) {
        this.programs = this.allPrograms.filter(
          (program) =>
            program.promotion_type_id === this.selectedSaleRecord.promotion_type_id.id
        );
      } else {
        this.programs = this.allPrograms; // หรือค่า default ที่คุณต้องการ
      }
    },
    filterEditPackages() {
      if (this.selectedSaleRecord.program_id && this.selectedSaleRecord.program_id.id) {
        this.packages = this.allPackages.filter(
          (pkg) => pkg.program_id === this.selectedSaleRecord.program_id.id
        );
      } else {
        this.packages = this.allPackages; // ค่า default ที่คุณต้องการ
      }
    },

    async showPackageDetails(packageId) {
      const selectedSaleRecord = this.packages.find(
        (pkg) => pkg.id === packageId.id
      ); // เข้าถึง id จาก Proxy
      if (selectedSaleRecord) {
        this.packageDetails = selectedSaleRecord;
        this.isShowingPackageDetails = true;
      } else {
        console.error("ไม่พบแพ็คเกจที่เลือก");
      }
    },
    togglePackageDetails(packageId) {
      if (this.isShowingPackageDetails) {
        this.resetPackageDetails();
      } else {
        this.showPackageDetails(packageId);
      }
    },
    resetPackageDetails() {
      this.packageDetails = null;
      this.isShowingPackageDetails = false;
    },

    async fetchLookupData() {
      try {
        const [
          customersRes,
          promotionTypesRes,
          programsRes,
          packagesRes,
          packageTypesRes,
          zoneDeliveryRes,
          zoneDeliveryTypeRes,
          sellerNamesRes,
          paymentTypeRes,
          additionalTypeRes,
          deliveryRoundRes,
          receiveFoodRes,
          selectFoodRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/customers-hhb`),
          axios.get(`${API_URL}/promotion-types`),
          axios.get(`${API_URL}/programs`),
          axios.get(`${API_URL}/packages`),
          axios.get(`${API_URL}/package-types`),
          axios.get(`${API_URL}/zone-deliveries`),
          axios.get(`${API_URL}/zone-delivery-types`),
          axios.get(`${API_URL}/seller-names`),
          axios.get(`${API_URL}/payment-types`),
          axios.get(`${API_URL}/additional-types`),
          axios.get(`${API_URL}/delivery-rounds`),
          axios.get(`${API_URL}/receive-foods`),
          axios.get(`${API_URL}/select-foods`),
        ]);

        this.customers = customersRes.data;
        this.promotionTypes = promotionTypesRes.data;
        this.allPrograms = programsRes.data || [];
        this.programs = this.allPrograms;
        if (this.saleRecord.promotion_type_id) {
          this.filterPrograms();
        }

        this.allPackages = packagesRes.data.filter((packaged) => {
          if (!packaged.start_package_date) {
            packaged.displayLabel = packaged.name;
            return true;
          }

          const date = new Date(packaged.start_package_date);
          const currentMonth = new Date().getMonth();
          const startMonth = date.getMonth();

          if (startMonth === currentMonth) {
            const thaiMonths = [
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฎาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ];
            const thaiMonth = thaiMonths[date.getMonth()];
            const thaiYear = date.getFullYear();

            packaged.displayLabel = `${packaged.name} (${thaiMonth} ${thaiYear})`;
            return true;
          }
          return false;
        });
        this.packages = this.allPackages;
        if (this.saleRecord.program_id) {
          this.filterPackages();
        }

        this.packageTypes = packageTypesRes.data;
        this.zoneDeliveries = zoneDeliveryRes.data;
        this.zoneDeliveryTypes = zoneDeliveryTypeRes.data;
        this.sellerNames = sellerNamesRes.data;
        this.paymentTypes = paymentTypeRes.data.data;
        this.additionalTypes = additionalTypeRes.data;

        this.deliveryRounds = deliveryRoundRes.data;
        this.receiveFoods = receiveFoodRes.data;
        this.selectFoods = selectFoodRes.data;

        this.updatePage;
        //console.log('Fetched payment types:', paymentTypeRes.data);
        //console.log(this.paymentTypes);
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },

    async fetchSaleRecords() {
      this.isLoading = true;

      try {
        const response = await axios.get(`${API_URL}/sale-records-hhb`);
        this.saleRecords = response.data;
        this.filteredSaleRecords = response.data;
        this.saleRecords.sort((a, b) => a.id - b.id);
        this.updatePage();
      } catch (error) {
        console.error("Error fetching sale records:", error);
      } finally {
                this.isLoading = false;
      }
    },

    async fetchAllDailySales() {
      this.isLoading = true;

      try {
        const response = await axios.get(`${API_URL}/sales-hhb/all-daily`, {
        });

        this.allDailySales = response.data.data.allDailySales;
        // this.filteredDailySales = this.dailySales;
        this.allTotalSales = response.data.data.totalSales;
        // this.allTotalSalesBeforeVAT = response.data.data.totalSalesBeforeVAT;
        // this.totalPackageBeforeVAT = response.data.data.totalPackageBeforeVAT;
        // this.totalDeliveryBeforeVAT = response.data.data.totalDeliveryBeforeVAT;

      } catch (error) {
        console.error('Error fetching sales data in range:', error);
      } finally {
                this.isLoading = false;
      }
    },
    async fetchDailySales(startDate, endDate) {
      this.isLoading = true;

      try {
        const response = await axios.get(`${API_URL}/sales-hhb/daily`, {
          params: { startDate, endDate },
        });

        this.dailySales = response.data.data.dailySales;
        this.totalSales = response.data.data.totalSales;

      } catch (error) {
        console.error('Error fetching sales data in range:', error);
      } finally {
                this.isLoading = false;
      }
    },
    formatNumber(number) {
      return new Intl.NumberFormat('th-TH', {
      }).format(number);
    },

    // formatPrice(price) {
    //   return '฿' + new Intl.NumberFormat('th-TH', {
    //     minimumFractionDigits: 2,  // ตั้งค่าจำนวนตำแหน่งทศนิยมขั้นต่ำ
    //     maximumFractionDigits: 2   // ตั้งค่าจำนวนตำแหน่งทศนิยมสูงสุด
    //   }).format(price);
    // },

    getCustomerName(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.name : "ไม่พบข้อมูล";
    },
    getPromotionTypeName(promotionTypeId) {
      const promotionType = this.promotionTypes.find((c) => c.id === promotionTypeId);
      return promotionType ? promotionType.name : "ไม่พบข้อมูล";
    },
    getProgramName(programId) {
      const program = this.programs.find((p) => p.id === programId);
      if (program) {
        const promotionType = this.promotionTypes.find(
          (pt) => pt.id === program.promotion_type_id
        );
        const promotionTypeName = promotionType
          ? promotionType.name
          : "ไม่มีโปรโมชั่น"; // กรณีที่ไม่มีข้อมูล PromotionType
        return `${program.name} (${promotionTypeName})`; // แสดงชื่อโปรแกรมพร้อมชื่อโปรโมชั่น
      }
      return "ไม่พบข้อมูล";
    },
    getPackageName(packageId) {
      if (this.allPackages && Array.isArray(this.allPackages)) {
        const packaged = this.allPackages.find((p) => p.id === packageId);
        if (packaged) {
          if (!packaged.start_package_date) {
            return packaged.name;
          }

          const date = new Date(packaged.start_package_date);
          const currentMonth = new Date().getMonth();
          const startMonth = date.getMonth();

          if (startMonth === currentMonth) {
            const thaiMonths = [
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฎาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ];
            const thaiMonth = thaiMonths[date.getMonth()];
            const thaiYear = date.getFullYear();

            return `${packaged.name} (${thaiMonth} ${thaiYear})`;
          }
          return packaged.name;
        }
        return "ไม่พบข้อมูล";
      }
      return "ข้อมูลแพ็คเกจไม่พร้อมใช้งาน";
    },
    getPackageTypeName(packageTypeId) {
      const packageType = this.packageTypes.find((c) => c.id === packageTypeId);
      return packageType ? packageType.name : "ไม่พบข้อมูล";
    },
    getPaymentTypeName(paymentTypeId) {
      const payment_type = this.paymentTypes.find((c) => c.id === paymentTypeId);
      return payment_type ? payment_type.name : null;
    },
    getZoneName(zoneDeliveryId) {
      const zoneDelivery = this.zoneDeliveries.find(
        (z) => z.id === zoneDeliveryId
      );
      return zoneDelivery ? zoneDelivery.name : "ไม่พบข้อมูล";
    },
    getSelectFood(selectFoodId) {
      const selectFood = this.selectFoods.find((z) => z.id === selectFoodId);
      return selectFood ? selectFood.name : " ";
    },
    getReceiveFoodName(receiveFoodId) {
      const receiveFood = this.receiveFoods.find((z) => z.id === receiveFoodId);
      return receiveFood ? receiveFood.name : "";
    },
    getDeliveryRoundName(deiveryRoundId) {
      const deliveryRound = this.deliveryRounds.find(
        (z) => z.id === deiveryRoundId
      );
      return deliveryRound ? deliveryRound.name : " ";
    },
    getSellerName(sellerId) {
      const seller = this.sellerNames.find((z) => z.id === sellerId);
      return seller ? seller.name : " ";
    },
    getZonePrice(zoneId) {
      // สมมติว่า zone_deliveries เป็นอาเรย์หรือออบเจกต์ที่เก็บข้อมูลทั้งหมดของ zone
      const zone = this.zoneDeliveries.find((zone) => zone.id === zoneId);
      return zone ? zone.price : 0; // ถ้าไม่พบ zone ให้คืนค่า 0
    },
    getTotalBoxes(packageId) {
      const packaged = this.packages.find(
        (z) => z.id === packageId
      );
      return packaged ? packaged.total_boxes : "ไม่พบข้อมูล";
    },
    getDeliveryDate(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.delivery_date : null;
    },
    getFoodAllergie(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.food_allergies : null;
    },
    getTotalDay(packageId) {
      const packaged = this.packages.find((c) => c.id === packageId);
      return packaged ? packaged.total_days : null;
    },
    getBoxperDay(packageId) {
      const packaged = this.packages.find((c) => c.id === packageId);
      return packaged ? packaged.boxes_per_day : null;
    },

    onViewDetail(saleRecord) {
      this.selectedSaleRecord = saleRecord;
      this.isDetailModalOpen = true;
      this.moreOpenDropdownIndex = null;
    },
    closeDetailModal() {
      this.isDetailModalOpen = false;
      // this.selectedSaleRecord = null;
    },
    formatDetailLabel(key) {
      const labels = {

        paid_date: "วันที่ชำระเงิน",
        name: "ชื่อ-นามสกุล",
        package: "แพ็กเกจที่ซื้อ",
        total_price: "มูลค่าขายรวม",
        delivery_date: "วันที่ต้องการรับอาหาร",
        food_allergies: "Allergies /Special Requests",
        start_package_date: "วันเริ่มแพ็กเกจ",
        expiry_date: "วันหมดอายุแพ็คเกจ",
        total_days: "Total days",
        boxes_per_day: "Box per Day",
        total_boxes_show: "Total boxes",
        total_boxes: "Total boxes (เหลือ)",
        credit: "Credit",

      };
      return labels[key] || key;
    },
    getLabelClass(key) {
      if (key === "total_package_price") {
        return "text-custom-orange";
      }
      return "";
    },
    getValueClass() {
      return "";
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

    checkPackageType() {
      if (
        this.saleRecord.package_type_id &&
        (this.saleRecord.package_type_id.name.toLowerCase() === 'additional sales' ||
          this.saleRecord.package_type_id.name.toLowerCase() === 'consignment')
      ) {
        this.clearAdditionalForm();
      } else {
        this.clearNotAdditionalForm();
      }
    },
    formatFoodAllergies(value) {
      if (value === 'Yes') {
        return 'ใช่ Yes,';
      } else if (value === 'No') {
        return 'ไม่ No';
      }
      return value; // ถ้าไม่ใช่ Yes หรือ No ให้แสดงค่าปกติ
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
  watch: {
    "saleRecord.customer_id"(newCustomerId) {
      this.fetchCustomerAddress(newCustomerId);
    },
    "saleRecord.promotion_type_id": function () {
      this.filterPrograms();
    },
    "selectedSaleRecord.promotion_type_id": function () {
      this.filterEditPrograms();
    },
    "saleRecord.program_id": function () {
      this.filterPackages();
    },
    "selectedSaleRecord.program_id": function () {
      this.filterEditPackages();
    },
    searchQuery() {
      this.updatePage();
    },
    currentPage() {
      this.updatePage();
    },
  },
  created() {
    this.filteredSaleRecords = this.saleRecords;
    this.sortData("id");
    this.fetchLookupData();
    this.fetchSaleRecords();
    this.fetchAllDailySales();
    this.fetchDailySales();
    this.updatePage();
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.fetchLookupData();
    this.fetchSaleRecords();
    this.fetchAllDailySales();
    this.fetchDailySales();
    this.updatePage();

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    this.endDate = formattedToday;
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style>
.dropdown-up {
  bottom: 100%;
  margin-bottom: 4px;
}
</style>
