<template>
  <div class="mt-4 flex">
    <div class="w-1/4 p-4">
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

      <h1 class="font-bold text-xl mb-4">ฟิลเตอร์เมนู</h1>

      <div class="mb-4 space-y-2">
        <button @click="selectedMealType = ''" :class="[
          'w-full text-left py-2 hover:text-custom-orange',
          selectedMealType === '' ? 'text-custom-orange font-bold' : 'text-gray-600'
        ]">
          ทุกประเภท
        </button>

        <button v-for="mealType in filteredMealTypes" :key="mealType.id" @click="selectedMealType = mealType.id" :class="[
          'w-full py-2 text-left hover:text-custom-orange',
          selectedMealType === mealType.id ? 'text-custom-orange font-bold' : 'text-gray-600'
        ]">
          {{ mealType.name }}
        </button>
      </div>
    </div>

    <!-- เมนูส่วนขวา -->
    <div class="w-3/4 p-4">
      <h1 class="font-bold text-xl mb-4">รายการอาหารประจำวันที่ {{ formatDate(selectedDate) }} ({{
        formatDateEng(selectedDate) }})</h1>

      <div v-if="todayMenus.length === 0" class="text-center text-gray-600">
        <p>ไม่มีเมนูในวันนี้</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <div v-for="menu in filteredMenus" :key="menu.id"
          class="p-4 border rounded-lg shadow-md bg-white flex flex-col h-full mb-6">
          <!-- รูปภาพและข้อมูลเมนู -->
          <div class="mb-4">
            <div class="bg-black w-full h-48 object-cover rounded-md" />
          </div>

          <span class="text-lg font-semibold block">{{ getMenuEnglishName(menu.menu_id) }}</span>
          <span class="block">{{ getMenuThaiName(menu.menu_id) }}</span>
          <span class="block text-custom-orange font-bold">{{ getMealTypeName(getMealTypeID(menu.menu_id)) }}</span>

          <div class="text-gray-700 text-sm">
            <span class="mr-2">{{ getMenuCal(menu.menu_id) }} Cal</span>
            <span class="mr-2">|<strong> Protein: </strong> {{ getMenuProtein(menu.menu_id) }} g</span>
            <span class="mr-2">|<strong> Carbohydrate: </strong>{{ getMenuCarb(menu.menu_id) }} g</span>
            <span class="mr-2">|<strong> Fat: </strong>{{ getMenuFat(menu.menu_id) }} g</span>
          </div>

          <!-- ปุ่มเพิ่ม/ลดจำนวน และปุ่มสั่งซื้อ (บังคับอยู่ล่างสุด) -->
          <div class="mt-auto flex w-full space-x-2">
            <!-- ส่วนปรับจำนวน (ครึ่งหนึ่งของพื้นที่) -->
            <div class="flex items-center justify-center w-1/2 space-x-2 p-2">
              <!-- ปุ่มลดจำนวน -->
              <button @click="adjustQuantity(menu, -1)"
                class="px-2 py-1 w-8 rounded-md text-white bg-custom-orange hover:bg-custom-orange-hover">-</button>

              <!-- ช่องใส่จำนวน -->
              <input type="number" v-model.number="menu.quantity" min="0" placeholder="จำนวน"
                class="p-2 border rounded-md w-16 text-center input-no-spinner" />

              <!-- ปุ่มเพิ่มจำนวน -->
              <button @click="adjustQuantity(menu, 1)"
                class="px-2 py-1 w-8 rounded-md text-white bg-custom-orange hover:bg-custom-orange-hover">+</button>
            </div>

            <!-- ปุ่มสั่งซื้อ (ครึ่งหนึ่งของพื้นที่) -->
            <div class="w-1/2 p-2 flex justify-end">
              <button @click="orderMenu(menu)"
                class="px-4 py-2 w-full bg-custom-orange text-white rounded-md hover:bg-custom-orange-hover transition flex items-center space-x-2 justify-center">
                <span class="material-symbols-outlined">
                  shopping_cart
                </span>
                <span>สั่งซื้อ</span>
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

export default {
  data() {
    return {
      menus: [],
      todayMenus: [],
      meal_types: [],
      selectedDate: this.getTodayDate(),  // กำหนดค่าเริ่มต้นเป็นวันที่ปัจจุบัน
      selectedMealType: "",
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
      try {
        const response = await axios.get(`http://127.0.0.1:3333/setup-menu-ph/menus-by-day/${this.selectedDate}`);
        console.log('API Response:', response.data);

        // ตรวจสอบว่า menus มีข้อมูลหรือไม่
        if (response.data.menus && response.data.menus.length > 0) {
          this.todayMenus = response.data.menus;
          // ตั้งค่าเริ่มต้นของ quantity เป็น 0
          this.todayMenus.forEach(menu => {
            menu.quantity = 0;
          });
          console.log("Date", this.selectedDate);
        } else {
          // ถ้าไม่มีเมนูให้แสดงค่าว่างเปล่า
          this.todayMenus = [];
        }
      } catch (error) {
        this.todayMenus = []; // กรณีเกิดข้อผิดพลาด ให้แสดงค่าว่าง
      }
    },
    async fetchLookupData() {
      try {
        const [menuRes, mealTypeRes] = await Promise.all([
          axios.get("http://127.0.0.1:3333/menus"),
          axios.get("http://127.0.0.1:3333/meal-types"),
        ]);
        this.menus = menuRes.data;
        this.meal_types = mealTypeRes.data;
      } catch (error) {
        console.error("Error fetching lookup data:", error);
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

    orderMenu(menu) {
      if (menu.quantity && menu.quantity > 0) {
        // เรียก API เพื่อสร้างคำสั่งซื้อ
        axios.post('http://127.0.0.1:3333/order-ph', {
          menu_id: menu.menu_id,
          quantity: menu.quantity,
          order_date: this.selectedDate,  // ส่งวันที่ที่เลือกไปด้วย
        })
          .then((response) => {
            console.log('Order Success:', response.data);
            alert(`สั่งซื้อ ${menu.quantity} ชิ้น ${this.getMenuEnglishName(menu.menu_id)} สำหรับวันที่ ${this.selectedDate} เรียบร้อยแล้ว`);
            menu.quantity = 0;  // รีเซ็ตจำนวนหลังจากสั่งซื้อ
          })
          .catch((error) => {
            console.error('Order Error:', error);
            alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
          });
      } else {
        alert('กรุณาระบุจำนวนที่ต้องการ');
      }
    },
    adjustQuantity(menu, amount) {
      const newQuantity = menu.quantity + amount;
      if (newQuantity >= 0) {
        menu.quantity = newQuantity;
      }
    }
  },
  created() {
    this.fetchLookupData();
    this.fetchMenusForSelectedDate();
  },
  mounted() {
    this.fetchLookupData();
    this.fetchMenusForSelectedDate();
  },
  watch: {
    selectedDate() {
      // เมื่อเปลี่ยนวันที่ให้ดึงข้อมูลใหม่
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
</style>
