import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

// import MainLayout from '@/layouts/MainLayout.vue';
// import SimpleLayout from '@/layouts/SimpleLayout.vue';

import Login from "@/views/users/LoginPage.vue";
import Register from "@/views/users/RegisterPage.vue";
import Profile from "@/views/users/ProfilePage.vue";
import RegisterAFF from "@/views/users/RegisterAFFPage.vue";
import RegisterHHB from "@/views/users/RegisterHHBPage.vue";

import OrderHistoryUser from "@/views/users/OrderHistoryUserPage.vue";
import OrderHistoryHHBUser from "@/views/users/OrderHistoryHHBUserPage.vue";

import OrderPackageHistoryUser from "@/views/users/OrderPackageHistoryUserPage.vue";
import OrderPackageHistoryHHBUser from "@/views/users/OrderPackageHistoryHHBUserPage.vue";

import User from "@/views/UserPage.vue";

// import ForgotPassword from '@/views/users/ForgotPasswordPage.vue';

import Home from "../views/HomePage.vue";
import HomeHHB from "../views/HomeHHBPage.vue";

import SalesRecord from "@/views/sale-records/SalesRecordPage.vue";
import SalesRecordAddit from "@/views/sale-records/SalesRecrdAdditPage.vue";

import SalesRecordHHB from "@/views/sale-records/SalesRecordHHBPage.vue";
import SalesRecordAdditHHB from "@/views/sale-records/SalesRecrdHHBAdditPage.vue";

import DailySale from "../views/daily-sales/DailySalePage.vue";
import DailySaleHHB from "../views/daily-sales/DailySaleHHBPage.vue";

import Customers from "../views/customers/CustomersPage.vue";
import Test from "../views/TestPage.vue";
// import Test2 from "../views/Test2Page.vue";
// import Test3 from "@/views/test3Page.vue";

import CustomersHHB from "@/views/customers/CustomersHHB.vue";

import PromotionTypesPage from "@/views/packages/PromotionTypesPage.vue";
import Program from "@/views/packages/ProgramsPage.vue";
import Package from "@/views/packages/PakagesPage.vue";
import PackageType from "@/views/packages/PackageTypesPage.vue";
import AdditionalTypes from "@/views/packages/AdditionalTypesPage.vue";

import Seller from "@/views/other/SellerPage.vue";
import SelectFood from "@/views/other/SelectFoodPage.vue";

import ReceiveFood from "@/views/zones/ReceiveFoodPage.vue";
import DeliveryRound from "@/views/zones/DeliveryRoundPage.vue";

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

import ResultOrder from "@/views/result-orders/ResultOrderPage.vue";
import ResultOrderHHB from "@/views/result-orders/ResultOrderHHBPage.vue";

import KitchenOrder from "@/views/kitchen-orders/KitchenOrderPage.vue";
import KitchenOrderHHB from "@/views/kitchen-orders/KitchenOrderHHBPage.vue";

import RemainingPackage from "@/views/remaining/RemainingPackagePage.vue";
import OrderHistory from "@/views/remaining/OrderHistoryPage.vue";
import OrderPackageHistory from "@/views/remaining/OrderPackageHistoryPage.vue";

import RemainingPackageHHB from "@/views/remaining/RemainingPackageHHBPage.vue";
import OrderHistoryHHB from "@/views/remaining/OrderHistoryHHBPage.vue";
import OrderPackageHistoryHHB from "@/views/remaining/OrderPackageHistoryHHBPage.vue";

import Delivery from "@/views/deliveries/DeliveryPage.vue";
import DeliveryHHB from "@/views/deliveries/DeliveryHHBPage.vue";

import PH from "@/views/orders/OrderPHPage.vue";
import HHB from "@/views/orders/OrderHHBPage.vue";
import LC from "@/views/orders/OrderLCPage.vue";
import FL from "@/views/orders/OrderFLPage.vue";

import NotFound from '@/views/NotFoundPage.vue';
const routes = [
  { path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound,
    meta: { title: "Not Found - Absolute FitFood", layout: "BlankLayout" }
  },

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
  {
    path: "/register-hhb",
    name: "register-hhb",
    component: RegisterHHB,
    meta: {
      title: "สมัครสมาชิก HHB - Absolute FitFood",
      layout: "SimpleLayout",
    },
  },
  {
    path: "/order-history-user/:customerId",
    name: "ประวัติการสั่งรายการอาหาร User",
    component: OrderHistoryUser,
    meta: { 
      title: "ประวัติการสั่งรายการอาหาร - Absolute FitFood",
      layout: "SimpleLayout",

     },
  },
  {
    path: "/order-history-hhb-user/:customerId",
    name: "ประวัติการสั่งรายการอาหาร User HHB",
    component: OrderHistoryHHBUser,
    meta: { 
      title: "ประวัติการสั่งรายการอาหาร - Absolute FitFood",
      layout: "SimpleLayout",

     },
  },

  {
    path: "/order-package-history-user/:customerId",
    name: "ประวัติการสั่งซื้อแพ็คเกจ User",
    component: OrderPackageHistoryUser,
    meta: { 
      title: "ประวัติการสั่งซื้อแพ็คเกจ - Absolute FitFood",
      layout: "SimpleLayout",
     },
  },
  {
    path: "/order-package-history-hhb-user/:customerId",
    name: "ประวัติการสั่งซื้อแพ็คเกจ HHB User",
    component: OrderPackageHistoryHHBUser,
    meta: { 
      title: "ประวัติการสั่งซื้อแพ็คเกจ - Absolute FitFood",
      layout: "SimpleLayout",
     },
  },
  

  {
    path: "/users",
    name: "ข้อมูลผู้ใช้งาน",
    component: User,
    meta: { 
      title: "ข้อมูลผู้ใช้งาน  - Absolute FitFood",
      requiresAdmin: true,
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
    meta: { 
      title: "หน้าแรก - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/master-hhb",
    name: "Home HHB",
    component: HomeHHB,
    meta: { 
      title: "หน้าแรก - Absolute FitFood",
      requiresAdmin: true,
    },
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
    meta: { 
      title: "ข้อมูลลูกค้า - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/sale-records",
    name: "บันทึกการขาย",
    component: SalesRecord,
    meta: { 
      title: "บันทึกการขาย - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/sale-records-additional",
    name: "บันทึกการขาย Additional",
    component: SalesRecordAddit,
    meta: { 
      title: "บันทึกการขาย - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/sale-records-hhb",
    name: "บันทึกการขาย HHB",
    component: SalesRecordHHB,
    meta: { 
      title: "บันทึกการขาย - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/sale-records-additional-hhb",
    name: "บันทึกการขาย Additional HHB",
    component: SalesRecordAdditHHB,
    meta: { 
      title: "บันทึกการขาย - Absolute FitFood",
      requiresAdmin: true,
     },
  },

  {
    path: "/daily-sale",
    name: "ยอดขายประจำวัน",
    component: DailySale,
    meta: { 
      title: "ยอดขายประจำวัน - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/daily-sale-hhb",
    name: "ยอดขายประจำวัน HHB",
    component: DailySaleHHB,
    meta: { 
      title: "ยอดขายประจำวัน Happy Healthy Box - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/setup-menu-ph",
    name: "Setup Menu Premium Health",
    component: SetupMenuPH,
    meta: { 
      title: "Setup Menu Premium Health - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/setup-menu-hhb",
    name: "Setup Menu Happy Healthy Box",
    component: SetupMenuHHB,
    meta: { 
      title: "Setup Menu Happy Healthy Box - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/setup-menu-lc",
    name: "Setup Menu Low Carb",
    component: SetupMenuLC,
    meta: { 
      title: "Setup Menu Low Carb - Absolute FitFood",
      requiresAdmin: true,
     },
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
    meta: { 
      title: "Setup Menu โรคความดัน - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/setup-menu-diabete",
    name: "Setup Menu โรคเบาหวาน",
    component: SetupMenuDiabete,
    meta: { 
      title: "Setup Menu โรคเบาหวาน - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/setup-menu-fat-disease",
    name: "Setup Menu โรคไขมัน",
    component: SetupMenuFatDisease,
    meta: { 
      title: "Setup Menu โรคไขมัน - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/result-orders",
    name: "รายการอาหารประจำวันของลูกค้า",
    component: ResultOrder,
    meta: { 
      title: "รายการอาหารประจำวันของลูกค้า - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/result-orders-hhb",
    name: "รายการอาหารประจำวันของลูกค้า HHB",
    component: ResultOrderHHB,
    meta: { 
      title: "รายการอาหารประจำวันของลูกค้า - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/remaining-packages",
    name: "แพ็คเกจคงเหลือของลูกค้า",
    component: RemainingPackage,
    meta: { 
      title: "แพ็คเกจคงเหลือของลูกค้า - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/order-history/:customerId",
    name: "ประวัติการสั่งรายการอาหาร",
    component: OrderHistory,
    meta: { 
      title: "ประวัติการสั่งรายการอาหาร - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/order-package-history/:customerId",
    name: "ประวัติการสั่งซื้อแพ็คเกจ",
    component: OrderPackageHistory,
    meta: { 
      title: "ประวัติการสั่งซื้อแพ็คเกจ - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/remaining-packages-hhb",
    name: "แพ็คเกจคงเหลือของลูกค้า HHB",
    component: RemainingPackageHHB,
    meta: { 
      title: "แพ็คเกจคงเหลือของลูกค้า - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/order-history-hhb/:customerId",
    name: "ประวัติการสั่งรายการอาหาร HHB",
    component: OrderHistoryHHB,
    meta: { 
      title: "ประวัติการสั่งรายการอาหาร - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/order-package-history-hhb/:customerId",
    name: "ประวัติการสั่งซื้อแพ็คเกจ HHB",
    component: OrderPackageHistoryHHB,
    meta: { 
      title: "ประวัติการสั่งซื้อแพ็คเกจ HHB - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/kitchen-orders",
    name: "Kitchen Orders",
    component: KitchenOrder,
    meta: { 
      title: "Kitchen Orders - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/kitchen-orders-hhb",
    name: "Kitchen Orders HHB",
    component: KitchenOrderHHB,
    meta: { 
      title: "Kitchen Orders - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/delivery",
    name: "การจัดส่งอาหารประจำวัน",
    component: Delivery,
    meta: { 
      title: "การจัดส่งอาหารประจำวัน - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/delivery-hhb",
    name: "การจัดส่งอาหารประจำวัน HHB",
    component: DeliveryHHB,
    meta: { 
      title: "การจัดส่งอาหารประจำวัน - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/test",
    name: "test",
    component: Test,
    meta: { 
      title: "test - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  
  // {
  //   path: "/test2",
  //   name: "test2",
  //   component: Test2,
  //   meta: {
  //     title: "test2 - Absolute FitFood",
  //     layout: "SimpleLayout", // ใช้ SimpleLayout สำหรับ test2
  //   },
  // },
  // {
  //   path: "/test3",
  //   name: "test3",
  //   component: Test3,
  //   meta: { title: "test3 - Absolute FitFood", layout: "SimpleLayout" },
  // },

  {
    path: "/promotion-types",
    name: "ข้อมูลประเภทโปรโมชั่น",
    component: PromotionTypesPage,
    meta: { 
      title: "Promotion Types - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/programs",
    name: "ข้อมูลโปรแกรม",
    component: Program,
    meta: { 
      title: "ข้อมูลโปรแกรม - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/packages",
    name: "ข้อมูลแพ็คเกจ",
    component: Package,
    meta: { 
      title: "ข้อมูลแพ็คเกจ - Absolute FitFood",
      requiresAdmin: true,
     },
  },
  {
    path: "/package-types",
    name: "ข้อมูลประเภทแพ็คเกจ",
    component: PackageType,
    meta: { 
      title: "ข้อมูลประเภทแพ็คเกจ - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/additional-types",
    name: "ข้อมูล Sales Type (Additional Sales)",
    component: AdditionalTypes,
    meta: { 
      title: "ข้อมูล Sales Type (Additional Sales) - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/sellers",
    name: "ข้อมูลผู้ขาย",
    component: Seller,
    meta: { 
      title: "ข้อมูลผู้ขาย - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/select-foods",
    name: "ข้อมูลวิธีการการเลือกอาหาร",
    component: SelectFood,
    meta: { 
      title: "ข้อมูลวิธีการการเลือกอาหาร - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/receive-foods",
    name: "ข้อมูลวิธีการรับอาหาร",
    component: ReceiveFood,
    meta: { 
      title: "ข้อมูลวิธีการรับอาหาร - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/delivery-rounds",
    name: "ข้อมูลรอบการจัดส่งอาหาร",
    component: DeliveryRound,
    meta: { 
      title: "ข้อมูลรอบการจัดส่งอาหาร - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/zone-delivery-types",
    name: "ข้อมูลประเภทโซนการจัดส่ง",
    component: ZoneDeliveryType,
    meta: { 
      title: "ข้อมูลประเภทโซนการจัดส่ง - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/zone-deliveries",
    name: "ข้อมูลโซนการจัดส่ง",
    component: ZoneDelivery,
    meta: { 
      title: "ข้อมูลโซนการจัดส่ง - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/menu-types",
    name: "ข้อมูลโปรแกรมเมนู",
    component: MenuType,
    meta: { 
      title: "ข้อมูลโปรแกรมเมนู - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/meal-types",
    name: "ข้อมูลประเภทเมนู",
    component: MealType,
    meta: { 
      title: "ข้อมูลประเภทเมนู - Absolute FitFood",
      requiresAdmin: true,
    },
  },
  {
    path: "/menus",
    name: "ข้อมูลเมนู",
    component: Menu,
    meta: { 
      title: "ข้อมูลเมนู - Absolute FitFood",
      requiresAdmin: true,
    },
  },

  {
    path: "/premium-health",
    name: "premium health",
    component: PH,
    alias: "/",
    meta: {
      title: "Premium Health - Absolute FitFood",
      layout: "SimpleLayout",
    },
  },
  {
    path: "/happy-healthy-box",
    name: "happy healthy box",
    component: HHB,
    meta: {
      title: "Happy Healthy Box - Absolute FitFood",
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

  const role = store.getters.getUserRole; // ดึงค่า userRole จาก Vuex

  console.log("Current user role:", role); // ตรวจสอบ role ที่ได้
  if (to.meta.requiresAdmin && role !== "admin") {
    return next({ name: "login" }); // เปลี่ยนไปหน้า login หรือหน้าอื่นๆ
  }

  next(); // ถ้า role เป็น admin หรือไม่ต้องการการตรวจสอบ ก็ให้ดำเนินการต่อไป
});

export default router;
