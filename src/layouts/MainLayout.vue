<template>
    <div class="flex h-screen">
        <!-- Side Navigation -->
        <aside :style="{ width: isExpanded ? '300px' : '64px' }"
            class="bg-custom-orange text-white flex flex-col transition-all duration-300">
            <!-- Toggle Button for expanding/collapsing the sidebar -->
            <div class="p-4 flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <img v-if="isExpanded" src="@/assets/fitfood_logo.png" alt="Logo"
                        class="w-10 h-10 rounded-full shadow-md" />
                    <h2 v-if="isExpanded" class="text-black text-[16px] font-bold">ABSOLUTE</h2>
                    <h2 v-if="isExpanded" class="text-[16px] font-bold">FITFOOD</h2>
                </div>
                <button @click="toggleSidebar" class="text-white focus:outline-none">
                    <span v-if="isExpanded" class="material-symbols-outlined text-3xl">menu_open</span>
                    <span v-else class="material-symbols-outlined text-3xl">menu</span>
                </button>
            </div>

            <!-- Navigation Menu -->
            <nav class="flex-1 font-bold">
                <ul>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/master" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">home</span>
                            <span v-if="isExpanded">หน้าแรก</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/customers" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">groups</span>
                            <span v-if="isExpanded">ข้อมูลลูกค้า</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/sale-records" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">contact_page</span>
                            <span v-if="isExpanded">บันทึกการขาย</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/daily-sale" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">calendar_month</span>
                            <span v-if="isExpanded">ยอดขายประจำวัน</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/setup-menu-ph" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">menu_book</span>
                            <span v-if="isExpanded">Setup Menus</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/result-orders" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">receipt_long</span>
                            <span v-if="isExpanded" class="text-sm">รายการอาหารประจำวันของลูกค้า</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/kitchen-orders" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">stockpot</span>
                            <span v-if="isExpanded">Kitchen Orders</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/delivery" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">delivery_truck_speed</span>
                            <span v-if="isExpanded">การจัดส่งอาหารประจำวัน</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/remaining-packages" class=" py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">deployed_code_history</span>
                            <span v-if="isExpanded">แพ็คเกจคงเหลือของลูกค้า</span>
                        </router-link>
                    </li>

                    <li v-if="isExpanded" class="relative">
                        <button @click="toggleSubMenu" class=" py-2 px-4 flex items-center space-x-2 w-full text-left">
                            <span class="material-symbols-outlined">folder</span>
                            <span>ข้อมูลทั้งหมด</span>
                            <span class="material-symbols-outlined text-3xl">expand_more</span>
                        </button>
                        <ul v-show="isSubMenuOpen" class="space-y-2 px-4 font-normal">
                            <li class="hover:bg-custom-orange-hover">
                                <router-link to="/packages" class=" py-2 px-4 flex items-center space-x-2">
                                    <span v-if="isExpanded">ข้อมูลแพ็คเกจ</span>
                                </router-link>
                            </li>
                            <li class="hover:bg-custom-orange-hover">
                                <router-link to="/zone-deliveries" class=" py-2 px-4 flex items-center space-x-2">
                                    <span v-if="isExpanded">ข้อมูลโซนการจัดส่ง</span>
                                </router-link>
                            </li>
                            <li class="hover:bg-custom-orange-hover">
                                <router-link to="/menus" class=" py-2 px-4 flex items-center space-x-2">
                                    <span v-if="isExpanded">ข้อมูลเมนู</span>
                                </router-link>
                            </li>
                            <li class="hover:bg-custom-orange-hover">
                                <router-link to="/users" class=" py-2 px-4 flex items-center space-x-2">
                                    <span v-if="isExpanded">ข้อมูลผู้ใช้งาน</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>

            <div v-if="isLoggedIn" class="flex items-center justify-between p-4 relative mt-auto">
                <!-- Profile Picture and Username -->
                <div class="flex items-center space-x-2">
                    <div class="relative w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 cursor-pointer"
                    @click="goToProfile">
                        <img v-if="userProfileImage" :src="userProfileImage" alt="User Profile" 
                            class="w-full h-full rounded-full object-cover border-2 border-white">
                        <span v-else class="uppercase">{{ username.charAt(0) }}</span>
                    </div>

                    <!-- Username and Profile Info when sidebar is expanded -->
                    <div v-if="isExpanded" class="flex flex-col items-start">
                        <strong class="text-white ml-2 cursor-default">{{ username }}</strong>
                        <p class="text-white text-sm ml-2 hover:underline cursor-pointer" @click="goToProfile">View Profile</p>
                    </div>
                </div>

                <!-- Logout Button (aligned to the right, like the menu button) -->
                <div class="flex items-center justify-center">
                    <div class="px-4 py-3 cursor-pointer hover:text-red-500 flex items-center" @click="logout">
                        <span class="material-symbols-outlined text-2xl">
                            logout
                        </span>
                    </div>
                </div>
            </div>





        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-4 bg-gray-100 relative">
            <header
                class="bg-white p-4 shadow-md fixed top-0 left-0 right-0 z-10 flex justify-between items-center flex-shrink-0">
                <div class="flex items-center space-x-3">
                    <span class="material-symbols-outlined text-gray-600 text-3xl">{{ pageIcon }}</span>
                    <h1 class="text-xl text-gray-600 font-bold">{{ pageTitle }}</h1>
                </div>
            </header>

            <div v-if="$route.path === '/master' || $route.path === '/master-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="master" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/master' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/master-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/master-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <div v-if="$route.path === '/customers' || $route.path === '/customers-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="customers" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/customers' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/customers-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/customers-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <div v-if="$route.path === '/sale-records' || $route.path === '/sale-records-hhb' || $route.path === '/sale-records-additional' || $route.path === '/sale-records-additional-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="sale-records" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/sale-records' || $route.path === '/sale-records-additional' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/sale-records-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/sale-records-hhb' || $route.path === '/sale-records-additional-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <div v-if="$route.path === '/packages' || $route.path === '/programs' || $route.path === '/promotion-types' || $route.path === '/package-types' || $route.path === '/additional-types'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="packages" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/packages' }">
                    ข้อมูล Package
                </router-link>
                <router-link to="/programs" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/programs' }">
                    ข้อมูล Program
                </router-link>
                <router-link to="/promotion-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/promotion-types' }">
                    ข้อมูล Promotion Types
                </router-link>
                <router-link to="/package-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/package-types' }">
                    ข้อมูล Package Types
                </router-link>
                <router-link to="/additional-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/additional-types' }">
                    ข้อมูล Sales Type (Additional Sales)
                </router-link>
            </div>

            <div v-if="$route.path === '/zone-deliveries' || $route.path === '/zone-delivery-types'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="/zone-deliveries" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/zone-deliveries' }">
                    ข้อมูลโซนการจัดส่ง
                </router-link>
                <router-link to="/zone-delivery-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/zone-delivery-types' }">
                    ข้อมูลประเภทโซนการจัดส่ง
                </router-link>
            </div>

            <div v-if="$route.path === '/menus' || $route.path === '/meal-types' || $route.path === '/menu-types'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="menus" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/menus' }">
                    ข้อมูลเมนู
                </router-link>
                <router-link to="/meal-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/meal-types' }">
                    ข้อมูลประเภทเมนู
                </router-link>
                <router-link to="/menu-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/menu-types' }">
                    ข้อมูลประเภทโปรแกรมเมนู
                </router-link>
            </div>

            <div v-if="$route.path === '/setup-menu-ph' || $route.path === '/setup-menu-hhb' || $route.path === '/setup-menu-lc' || $route.path === '/setup-menu-fl' || $route.path === '/setup-menu-bpd' || $route.path === '/setup-menu-diabete' || $route.path === '/setup-menu-fat-disease'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="/setup-menu-ph" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/setup-menu-ph' }">
                    Premeium Health
                </router-link>
                <router-link to="/setup-menu-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/setup-menu-hhb' }">
                    Happy Healthy Box
                </router-link>
                <router-link to="/setup-menu-lc" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/setup-menu-lc' }">
                    Low Carb
                </router-link>
                <router-link to="/setup-menu-fl" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/setup-menu-fl' }">
                    Fat Loss
                </router-link>
                <router-link to="/setup-menu-bpd" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/setup-menu-bpd' }">
                    โรคความดัน
                </router-link>
                <router-link to="/setup-menu-diabete" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/setup-menu-diabete' }">
                    โรคเบาหวาน
                </router-link>
                <router-link to="/setup-menu-fat-disease" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/setup-menu-fat-disease' }">
                    โรคไขมัน
                </router-link>
            </div>

            <div v-if="$route.path === '/daily-sale' || $route.path === '/daily-sale-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="daily-sale" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/daily-sale' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/daily-sale-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/daily-sale-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <div v-if="$route.path === '/result-orders' || $route.path === '/result-orders-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="result-orders" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/result-orders' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/result-orders-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/result-orders-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <div v-if="$route.path === '/kitchen-orders' || $route.path === '/kitchen-orders-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="kitchen-orders" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/kitchen-orders' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/kitchen-orders-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/kitchen-orders-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <div v-if="$route.path === '/delivery' || $route.path === '/delivery-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="delivery" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/delivery' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/delivery-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/delivery-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <div v-if="$route.path === '/remaining-packages' || $route.path === '/remaining-packages-hhb'"
                class="mt-4 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="remaining-packages" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/remaining-packages' }">
                    Absolute FitFood
                </router-link>
                <router-link to="/remaining-packages-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/remaining-packages-hhb' }">
                    Happy Healthy Box
                </router-link>
            </div>

            <!-- Content of the page -->
            <div class="mt-4">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script>
import api from '@/services/auth';

export default {
    name: "MainLayout",
    data() {
        return {
            isExpanded: false, // เริ่มต้นให้ sidebar แสดงแบบเต็ม
            pageTitle: "", // ชื่อของหน้าปัจจุบัน
            pageIcon: "",
            isSubMenuOpen: false, // สถานะของเมนูย่อย
            isLoggedIn: false,
            username: '',
            userProfileImage: '',
            isDropdownOpen: false,
        };
    },
    methods: {
        toggleSidebar() {
            this.isExpanded = !this.isExpanded; // เปลี่ยนสถานะการแสดง
        },
        toggleSubMenu() {
            this.isSubMenuOpen = !this.isSubMenuOpen; // เปลี่ยนสถานะของเมนูย่อย
        },
        setPageIcon(pageName) {
            switch (pageName) {
                case "Home":
                    this.pageIcon = "home";
                    break;
                case "Home HHB":
                    this.pageIcon = "home";
                    this.pageTitle = "Home";
                    break;
                case "ข้อมูลลูกค้า":
                    this.pageIcon = "groups";
                    break;
                case "ข้อมูลลูกค้าHHB":
                    this.pageIcon = "groups";
                    this.pageTitle = "ข้อมูลลูกค้า";
                    break;

                case "บันทึกการขาย":
                    this.pageIcon = "contact_page";
                    break;
                case "บันทึกการขาย Additional":
                    this.pageIcon = "contact_page";
                    this.pageTitle = "บันทึกการขาย";
                    break;
                case "บันทึกการขาย HHB":
                    this.pageIcon = "contact_page";
                    this.pageTitle = "บันทึกการขาย";
                    break;
                case "บันทึกการขาย Additional HHB":
                    this.pageIcon = "contact_page";
                    this.pageTitle = "บันทึกการขาย";
                    break;

                case "ยอดขายประจำวัน":
                    this.pageIcon = "calendar_month";
                    break;
                case "ยอดขายประจำวัน HHB":
                    this.pageIcon = "calendar_month";
                    this.pageTitle = "ยอดขายประจำวัน";
                    break;

                case "Setup Menu Premium Health":
                case "Setup Menu Happy Healthy Box":
                case "Setup Menu Low Carb":
                case "Setup Menu Fat Loss":
                case "Setup Menu โรคความดัน":
                case "Setup Menu โรคเบาหวาน":
                case "Setup Menu โรคไขมัน":
                    this.pageIcon = "menu_book";
                    break;

                case "รายการอาหารประจำวันของลูกค้า":
                    this.pageIcon = "receipt_long";
                    break;
                case "รายการอาหารประจำวันของลูกค้า HHB":
                    this.pageIcon = "receipt_long";
                    this.pageTitle = "รายการอาหารประจำวันของลูกค้า";
                    break;

                case "Kitchen Orders":
                    this.pageIcon = "stockpot";
                    break;
                case "Kitchen Orders HHB":
                    this.pageIcon = "stockpot";
                    this.pageTitle = "Kitchen Orders";

                    break;

                case "การจัดส่งอาหารประจำวัน":
                    this.pageIcon = "delivery_truck_speed";
                    break;
                case "การจัดส่งอาหารประจำวัน HHB":
                    this.pageIcon = "delivery_truck_speed";
                    this.pageTitle = "การจัดส่งอาหารประจำวัน";
                    break;


                case "แพ็คเกจคงเหลือของลูกค้า":
                    this.pageIcon = "deployed_code_history";
                    break;
                case "ประวัติการสั่งซื้อ":
                    this.pageIcon = "history";
                    break;

                case "แพ็คเกจคงเหลือของลูกค้า HHB":
                    this.pageIcon = "deployed_code_history";
                    this.pageTitle = "แพ็คเกจคงเหลือของลูกค้า";
                    break;
                case "ประวัติการสั่งซื้อ HHB":
                    this.pageIcon = "history";
                    this.pageTitle = "ประวัติการสั่งซื้อ";
                    break;


                default:
                    this.pageIcon = ""; // ไอคอนเริ่มต้น
            }
        },
        checkLoginStatus() {
            const token = localStorage.getItem('token');
            if (token) {
                this.isLoggedIn = true;
                this.getUserProfile();
            }
        },
        async getUserProfile() {
            try {
                const res = await api.getProfile(); // ใช้ฟังก์ชันจาก service
                this.username = res.username; // ตั้งค่าชื่อผู้ใช้
                this.email = res.email;
            } catch (error) {
                console.log('Error fetching profile:', error);
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.username = '';
            this.$router.push('/login'); // เปลี่ยนเส้นทางไปหน้า Login หลังจาก logout
        },
        goToProfile() {
            this.$router.push('/profile');
        }
    },
    watch: {
        $route(to) {
            if (to.name) {
                this.pageTitle = to.name;
                this.setPageIcon(to.name);
            }
        },
        // '$route'() {
        //     this.checkLoginStatus();
        // }
    },
    created() {
        if (this.$route.name) {
            this.pageTitle = this.$route.name;
            this.setPageIcon(this.$route.name);
        }
        this.checkLoginStatus();
    },

};
</script>

<style scoped>
header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
    z-index: 10;
}

main {
    padding-top: 64px;
    overflow-y: auto;
    height: calc(100vh - 64px);
    min-height: 100vh;
}

body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
}
</style>
