import { createRouter, createWebHistory } from 'vue-router';

// import MainLayout from '@/layouts/MainLayout.vue';
// import SimpleLayout from '@/layouts/SimpleLayout.vue';

import Login from '@/views/users/LoginPage.vue';
import Register from '@/views/users/RegisterPage.vue';
import Profile from '@/views/users/ProfilePage.vue';
import RegisterAFF from '@/views/users/RegisterAFFPage.vue';

// import ForgotPassword from '@/views/users/ForgotPasswordPage.vue';


import Home from '../views/HomePage.vue';

import SalesRecord from '../views/SalesRecordPage.vue';
import SalesRecordAddit from '../views/SalesRecrdAdditPage.vue';


import DailySale from '../views/DailySalePage.vue';
import Customers from '../views/customers/CustomersPage.vue';
import Test from '../views/TestPage.vue';
import Test2 from '../views/Test2Page.vue';
import Test3 from '@/views/test3Page.vue';

import CustomersHHB from '@/views/customers/CustomersHHB.vue';

import PromotionTypesPage from '@/views/packages/PromotionTypesPage.vue';
import Program from '@/views/packages/ProgramsPage.vue';
import Package from '@/views/packages/PakagesPage.vue';
import PackageType from '@/views/packages/PackageTypesPage.vue'

import ZoneDeliveryType from '@/views/zones/ZoneDeliveryTypePage.vue';
import ZoneDelivery from '@/views/zones/ZoneDeliveryPage.vue';

import MenuType from '@/views/menus/MenuTypesPage.vue';
import MealType from '@/views/menus/MealTypesPage.vue';
import Menu from '@/views/menus/MenusPage.vue';

import SetupMenuPH from '@/views/setupMenus/setupMenuPHPage.vue'

const routes = [

  { path: '/login',
    name: 'login',
    component: Login,
    meta: { title: 'เข้าสู่ระบบ - Absolute FitFood',
      layout: 'BlankLayout'
    }
  },
  { path: '/register',
    name: 'register',
    component: Register,
    meta: { title: 'สมัครสมาชิก - Absolute FitFood',
      layout: 'BlankLayout'
    }
  },
  { path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { title: 'Profile - Absolute FitFood',
      layout: 'SimpleLayout'
    }
  },
  { path: '/register-aff',
    name: 'register-aff',
    component: RegisterAFF,
    meta: { title: 'สมัครสมาชิก AFF - Absolute FitFood',
      layout: 'SimpleLayout'
    }
  },
  // { path: '/forgot-password',
  //   name: 'forgot-password',
  //   component: ForgotPassword,
  //   meta: { title: 'ลืมรหัสผ่าน - Absolute FitFood',
  //     layout: 'BlankLayout'
  //   }
  // },


  { path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'หน้าแรก - Absolute FitFood' }
  },
  { path: '/customers',
    name: 'ข้อมูลลูกค้า',
    component: Customers,
    meta: { title: 'ข้อมูลลูกค้า - Absolute FitFood' }
  },
  { path: '/customers-hhb',
    name: 'ข้อมูลลูกค้าHHB',
    component: CustomersHHB,
    meta: { title: 'ข้อมูลลูกค้า - Absolute FitFood' }
  },
  { path: '/sale-records',
    name: 'บันทึกการขาย',
    component: SalesRecord,
    meta: { title: 'บันทึกการขาย - Absolute FitFood' }
  },
  { path: '/sale-records-additional',
    name: 'บันทึกการขาย Additional',
    component: SalesRecordAddit,
    meta: { title: 'บันทึกการขาย - Absolute FitFood' }
  },


  { path: '/daily-sale',
    name: 'ยอดขายประจำวัน',
    component: DailySale,
    meta: { title: 'ยอดขายประจำวัน - Absolute FitFood' }
  },
  { path: '/setup-menu-ph',
    name: 'Setup Menu Premium Health',
    component: SetupMenuPH,
    meta: { title: 'Setup Menu Premium Health - Absolute FitFood' }
  },

  { path: '/test',
    name: 'test',
    component: Test,
    meta: { title: 'test - Absolute FitFood',
      layout: 'SimpleLayout'
    }
  },
  { path: '/test2',
    name: 'test2',
    component: Test2,
    meta: { 
      title: 'test2 - Absolute FitFood', 
      layout: 'SimpleLayout' // ใช้ SimpleLayout สำหรับ test2
    }
  },
  {
  path: '/test3',
  name: 'test3',
  component: Test3,
  meta: { title: 'test3 - Absolute FitFood',
    layout: 'SimpleLayout'
  }
},

  { path: '/promotion-types',
    name: 'ข้อมูลประเภทโปรโมชั่น',
    component: PromotionTypesPage,
    meta: { title: 'Promotion Types - Absolute FitFood' }
  },
  { path: '/programs',
    name: 'ข้อมูลโปรแกรม',
    component: Program,
    meta: { title: 'ข้อมูลโปรแกรม - Absolute FitFood' }
  },
  { path: '/packages',
    name: 'ข้อมูลแพ็คเกจ',
    component: Package,
    meta: { title: 'ข้อมูลแพ็คเกจ - Absolute FitFood' }
  },
  { path: '/package-types',
    name: 'ข้อมูลประเภทแพ็คเกจ',
    component: PackageType,
    meta: { title: 'ข้อมูลประเภทแพ็คเกจ - Absolute FitFood' }
  },
  { path: '/zone-delivery-types',
    name: 'ข้อมูลประเภทโซนการจัดส่ง',
    component: ZoneDeliveryType,
    meta: { title: 'ข้อมูลประเภทโซนการจัดส่ง - Absolute FitFood' }
  },
  { path: '/zone-deliveries',
    name: 'ข้อมูลโซนการจัดส่ง',
    component: ZoneDelivery,
    meta: { title: 'ข้อมูลโซนการจัดส่ง - Absolute FitFood' }
  },
  { path: '/menu-types',
    name: 'ข้อมูลโปรแกรมเมนู',
    component: MenuType,
    meta: { title: 'ข้อมูลโปรแกรมเมนู - Absolute FitFood' }
  },
  { path: '/meal-types',
    name: 'ข้อมูลประเภทเมนู',
    component: MealType,
    meta: { title: 'ข้อมูลประเภทเมนู - Absolute FitFood' }
  },
  { path: '/menus',
    name: 'ข้อมูลเมนู',
    component: Menu,
    meta: { title: 'ข้อมูลเมนู - Absolute FitFood' }
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Absolute FitFood';  
  next();
});

export default router;
