import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

// import MainLayout from '@/layouts/MainLayout.vue';
// import SimpleLayout from '@/layouts/SimpleLayout.vue';

import Login from "@/views/users/LoginPage.vue";
import Register from "@/views/users/RegisterPage.vue";
import Profile from "@/views/users/ProfilePage.vue";
import RegisterAFF from "@/views/users/RegisterAFFPage.vue";

// import ForgotPassword from '@/views/users/ForgotPasswordPage.vue';

import Home from "../views/HomePage.vue";

import SalesRecord from "../views/SalesRecordPage.vue";
import SalesRecordAddit from "../views/SalesRecrdAdditPage.vue";

import DailySale from "../views/DailySalePage.vue";
import Customers from "../views/customers/CustomersPage.vue";
import Test from "../views/TestPage.vue";
import Test2 from "../views/Test2Page.vue";
import Test3 from "@/views/test3Page.vue";

import CustomersHHB from "@/views/customers/CustomersHHB.vue";

import PromotionTypesPage from "@/views/packages/PromotionTypesPage.vue";
import Program from "@/views/packages/ProgramsPage.vue";
import Package from "@/views/packages/PakagesPage.vue";
import PackageType from "@/views/packages/PackageTypesPage.vue";

import ZoneDeliveryType from "@/views/zones/ZoneDeliveryTypePage.vue";
import ZoneDelivery from "@/views/zones/ZoneDeliveryPage.vue";

import MenuType from "@/views/menus/MenuTypesPage.vue";
import MealType from "@/views/menus/MealTypesPage.vue";
import Menu from "@/views/menus/MenusPage.vue";

import SetupMenuPH from "@/views/setupMenus/setupMenuPHPage.vue";
import SetupMenuHHB from "@/views/setupMenus/setupMenuHHBPage.vue";
import SetupMenuLC from "@/views/setupMenus/setupMenuLCPage.vue";
import SetupMenuFL from "@/views/setupMenus/setupMenuFLPage.vue";
import SetupMenuBPD from "@/views/setupMenus/setupMenuBPDPage.vue";
import SetupMenuFatDisease from "@/views/setupMenus/setupMenuFatDiseasePage.vue";
import SetupMenuDiabete from "@/views/setupMenus/setupMenuDiabetePage.vue";

import ResultOrder from "@/views/ResultOrderPage.vue";
import KitchenOrder from "@/views/KitchenOrderPage.vue";

import PH from "@/views/orders/OrderPHPage.vue";
import HHB from "@/views/orders/OrderHHBPage.vue";
import LC from "@/views/orders/OrderLCPage.vue";
import FL from "@/views/orders/OrderFLPage.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { title: "เข้าสู่ระบบ - Absolute FitFood", layout: "BlankLayout" },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { title: "สมัครสมาชิก - Absolute FitFood", layout: "BlankLayout" },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { title: "Profile - Absolute FitFood", layout: "SimpleLayout" },
  },
  {
    path: "/register-aff",
    name: "register-aff",
    component: RegisterAFF,
    meta: {
      title: "สมัครสมาชิก AFF - Absolute FitFood",
      layout: "SimpleLayout",
    },
  },
  // { path: '/forgot-password',
  //   name: 'forgot-password',
  //   component: ForgotPassword,
  //   meta: { title: 'ลืมรหัสผ่าน - Absolute FitFood',
  //     layout: 'BlankLayout'
  //   }
  // },

  {
    path: "/master",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือยัง
      if (!localStorage.getItem("token")) {
        // ถ้ายังไม่ได้ล็อกอิน ให้เปลี่ยนเส้นทางไปหน้า login
        next("/login");
      } else {
        // ถ้าล็อกอินแล้วให้ไปที่หน้า order
        next();
      }
    },
    meta: { title: "หน้าแรก - Absolute FitFood" },
  },
  {
    path: "/customers",
    name: "ข้อมูลลูกค้า",
    component: Customers,
    meta: {
      title: "ข้อมูลลูกค้า - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/customers-hhb",
    name: "ข้อมูลลูกค้าHHB",
    component: CustomersHHB,
    meta: { title: "ข้อมูลลูกค้า - Absolute FitFood" },
  },
  {
    path: "/sale-records",
    name: "บันทึกการขาย",
    component: SalesRecord,
    meta: { title: "บันทึกการขาย - Absolute FitFood" },
  },
  {
    path: "/sale-records-additional",
    name: "บันทึกการขาย Additional",
    component: SalesRecordAddit,
    meta: { title: "บันทึกการขาย - Absolute FitFood" },
  },

  {
    path: "/daily-sale",
    name: "ยอดขายประจำวัน",
    component: DailySale,
    meta: { title: "ยอดขายประจำวัน - Absolute FitFood" },
  },

  {
    path: "/setup-menu-ph",
    name: "Setup Menu Premium Health",
    component: SetupMenuPH,
    meta: { title: "Setup Menu Premium Health - Absolute FitFood" },
  },
  {
    path: "/setup-menu-hhb",
    name: "Setup Menu Happy Healthy Box",
    component: SetupMenuHHB,
    meta: { title: "Setup Menu Happy Healthy Box - Absolute FitFood" },
  },
  {
    path: "/setup-menu-lc",
    name: "Setup Menu Low Carb",
    component: SetupMenuLC,
    meta: { title: "Setup Menu Low Carb - Absolute FitFood" },
  },
  {
    path: "/setup-menu-fl",
    name: "Setup Menu Fat Loss",
    component: SetupMenuFL,
    meta: {
      title: "Setup Menu Fat Loss - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/setup-menu-bpd",
    name: "Setup Menu โรคความดัน",
    component: SetupMenuBPD,
    meta: { title: "Setup Menu โรคความดัน - Absolute FitFood" },
  },
  {
    path: "/setup-menu-diabete",
    name: "Setup Menu โรคเบาหวาน",
    component: SetupMenuDiabete,
    meta: { title: "Setup Menu โรคเบาหวาน - Absolute FitFood" },
  },
  {
    path: "/setup-menu-fat-disease",
    name: "Setup Menu โรคไขมัน",
    component: SetupMenuFatDisease,
    meta: { title: "Setup Menu โรคไขมัน - Absolute FitFood" },
  },

  {
    path: "/result-orders",
    name: "รายการอาหารประจำวันของลูกค้า",
    component: ResultOrder,
    meta: { title: "รายการอาหารประจำวันของลูกค้า - Absolute FitFood" },
  },

  {
    path: "/kitchen-orders",
    name: "Kitchen Orders",
    component: KitchenOrder,
    meta: { title: "Kitchen Orders - Absolute FitFood" },
  },

  {
    path: "/test",
    name: "test",
    component: Test,
    meta: { title: "test - Absolute FitFood" },
  },
  {
    path: "/test2",
    name: "test2",
    component: Test2,
    meta: {
      title: "test2 - Absolute FitFood",
      layout: "SimpleLayout", // ใช้ SimpleLayout สำหรับ test2
    },
  },
  {
    path: "/test3",
    name: "test3",
    component: Test3,
    meta: { title: "test3 - Absolute FitFood", layout: "SimpleLayout" },
  },

  {
    path: "/promotion-types",
    name: "ข้อมูลประเภทโปรโมชั่น",
    component: PromotionTypesPage,
    meta: { title: "Promotion Types - Absolute FitFood" },
  },
  {
    path: "/programs",
    name: "ข้อมูลโปรแกรม",
    component: Program,
    meta: { title: "ข้อมูลโปรแกรม - Absolute FitFood" },
  },
  {
    path: "/packages",
    name: "ข้อมูลแพ็คเกจ",
    component: Package,
    meta: { title: "ข้อมูลแพ็คเกจ - Absolute FitFood" },
  },
  {
    path: "/package-types",
    name: "ข้อมูลประเภทแพ็คเกจ",
    component: PackageType,
    meta: { title: "ข้อมูลประเภทแพ็คเกจ - Absolute FitFood" },
  },
  {
    path: "/zone-delivery-types",
    name: "ข้อมูลประเภทโซนการจัดส่ง",
    component: ZoneDeliveryType,
    meta: { title: "ข้อมูลประเภทโซนการจัดส่ง - Absolute FitFood" },
  },
  {
    path: "/zone-deliveries",
    name: "ข้อมูลโซนการจัดส่ง",
    component: ZoneDelivery,
    meta: { title: "ข้อมูลโซนการจัดส่ง - Absolute FitFood" },
  },
  {
    path: "/menu-types",
    name: "ข้อมูลโปรแกรมเมนู",
    component: MenuType,
    meta: { title: "ข้อมูลโปรแกรมเมนู - Absolute FitFood" },
  },
  {
    path: "/meal-types",
    name: "ข้อมูลประเภทเมนู",
    component: MealType,
    meta: { title: "ข้อมูลประเภทเมนู - Absolute FitFood" },
  },
  {
    path: "/menus",
    name: "ข้อมูลเมนู",
    component: Menu,
    meta: { title: "ข้อมูลเมนู - Absolute FitFood" },
  },

  {
    path: "/premium-health",
    name: "premium health",
    component: PH,
    alias: "/",
    meta: {
      title: "premium health - Absolute FitFood",
      layout: "SimpleLayout",
    },
  },
  {
    path: "/happy-healthy-box",
    name: "happy healthy box",
    component: HHB,
    meta: {
      title: "happy healthy box - Absolute FitFood",
      layout: "SimpleLayout",
    },
  },
  {
    path: "/low-carb",
    name: "low carb",
    component: LC,
    meta: {
      title: "Low Carb - Absolute FitFood",
      layout: "SimpleLayout",
    },
  },
  {
    path: "/fat-loss",
    name: "fat loss",
    component: FL,
    meta: {
      title: "Fat Loss - Absolute FitFood",
      layout: "SimpleLayout",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  const role = store.getters.getUserRole;  // ดึงค่า userRole จาก Vuex

  console.log("Current user role:", role);  // ตรวจสอบ role ที่ได้

  // ถ้า route มี meta.requiresAdmin และ userRole ไม่ใช่ admin
  if (to.meta.requiresAdmin && role !== "admin") {
    return next({ name: "login" });  // เปลี่ยนไปหน้า login หรือหน้าอื่นๆ
  }

  next();  // ถ้า role เป็น admin หรือไม่ต้องการการตรวจสอบ ก็ให้ดำเนินการต่อไป
});


export default router;
