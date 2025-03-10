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
    <div class="flex space-x-2 items-center relative">
      <div class="mt-4 px-4 flex items-center space-x-1 mr-auto">
        <span class="material-symbols-outlined text-2xl text-gray-700">deployed_code_history</span>
        <span class="text-m text-gray-700">จำนวนลูกค้าที่มีแพ็คเกจทั้งหมด: </span>
        <span class="text-m text-custom-orange font-bold">
          {{ filteredSaleRecords1standRenew.length }} รายการ</span>
      </div>

      <button v-if="selectedPackageType.length > 0 || selectedProgramIds.length > 0 || remainingDaysFilter"
        @click="clearFilter"
        class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
        <span class="material-symbols-outlined">close</span>
        <span class="ml-2">
          รีเซ็ตตัวกรอง
          <template v-if="selectedPackageType.length > 0 && selectedProgramIds.length === 0 && !remainingDaysFilter">
            ({{ selectedPackageType.length }})
          </template>

          <template v-if="selectedProgramIds.length > 0 && selectedPackageType.length === 0 && !remainingDaysFilter">
            ({{ selectedProgramIds.length }})
          </template>

          <template v-if="remainingDaysFilter && selectedPackageType.length === 0 && selectedProgramIds.length === 0">
            ({{ remainingDaysFilter === 'expired' ? 'หมดอายุ' : 'ยังไม่หมดอายุ' }})
          </template>

          <template v-if="selectedPackageType.length > 0 && selectedProgramIds.length > 0 && remainingDaysFilter">
            ({{ selectedPackageType.length + selectedProgramIds.length + 1 }}) <!-- +1 สำหรับ Remaining Days -->
          </template>

          <template v-if="selectedPackageType.length > 0 && selectedProgramIds.length > 0 && !remainingDaysFilter">
            ({{ selectedPackageType.length + selectedProgramIds.length }})
          </template>

          <template v-if="selectedPackageType.length > 0 && selectedProgramIds.length === 0 && remainingDaysFilter">
            ({{ selectedPackageType.length + 1 }}) <!-- +1 สำหรับ Remaining Days -->
          </template>

          <template v-if="selectedProgramIds.length > 0 && selectedPackageType.length === 0 && remainingDaysFilter">
            ({{ selectedProgramIds.length + 1 }}) <!-- +1 สำหรับ Remaining Days -->
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
          class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-48 z-50 border border-gray-300">
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

            <h3 class="font-bold mt-4 mb-2">กรองโดย Program</h3>
            <div class="space-y-2">
              <label v-for="program in filteredProgramIds" :key="program.id" class="flex items-center space-x-2">
                <input type="checkbox" v-model="selectedProgramIds" :value="program.id"
                  class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-custom-orange checked:border-transparent">
                <span>{{ getProgramName(program.id) }}</span>
              </label>
            </div>

            <h3 class="font-bold mt-4 mb-2">กรองโดยวันคงเหลือของแพ็กเกจ</h3>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center space-x-2">
                <input type="radio" v-model="remainingDaysFilter" value="expired"
                  class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-red-500 checked:border-transparent">
                <span>หมดอายุ</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="radio" v-model="remainingDaysFilter" value="not_expired"
                  class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-green-500 checked:border-transparent">
                <span>ยังไม่หมดอายุ</span>
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

    <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white">
          <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left text-sm font-bold']"
            :style="{ width: headerWidths[index] }">
            {{ header }}
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
              <td class="px-4 py-2 align-top pb-5 font-bold ">
                {{ getPackageTypeName(saleRecord.package_type_id) }}
              </td>
              <td class="px-4 py-2 align-top pb-5">
                {{ getProgramName(saleRecord.program_id) }}
              </td>
              <td class="px-4 py-2 align-top pb-5">
                {{ getPackageName(saleRecord.package_id) }}
              </td>
              <td class="px-4 py-2 align-top pb-5">
                <span v-if="saleRecord.remaining_days < 0" class="text-red-500 font-bold">
                  หมดอายุ
                </span>
                <span v-else> {{ saleRecord.remaining_days }} วัน </span>
              </td>

              <td class="px-4 py-2 align-top pb-5">
                {{ formatDate(saleRecord.expiry_date) }}
              </td>

              <td class="px-4 py-2 align-top pb-5">
                <span v-if="saleRecord.total_boxes <= 0" class="text-red-500 font-bold">
                  {{ saleRecord.total_boxes }}
                </span>
                <span v-else> {{ saleRecord.total_boxes }} </span>
              </td>

              <!-- <td class="px-4 py-2 align-top pb-5">
              <button @click="openHistoryModal(saleRecord.customer_id)"
                class="flex items-center space-x-1 text-custom-orange">
                <span class="material-symbols-outlined text-2xl">history</span>
                <span class="text-m">ประวัติการสั่งรายการอาหาร</span>
              </button>
            </td> -->

              <td class="px-4 py-2 align-top pb-5">
                <router-link :to="`/order-history/${saleRecord.customer_id}`"
                  class="flex items-center space-x-1 text-custom-orange hover:text-custom-orange-hover">
                  <span class="material-symbols-outlined text-2xl">history</span>
                  <span class="text-m">ประวัติการสั่งรายการอาหาร</span>
                </router-link>
              </td>
            </tr>
          </template>

          <template v-if="filteredSaleRecords1standRenew.length < 6 && filteredSaleRecords1standRenew.length > 0">
            <tr v-for="emptyIndex in (6 - filteredSaleRecords1standRenew.length)" :key="'empty-' + emptyIndex"
              class="bg-white">
              <td colspan="10" class="py-16"></td>
            </tr>
          </template>

          <template v-if="filteredSaleRecords1standRenew.length === 0">
            <tr>
              <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">
                ไม่พบข้อมูล
              </td>
            </tr>
          </template>
        </template>
      </tbody>

      <div v-if="isDetailModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div class="bg-white rounded-md shadow-lg w-1/2 max-w-6xl h-auto max-h-[800px] flex flex-col">
          <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
            <span class="font-bold">รายละเอียดบันทึกการขาย</span>
            <div class="flex space-x-2">
              <span @click="closeDetailModal" class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                close
              </span>
            </div>
          </div>

          <div class="pb-2 pt-2 overflow-y-auto flex-grow" ref="modalContent">
            <div v-for="(value, key, index) in filteredDetailSaleRecord" :key="key" :class="[
              'p-2 rounded-md',
              index % 2 === 0 ? 'bg-white rounded-none' : 'bg-gray-100 rounded-none'  // สลับสีบรรทัด
            ]">
              <div v-if="key === 'zone1_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone1_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone1_id)) }}
                </div>
              </div>

              <div v-else-if="key === 'zone2_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone2_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone2_id)) }}
                </div>
              </div>

              <div v-else-if="key === 'zone3_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone3_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone3_id)) }}
                </div>
              </div>

              <div v-else-if="key === 'zone_outsource_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone_outsource_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone_outsource_id)) }}
                </div>
              </div>

              <template v-else>
                <strong class="mr-2 pl-3 pr-3">{{ formatDetailLabel(key) }}:</strong> {{ value }}
              </template>
            </div>
          </div>

        </div>
      </div>

      <div v-if="isHistoryModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div class="bg-white rounded-md shadow-lg w-1/2 max-w-4xl h-auto max-h-[600px] flex flex-col">
          <div class="flex justify-between items-center bg-blue-500 text-white px-4 py-2 rounded-t-md">
            <span class="font-bold">ประวัติการสั่งรายการอาหารของลูกค้า {{ selectedCustomerId }}</span>
            <span @click="closeHistoryModal"
              class="material-symbols-outlined cursor-pointer hover:text-gray-200">close</span>
          </div>

          <div class="p-4 overflow-y-auto flex-grow">
            <div v-if="loadingHistory">กำลังโหลด...</div>

            <table v-else-if="orderHistory.length > 0" class="w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border border-gray-300 px-4 py-2">หมายเลขคำสั่งซื้อ</th>
                  <th class="border border-gray-300 px-4 py-2">วันที่สั่งซื้อ</th>
                  <th class="border border-gray-300 px-4 py-2">สถานะ</th>
                  <th class="border border-gray-300 px-4 py-2">จำนวน</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orderHistory" :key="order.id">
                  <td class="border border-gray-300 px-4 py-2">{{ order.id }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ order.order_date }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ order.status }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ order.quantity }}</td>
                </tr>
              </tbody>
            </table>

            <div v-else class="text-gray-500 mt-2">ไม่มีประวัติการสั่งรายการอาหาร</div>
          </div>
        </div>
      </div>

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
import { API_URL } from "@/services/testapi";

export default {
  data() {
    return {
      headers: [
        "#",
        `วันที่ชำระ`,
        `Customer's Name`,
        "Package Type",
        "Program",
        "Package",
        "วันคงเหลือของแพ็กเกจ",
        "วันหมดอายุแพ็กเกจ",
        "ยอดคงเหลือแพ็กเกจ",
        "",
      ],
      headerWidths: ["5%", "8%", "15%", "10%", "11%", "11%", "10%", "10%", "10%", "15%"],
      saleRecords: [],

      searchQuery: "",
      filteredSaleRecords: [],

      isAddModalOpen: false,
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
        start_date: "",
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
      selectedProgramIds: [],
      remainingDaysFilter: '',
      //filteredSaleRecord: [],

      isDetailModalOpen: false,
      isResultModalOpen: false,

      isDeleteModalOpen: false,
      itemToDelete: null,

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
        start_date: "",
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
      isCopied: false,

      isEditModalOpen: false,

      isConfirmPaymentModalOpen: false,
      selectedPaidDate: "",
      selectedPaymentTypeId: "",
      // selectedSaleRecord: null,

      currentPage: 1,
      itemsPerPage: 10,

      isHistoryModalOpen: false, // ควบคุมการเปิด/ปิด Modal
      selectedCustomerId: null, // เก็บ customer_id ที่เลือก
      orderHistory: [],
      loadingHistory: false,

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
    filteredResultSaleRecord() {
      if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer) {
        return { name: "", expiry_date: "" };
      }
      return {
        name: this.selectedSaleRecord.customer.name,
        package: this.selectedSaleRecord.package.package_detail,
        promotion_detail: this.selectedSaleRecord.package.promotion_detail,
        receive_food: this.totalReceiveFood,
        start_date: this.formatDate(this.selectedSaleRecord.start_date),
        sellect_by: this.getSelectFood(this.selectedSaleRecord.select_food_id),
        delivery_date: this.selectedSaleRecord.customer.delivery_date,
        delivery: this.getDeliveryRoundName(
          this.selectedSaleRecord.delivery_round_id
        ),
        package_price: this.formatPrice(this.selectedSaleRecord.package.price),
        extra_charge: this.formatPrice(this.selectedSaleRecord.extra_charge),
        discount: this.formatPrice(this.selectedSaleRecord.discount),
        total_delivery_price: this.totalDeliveryPrice,
        total_price: this.formatPrice(this.selectedSaleRecord.total_price),
        expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
        note: this.selectedSaleRecord.note,
      };
    },

    filteredDetailSaleRecord() {
      if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer) {
        return { name: "", expiry_date: "" };
      }
      return {
        seller_name_id: this.getSellerName(
          this.selectedSaleRecord.seller_name_id
        ),
        name: this.selectedSaleRecord.customer?.name || "",
        package_type: this.getPackageTypeName(
          this.selectedSaleRecord.package_type_id
        ),
        // promotion_type: this.selectedSaleRecord.promotionType?.name || "",
        promotion_type: this.getPromotionTypeName(this.selectedSaleRecord.promotion_type_id) || "",
        program: this.getProgramName(this.selectedSaleRecord.program_id),
        package: this.selectedSaleRecord.package?.name || "",
        package_price: this.formatPrice(this.selectedSaleRecord.package?.price),
        promotion_detail: this.selectedSaleRecord.package?.promotion_detail || "",
        other_promotion_detail: this.selectedSaleRecord.other_promotion_detail || "",

        free_mad: this.selectedSaleRecord.free_mad,
        free_dessert: this.selectedSaleRecord.free_dessert,
        free_brittles: this.selectedSaleRecord.free_brittles,
        free_energy_balls: this.selectedSaleRecord.free_energy_balls,
        free_dressing: this.selectedSaleRecord.free_dressing,
        free_yoghurt: this.selectedSaleRecord.free_yoghurt,
        free_granola: this.selectedSaleRecord.free_granola,
        free_credit: this.selectedSaleRecord.free_credit,

        discount: this.formatPrice(this.selectedSaleRecord.discount),
        extra_charge: this.formatPercent(this.selectedSaleRecord.extra_charge),
        extra_charge_price: this.formatPrice(
          this.selectedSaleRecord.extra_charge_price
        ),
        total_package_price: this.formatPrice(
          this.selectedSaleRecord.total_package_price
        ),
        receive_food_id: this.getReceiveFoodName(
          this.selectedSaleRecord.receive_food_id
        ),
        zone1_id: this.getZoneName(this.selectedSaleRecord.zone1_id),
        total_zone1_price: this.formatPrice(
          this.selectedSaleRecord.total_zone1_price
        ),
        zone2_id: this.getZoneName(this.selectedSaleRecord.zone2_id),
        total_zone2_price: this.formatPrice(
          this.selectedSaleRecord.total_zone2_price
        ),
        zone3_id: this.getZoneName(this.selectedSaleRecord.zone3_id),
        total_zone3_price: this.formatPrice(
          this.selectedSaleRecord.total_zone3_price
        ),
        zone_outsource_id: this.getZoneName(
          this.selectedSaleRecord.zone_outsource_id
        ),
        total_zone_outsource_price: this.formatPrice(
          this.selectedSaleRecord.total_zone_outsource_price
        ),
        total_delivery_zone_price: this.formatPrice(
          this.selectedSaleRecord.total_delivery_zone_price
        ),
        total_delivery_price: this.formatPrice(
          this.selectedSaleRecord.total_delivery_price
        ),
        total_price: this.formatPrice(this.selectedSaleRecord.total_price),
        payment_status: this.getPaymentStatusText(
          this.selectedSaleRecord.payment_status
        ),
        paid_date: this.formatDate(this.selectedSaleRecord.paid_date),
        payment_type_id: this.getPaymentTypeName(
          this.selectedSaleRecord.payment_type_id
        ),
        start_date: this.formatDate(this.selectedSaleRecord.start_date),
        expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
        receive_date: this.formatDate(this.selectedSaleRecord.start_date),
        note: this.selectedSaleRecord.note || "",
        package_detail: this.selectedSaleRecord.package?.package_detail || "",

        mad: this.selectedSaleRecord.mad,
        dessert: this.selectedSaleRecord.dessert,
        brittles: this.selectedSaleRecord.brittles,
        energy_balls: this.selectedSaleRecord.energy_balls,
        dressing: this.selectedSaleRecord.dressing,
        yoghurt: this.selectedSaleRecord.yoghurt,
        granola: this.selectedSaleRecord.granola,
        credit: this.selectedSaleRecord.credit,

        delivery_date: this.selectedSaleRecord.customer?.delivery_date || "",
        select_food_id: this.getSelectFood(
          this.selectedSaleRecord.select_food_id
        ),
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

    totalReceiveFood() {
      let foods = [];

      if (this.selectedSaleRecord.mad > 0) {
        foods.push(`${this.selectedSaleRecord.mad} x Main Dish`);
      }
      if (this.selectedSaleRecord.dessert > 0) {
        foods.push(`${this.selectedSaleRecord.dessert} x Dessert`);
      }
      if (this.selectedSaleRecord.brittles > 0) {
        foods.push(
          `${this.selectedSaleRecord.brittles} x Brittles`
        );
      }
      if (this.selectedSaleRecord.energy_balls > 0) {
        foods.push(
          `${this.selectedSaleRecord.energy_balls} x Energy Balls`
        );
      }
      if (this.selectedSaleRecord.dressing > 0) {
        foods.push(
          `${this.selectedSaleRecord.dressing} x Dressing`
        );
      }
      if (this.selectedSaleRecord.yoghurt > 0) {
        foods.push(`${this.selectedSaleRecord.yoghurt} x Yoghurt`);
      }
      if (this.selectedSaleRecord.granola > 0) {
        foods.push(`${this.selectedSaleRecord.granola} x Granola`);
      }
      let foodText = foods.length > 0 ? foods.join(" + ") : "";

      return foodText;
    },

    totalDeliveryPrice() {
      let zones = [];
      if (
        this.selectedSaleRecord.zone1_id !== null &&
        this.selectedSaleRecord.zone1_quantity > 0
      ) {
        zones.push(
          `${this.getZoneName(this.selectedSaleRecord.zone1_id)} x ${this.selectedSaleRecord.zone1_quantity
          } ครั้ง`
        );
      }

      if (
        this.selectedSaleRecord.zone2_id !== null &&
        this.selectedSaleRecord.zone2_quantity > 0
      ) {
        zones.push(
          `${this.getZoneName(this.selectedSaleRecord.zone2_id)} x ${this.selectedSaleRecord.zone2_quantity
          } ครั้ง`
        );
      }

      if (
        this.selectedSaleRecord.zone3_id !== null &&
        this.selectedSaleRecord.zone3_quantity > 0
      ) {
        zones.push(
          `${this.getZoneName(this.selectedSaleRecord.zone3_id)} x ${this.selectedSaleRecord.zone3_quantity
          } ครั้ง`
        );
      }

      if (
        this.selectedSaleRecord.zone_outsource_id !== null &&
        this.selectedSaleRecord.zone_outsource_quantity > 0
      ) {
        zones.push(
          `${this.getZoneName(this.selectedSaleRecord.zone_outsource_id)} x ${this.selectedSaleRecord.zone_outsource_quantity
          } ครั้ง`
        );
      }

      let zoneText = zones.length > 0 ? `(${zones.join(" + ")})` : "";

      return this.selectedSaleRecord.total_delivery_price > 0
        ? `${this.formatPrice(
          this.selectedSaleRecord.total_delivery_price
        )} ${zoneText}`
        : "";
    },

    filteredSaleRecords1standRenew() {
      return this.saleRecords
        .filter((record) => {
          const packageTypeName = this.getPackageTypeName(record.package_type_id).toLowerCase();
          return packageTypeName !== "additional sales" && packageTypeName !== "consignment";
        })
        .filter((saleRecord) => {
          const matchesSearch = this.getCustomerName(saleRecord.customer_id).toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id);
          const matchesProgram = this.selectedProgramIds.length === 0 || this.selectedProgramIds.includes(saleRecord.program_id);
          const matchesPaymentStatus = saleRecord.payment_status === "paid";

          // Filter by Remaining Days
          const matchesRemainingDays =
            this.remainingDaysFilter === 'expired'
              ? saleRecord.remaining_days <= 0
              : this.remainingDaysFilter === 'not_expired'
                ? saleRecord.remaining_days > 0
                : true; // No filter for remaining_days if not selected

          return matchesSearch && matchesPackageType && matchesProgram && matchesPaymentStatus && matchesRemainingDays;
        });
    },


    filteredPackageTypes() {
      return this.packageTypes.filter(type =>
        !type.name.toLowerCase().includes('additional sales') &&
        !type.name.toLowerCase().includes('consignment')
      );
    },

    filteredProgramIds() {
      return this.programs.filter(type => !type.name.startsWith('Happy'));
    },

    isConsignmentOrAdditional() {
      const packageType = this.saleRecord.package_type_id?.name?.toLowerCase();
      return ["consignment", "additional sales"].includes(packageType);
    },

  },
  methods: {
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

      this.filteredSaleRecords = this.filteredSaleRecords1standRenew.slice(startIndex, endIndex);
    },

    search() {
      const filtered = this.saleRecords.filter((saleRecord) => {
        const matchesSearch = this.getCustomerName(
          saleRecord.customer_id
        ).toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id);
        const matchesProgram = this.selectedProgramIds.length === 0 || this.selectedProgramIds.includes(saleRecord.program_id);
        const matchesRemainingDays =
          this.remainingDaysFilter === 'expired'
            ? saleRecord.remaining_days <= 0
            : this.remainingDaysFilter === 'not_expired'
              ? saleRecord.remaining_days > 0
              : true;
        return matchesSearch && matchesPackageType && matchesProgram && matchesRemainingDays;
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
        } else {
          aValue = a[column];
          bValue = b[column];
        }

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
      let filteredRecords = this.saleRecords;

      if (this.selectedPackageType.length > 0) {
        filteredRecords = filteredRecords.filter(packageType =>
          this.selectedPackageType.includes(packageType.package_type_id)
        );
      }
      if (this.selectedProgramIds.length > 0) {
        filteredRecords = filteredRecords.filter(program =>
          this.selectedProgramIds.includes(program.program_id)
        );

      }
      if (this.remainingDaysFilter === 'expired') {
        filteredRecords = filteredRecords.filter(record =>
          record.remaining_days <= 0
        );
      } else if (this.remainingDaysFilter === 'not_expired') {
        filteredRecords = filteredRecords.filter(record =>
          record.remaining_days > 0
        );
      }
      this.filteredSaleRecords = filteredRecords;
      this.isFilterDropdownOpen = false;
      this.updatePage();
    },
    clearFilter() {
      this.selectedPackageType = [];
      this.selectedProgramIds = [];
      this.remainingDaysFilter = '';
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

    async fetchLookupData() {
      this.isLoading = true;

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
          axios.get(`${API_URL}/customers`),
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
          if (!packaged.start_date) {
            packaged.displayLabel = packaged.name;
            return true;
          }

          const date = new Date(packaged.start_date);
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
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSaleRecords() {
      this.isLoading = true;

      try {
        const response = await axios.get(`${API_URL}/sale-records`);
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
          if (!packaged.start_date) {
            return packaged.name;
          }

          const date = new Date(packaged.start_date);
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
      const zone = this.zoneDeliveries.find((zone) => zone.id === zoneId);
      return zone ? zone.price : 0; // ถ้าไม่พบ zone ให้คืนค่า 0
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
        //customer_id: 'รหัส',
        seller_name_id: "ผู้ขาย",
        name: "ชื่อ-สกุลลูกค้า",
        package_type: "Package Type",
        promotion_type: "Promotion Type",
        program: "Program",
        package: "แพ็กเกจที่ซื้อ ",
        package_price: "ราคาแพ็กเกจ",
        promotion_detail: "รายละเอียดโปรโมชัน",
        other_promotion_detail: "รายละเอียดโปรโมชันเพิ่มเติม(นอกเหนือจากโปรฯ รายเดือนที่ต้องได้รับอนุมัติ)",
        free_mad: "จำนวนกล่องที่แถม M or A or D",
        free_dessert: "จำนวนกล่องที่แถม Dessert",
        free_brittles: "จำนวนกล่องที่แถม Brittles",
        free_energy_balls: "จำนวนกล่องที่แถม Energy Balls",
        free_dressing: "จำนวนกล่องที่แถม Dressing",
        free_yoghurt: "จำนวนกล่องที่แถม Yoghurt",
        free_granola: "จำนวนกล่องที่แถม Granola",
        free_credit: "เครดิตที่แถม (บาท)",

        discount: "ส่วนลดเพิ่มเติมจากโปรฯ ประจำเดือน (ถ้ามี)",
        extra_charge: "Extra Charge (%)",
        extra_charge_price: "มูลค่า Extra Charge",
        total_package_price: "มูลค่าแพ็กเกจรวม",
        receive_food_id: "วิธีการรับอาหาร",

        zone1_id: "In-house Riders (ที่อยู่ 1)",
        total_zone1_price: "ค่าจัดส่งรวม (ที่อยู่ 1)",
        zone2_id: "In-house Riders (ที่อยู่ 2)",
        total_zone2_price: "ค่าจัดส่งรวม (ที่อยู่ 2)",
        zone3_id: "In-house Riders (ที่อยู่ 3)",
        total_zone3_price: "ค่าจัดส่งรวม (ที่อยู่ 3)",
        zone_outsource_id: "Outsource Riders",
        total_zone_outsource_price: "ค่าจัดส่งรวม Outsource",
        total_delivery_zone_price: "ค่าจัดส่งรวม In-house Riders",
        total_delivery_price: "รวมค่าจัดส่งทั้งหมด",

        total_price: "มูลค่าขายรวม",
        payment_status: "สถานะการชำระเงิน",
        paid_date: "วันที่ชำระเงิน",
        payment_type_id: "วิธีการชำระเงิน",
        receive_date: "วันเริ่มรับอาหารวันแรก",
        sellect_by: "เลือกอาหารโดย",
        start_date: "วันเริ่มแพ็กเกจ",
        expiry_date: "วันหมดอายุแพ็คเกจ",
        note: "Note รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า (ถ้ามี)",
        package_detail: "ข้อมูลแพ็กเกจ(สำหรับสรุปให้ลูกค้า)",
        mad: "M or A or D",
        dessert: "Dessert",
        brittles: "Brittles",
        energy_balls: "Energy Balls",
        dressing: "Dressing",
        yoghurt: "Yoghurt",
        granola: "Granola",
        credit: "Cash Credit ที่ได้รับ",

        delivery_date: "วันที่ต้องการรับอาหาร",
        select_food_id: "วิธีการเลือกอาหาร",
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


    clearNotAdditionalForm() {
      this.saleRecord.add_detail = null;
      this.saleRecord.additional_type_id = null;
      this.saleRecord.add_price = 0;
    },
    clearAdditionalForm() {
      this.saleRecord.promotion_type_id = null;
      this.saleRecord.program_id = null;
      this.saleRecord.package_id = null;
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

    async fetchOrderHistory(customerId) {
      this.loadingHistory = true;

      try {
        const response = await axios.get(`${API_URL}/orders/user/${customerId}`);
        this.orderHistory = response.data.orders;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงประวัติการสั่งรายการอาหาร:", error);
      } finally {
        this.loadingHistory = false;
      }
    },
    openHistoryModal(customerId) {
      this.selectedCustomerId = customerId; // เซ็ตค่า customer_id ที่เลือก
      this.fetchOrderHistory(customerId); // โหลดข้อมูล
      this.isHistoryModalOpen = true; // เปิด Modal
    },
    closeHistoryModal() {
      this.isHistoryModalOpen = false;
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
    this.updatePage();
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.fetchLookupData();
    this.fetchSaleRecords();
    this.updatePage();
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
