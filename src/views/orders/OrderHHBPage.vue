<template>

<div v-if="showSuccessToast"
  class="fixed top-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:transform-none sm:right-8 bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 flex items-center space-x-3 sm:space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50 max-w-[90%] w-full sm:w-auto"
    :class="{ 'opacity-100': showSuccessToast, 'opacity-0': !showSuccessToast }">
    <span class="material-symbols-outlined text-white text-lg sm:text-xl">cancel</span>
    <span class="text-sm sm:text-base">{{ toastSuccessMessage }}</span>
    <button @click="showSuccessToast = false" class="text-white hover:text-gray-200 focus:outline-none">
      <span class="material-symbols-outlined text-lg sm:text-xl">close</span>
    </button>
  </div>

  <div v-if="showFailToast"
  class="fixed top-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:transform-none sm:right-8 bg-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 flex items-center space-x-3 sm:space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50 max-w-[90%] w-full sm:w-auto"
    :class="{ 'opacity-100': showFailToast, 'opacity-0': !showFailToast }">
    <span class="material-symbols-outlined text-white text-lg sm:text-xl">cancel</span>
    <span class="text-sm sm:text-base">{{ toastFailMessage }}</span>
    <button @click="showFailToast = false" class="text-white hover:text-gray-200 focus:outline-none">
      <span class="material-symbols-outlined text-lg sm:text-xl">close</span>
    </button>
  </div>

  <div v-if="showErrorToast"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:transform-none sm:right-8 bg-yellow-500 text-white px-6 sm:px-8 py-3 sm:py-4 flex items-center space-x-3 sm:space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50 max-w-[90%] w-full sm:w-auto"
    :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
    <span class="material-symbols-outlined text-white text-lg sm:text-xl">cancel</span>
    <span class="text-sm sm:text-base">{{ toastErrorMessage }}</span>
    <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
      <span class="material-symbols-outlined text-lg sm:text-xl">close</span>
    </button>
  </div>

  <h1 class="mt-4 font-bold text-custom-orange text-lg sm:text-2xl mb-4 text-center">Happy Healthy Box</h1>

  <div class="mt-4 flex flex-col sm:flex-row">
    <!-- Filter เมนู (ซ่อนบนมือถือ) -->
    <div class="hidden sm:block sm:w-1/5">
      <div class="mb-4">
        <div class="flex items-center space-x-3 py-2">
          <button @click="changeDate(-1)" class="flex items-center">
            <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
              chevron_backward
            </span>
          </button>

          <button @click="setToday"
            class="flex items-center text-custom-orange hover:underline hover:text-custom-orange">
            <span class="mr-2 font-bold">วันนี้</span>
          </button>

          <button @click="changeDate(1)" class="flex items-center">
            <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
              chevron_forward
            </span>
          </button>

          <input type="date" id="menuDate" v-model="selectedDate" class="p-2 border rounded-md w-auto"
            @change="fetchMenusForSelectedDate" />
        </div>
      </div>

      <h1 class="font-bold text-xl mb-4">ประเภทเมนู</h1>

      <div v-if="isLoading" class="flex h-full">
        <div class="space-y-4 w-full">
          <div class="space-y-2">
            <div class="bg-gray-100 animate-pulse h-6 w-full rounded-md"></div>
            <div class="bg-gray-100 animate-pulse h-6 w-full rounded-md"></div>
            <div class="bg-gray-100 animate-pulse h-6 w-full rounded-md"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="mb-4 space-y-2">
          <button @click="selectedMealType = ''" :class="[
            'w-full text-left py-2 hover:text-custom-orange',
            selectedMealType === '' ? 'text-custom-orange font-bold' : 'text-gray-600'
          ]">
            ทุกประเภท
          </button>

          <button v-for="mealType in filteredMealTypes" :key="mealType.id" @click="selectedMealType = mealType.id"
            :class="[
              'w-full py-2 text-left hover:text-custom-orange',
              selectedMealType === mealType.id ? 'text-custom-orange font-bold' : 'text-gray-600'
            ]">
            {{ mealType.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- ส่วนเมนูอาหาร -->
    <div class="w-full sm:w-4/5 p-4">
      <!-- Input ปฏิทิน (แสดงบนมือถือ) -->
      <div class="sm:hidden mb-4">
        <div class="flex items-center space-x-3 py-2">
          <button @click="changeDate(-1)" class="flex items-center">
            <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
              chevron_backward
            </span>
          </button>

          <input type="date" id="menuDate" v-model="selectedDate" class="p-2 border rounded-md w-full"
            @change="fetchMenusForSelectedDate" />

          <button @click="changeDate(1)" class="flex items-center">
            <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
              chevron_forward
            </span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="flex h-full">
        <div class="space-y-4 w-full">
          <div class="bg-gray-100 animate-pulse h-8 w-1/3 rounded-md"></div>

          <div class="flex space-x-2">
            <div class="bg-gray-100 animate-pulse h-64 w-1/3 rounded-md"></div>
            <div class="bg-gray-100 animate-pulse h-64 w-1/3 rounded-md"></div>
            <div class="bg-gray-100 animate-pulse h-64 w-1/3 rounded-md"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <h1 class="font-bold text-base sm:text-xl mb-4">รายการอาหารประจำวันที่ {{ formatDate(selectedDate) }} ({{
          formatDateEng(selectedDate) }})</h1>

        <div v-if="todayMenus.length === 0" class="text-center text-gray-600">
          <strong class="text-base sm:text-2xl">ไม่มีเมนู</strong>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          <div v-for="menu in filteredMenus" :key="menu.id"
            class="p-4 border rounded-lg shadow-md bg-white flex flex-col h-full mb-6 text-sm sm:text-base">
            <div class="mb-4">
              <img v-if="getMenuImage(menu.menu_id)" :src="`${API_URL}/images/${getMenuImage(menu.menu_id)}`"
                alt="Menu Image" class="min-h-48 max-h-48 w-full object-cover rounded">
              <div v-else class="bg-gray-100 w-full h-48 rounded-md flex items-center justify-center">
                <span class="material-symbols-outlined text-4xl text-gray-500">
                  hide_image
                </span>
              </div>
            </div>

            <span class="text-base sm:text-lg font-semibold block">{{ getMenuEnglishName(menu.menu_id) }}</span>
            <span class="block">{{ getMenuThaiName(menu.menu_id) }}</span>
            <span class="block text-custom-orange font-bold">{{ getMealTypeName(getMealTypeID(menu.menu_id)) }}</span>

            <div class="text-gray-700 text-[10px] sm:text-sm">
              <span class="mr-2">{{ getMenuCal(menu.menu_id) }} Cal</span>
              <span class="mr-2">|<strong> Protein: </strong> {{ getMenuProtein(menu.menu_id) }} g</span>
              <span class="mr-2">|<strong> Carbohydrate: </strong>{{ getMenuCarb(menu.menu_id) }} g</span>
              <span class="mr-2">|<strong> Fat: </strong>{{ getMenuFat(menu.menu_id) }} g</span>
            </div>

            <div class="mt-auto flex w-full space-x-2">
              <div class="flex items-center justify-center w-1/2 space-x-2 p-2">
                <button @click="adjustQuantity(menu, -1)"
                  class="px-2 py-1 w-8 rounded-md text-white bg-custom-orange hover:bg-custom-orange-hover">-</button>

                <input type="number" v-model.number="menu.quantity" min="0" placeholder="จำนวน"
                  class="p-2 border rounded-md w-16 text-center input-no-spinner" />

                <button @click="adjustQuantity(menu, 1)"
                  class="px-2 py-1 w-8 rounded-md text-white bg-custom-orange hover:bg-custom-orange-hover">+</button>
              </div>

              <div class="w-1/2 p-2 flex justify-end">
                <button @click="orderMenu(menu)"
                  class="px-4 py-2 w-full bg-custom-orange text-white rounded-md hover:bg-custom-orange-hover transition flex items-center space-x-2 justify-center">
                  <span class="material-symbols-outlined">
                    shopping_cart
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showModal"
          class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            class="bg-gradient-to-r from-green-600 via-green-500 to-green-600 p-4 sm:p-6 rounded-lg w-full max-w-[90%] sm:w-1/3 text-center border">
            <h2 class="text-lg sm:text-xl font-bold text-white">
              You need to register HHB customer profile first!
            </h2>
            <p class="mt-3 sm:mt-4 text-sm sm:text-base">
              กรุณากรอกข้อมูลการลงทะเบียนข้อมูลลูกค้า HHB ของท่านให้ครบถ้วนเพื่อดำเนินการสั่งรายการอาหาร
            </p>
            <div class="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-2 space-y-2 sm:space-y-0">
              <button @click="redirectToRegister"
                class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 drop-shadow-md w-full sm:w-auto">
                Go to Registration
              </button>
              <button @click="showModal = false"
                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 drop-shadow-md w-full sm:w-auto">
                Close
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { API_URL } from "@/services/api";

export default {
  data() {
    return {
      menus: [],
      todayMenus: [],
      meal_types: [],
      selectedDate: this.getTodayDate(),  // กำหนดค่าเริ่มต้นเป็นวันที่ปัจจุบัน
      selectedMealType: "",

      toastSuccessMessage: "",
      showSuccessToast: false,
      toastFailMessage: "",
      showFailToast: false,
      showErrorToast: false,
      toastErrorMessage: "",

      isLoading: false,
      isLoggedIn: false,
      showModal: false,  // สำหรับการแสดง/ซ่อน modal
      isUserRegistered: false,
      API_URL,

    };
  },
  computed: {
    filteredMenus() {
      if (this.todayMenus.length === 0) {
        return [];  // หากไม่มีเมนูให้แสดงอาเรย์ว่าง
      }
      if (!this.selectedMealType) {
        return this.todayMenus;  // ถ้าไม่เลือกประเภทอาหาร ให้แสดงทั้งหมด
      }
      return this.todayMenus.filter(menu => this.getMealTypeID(menu.menu_id) === this.selectedMealType);
    },
    filteredMealTypes() {
      const mealTypeIds = new Set(this.todayMenus.map(menu => this.getMealTypeID(menu.menu_id)));
      return this.meal_types.filter(mealType => mealTypeIds.has(mealType.id));
    }
  },
  methods: {
    handleImageError(event) {
      console.error("Image load error", event);
    },

    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    changeDate(direction) {
      const currentDate = new Date(this.selectedDate);
      currentDate.setDate(currentDate.getDate() + direction);
      this.selectedDate = currentDate.toISOString().split('T')[0]; // convert to YYYY-MM-DD format
      this.fetchMenusForSelectedDate(); // fetch menus for the new date
    },
    setToday() {
      this.selectedDate = this.getTodayDate();
      this.fetchMenusForSelectedDate();
    },
    async fetchMenusForSelectedDate() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${API_URL}/setup-menu-hhb/menus-by-day/${this.selectedDate}`);
        if (response.data.menus && response.data.menus.length > 0) {
          this.todayMenus = response.data.menus;
          this.todayMenus.forEach(menu => {
            menu.quantity = 0;
          });
        } else {
          this.todayMenus = [];
        }
      } catch (error) {
        this.todayMenus = []; // กรณีเกิดข้อผิดพลาด ให้แสดงค่าว่าง
      }
      finally {
        this.isLoading = false; // หมดการโหลด
      }
    },
    async fetchLookupData() {
      this.isLoading = true;
      try {
        const [menuRes, mealTypeRes] = await Promise.all([
          axios.get(`${API_URL}/menus`),
          axios.get(`${API_URL}/meal-types`),
        ]);
        this.menus = menuRes.data;
        this.meal_types = mealTypeRes.data;
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
      finally {
        this.isLoading = false; // หมดการโหลด
      }
    },

    getMenuEnglishName(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.name_english : null;
    },
    getMenuThaiName(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.name_thai : null;
    },
    getMealTypeID(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.meal_type_id : null;
    },
    getMealTypeName(menuId) {
      const menu = this.meal_types.find((m) => m.id === menuId);
      return menu ? menu.name : 'null';
    },
    getMenuCal(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.cal : null;
    },
    getMenuProtein(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.protein : null;
    },
    getMenuFat(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.fat : null;
    },
    getMenuCarb(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.carb : null;
    },
    getMenuImage(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.image : null;
    },


    formatDate(date) {
      const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];

      const d = new Date(date);
      const day = d.getDate(); // วัน
      const month = months[d.getMonth()]; // เดือน
      const year = d.getFullYear(); // ปี

      return `${day} ${month} ${year}`; // ตัวอย่าง: 10 กุมภาพันธ์ 2025
    },
    formatDateEng(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date(date).toLocaleDateString('en-US', options);
      return formattedDate;
    },

    checkUserRegistration() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        axios.get(`${API_URL}/check-user-registration-hhb`)
          .then(response => {
            this.isUserRegistered = response.data.isRegistered;
          })
          .catch(error => {
            console.error('Error checking user registration:', error);
          });
      } else {
        this.isLoggedIn = false;
      }
    },

    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },

    orderMenu(menu) {
      if (this.isLoggedIn) {
        this.checkUserRegistration();

        if (!this.isUserRegistered) {
          this.showModal = true;
          return;
        }
        if (menu.quantity && menu.quantity > 0) {
          const mealTypeId = menu.meal_type_id;

          this.isLoading = true;

          axios.post(`${API_URL}/order-hhb`, {
            menu_id: menu.menu_id,
            quantity: menu.quantity,
            order_date: this.selectedDate,
            meal_type_id: mealTypeId,
          })
            .then(() => {
              this.showSuccessToastNotification("Order successful! (สั่งรายการอาหารสำเร็จ!)");
              menu.quantity = 0;
            })
            .catch(() => {
              this.showErrorToastNotification("Please login before placing an order!! (กรุณาเข้าสู่ระบบก่อนสั่ง!!)");
            })
            .finally(() => {
              this.isLoading = false;
            });
        } else {
          this.showErrorToastNotification("Please specify the quantity! (กรุณระบุจำนวน!)");
        }
      } else {
        this.showErrorToastNotification("Please login first! (กรุณาเข้าสู่ระบบก่อน!)");
      }
    },

    adjustQuantity(menu, amount) {
      const newQuantity = menu.quantity + amount;
      if (newQuantity >= 0) {
        menu.quantity = newQuantity;
      }
    },

    redirectToRegister() {
    this.showModal = false;
    this.$router.push('/register-hhb');  // ไปที่หน้าลงทะเบียน
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
    this.fetchLookupData();
    this.checkLoginStatus();
    this.checkUserRegistration();
    this.fetchMenusForSelectedDate();
  },
  mounted() {
    this.fetchLookupData();
    this.checkLoginStatus();
    this.checkUserRegistration();
    this.fetchMenusForSelectedDate();
  },
  watch: {
    selectedDate() {
      this.fetchMenusForSelectedDate();
    }
  },
};
</script>

<style scoped>
.input-no-spinner::-webkit-outer-spin-button,
.input-no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.spinner-border {
  border-top-color: #FFB539;
  /* เปลี่ยนสีของเส้นด้านบน */
}
</style>
