<template>
  <div>
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
          <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(allTotalSales) }}</p>
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
          <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(totalSales) }}</p>
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
          <p class="text-3xl font-bold text-custom-orange">{{ formatNumber(customers.length) }}</p>
          <p class="text-sm text-gray-600 mt-4">ลูกค้าทั้งหมด (AFF)</p>
        </div>
      </div>


    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "HomePage",
  data() {
    return {

      allDailySales: [],
      allTotalSales: 0,
      DailySales: [],
      totalSales: 0,
      startDate: '',
      endDate: '',

      customers: [],




    };
  },
  computed: {
  },
  methods: {
    async fetchAllDailySales() {
      try {
        const response = await axios.get('http://127.0.0.1:3333/sales/all-daily', {
        });

        this.allDailySales = response.data.data.allDailySales;
        // this.filteredDailySales = this.dailySales;
        this.allTotalSales = response.data.data.totalSales;
        // this.allTotalSalesBeforeVAT = response.data.data.totalSalesBeforeVAT;
        // this.totalPackageBeforeVAT = response.data.data.totalPackageBeforeVAT;
        // this.totalDeliveryBeforeVAT = response.data.data.totalDeliveryBeforeVAT;

      } catch (error) {
        console.error('Error fetching sales data in range:', error);
      }
    },
    async fetchDailySales(startDate, endDate) {
      try {
        const response = await axios.get('http://127.0.0.1:3333/sales/daily', {
          params: { startDate, endDate },
        });

        this.dailySales = response.data.data.dailySales;
        this.totalSales = response.data.data.totalSales;

      } catch (error) {
        console.error('Error fetching sales data in range:', error);
      }
    },
    async fetchLookupData() {
      try {
        const [customersRes, promotionTypesRes, programsRes, packagesRes, packageTypesRes, zoneDeliveryRes, sellerNamesRes, paymentTypeRes, AdditionalTypeRes] = await Promise.all([
          axios.get("http://127.0.0.1:3333/customers"),
          axios.get("http://127.0.0.1:3333/promotion-types"),
          axios.get("http://127.0.0.1:3333/programs"),
          axios.get("http://127.0.0.1:3333/packages"),
          axios.get("http://127.0.0.1:3333/package-types"),
          axios.get("http://127.0.0.1:3333/zone-deliveries"),
          axios.get("http://127.0.0.1:3333/seller-names"),
          axios.get("http://127.0.0.1:3333/payment-types"),
          axios.get("http://127.0.0.1:3333/additional-types"),
        ]);
        this.customers = customersRes.data;
        this.promotion_types = promotionTypesRes.data;
        this.allPrograms = programsRes.data || [];
        // this.programs = this.allPrograms;
        // if (this.saleRecord.promotion_type_id) {
        //     this.filterPrograms();
        // }
        // this.allPackages = packagesRes.data || [];
        this.packages = packagesRes.data;
        this.package_types = packageTypesRes.data;
        this.zoneDeliveries = zoneDeliveryRes.data;
        this.seller_names = sellerNamesRes.data;
        this.payment_types = paymentTypeRes.data.data;
        this.additional_types = AdditionalTypeRes.data;
        this.updatePage;
        console.log('Fetched payment types:', paymentTypeRes.data);
        console.log(this.paymentTypes);
        // console.log('Fetched seller names:', this.seller_names);

      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },

    formatDate(date) {
      if (!date) return "-";
      return new Intl.DateTimeFormat("en-UK", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(new Date(date));
    },




    formatPrice(price) {
      return '฿' + new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,  // ตั้งค่าจำนวนตำแหน่งทศนิยมขั้นต่ำ
        maximumFractionDigits: 2   // ตั้งค่าจำนวนตำแหน่งทศนิยมสูงสุด
      }).format(price);
    },

    formatNumber(number) {
      return new Intl.NumberFormat('th-TH', {
      }).format(number);
    },

  },
  created() {
    this.fetchAllDailySales();
    this.fetchDailySales();
    this.fetchLookupData();

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    this.endDate = formattedToday;
  },
  mounted() {
    this.fetchAllDailySales();
    this.fetchDailySales();
    this.fetchLookupData();


  },
  beforeUnmount() {
  },

};
</script>


<style scoped>
.dropdown-up {
  bottom: 100%;
  margin-bottom: 4px;
}
</style>
