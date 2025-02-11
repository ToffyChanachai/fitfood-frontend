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
                        <router-link to="/" class="block py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">home</span>
                            <span v-if="isExpanded">หน้าแรก</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/customers" class="block py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">groups</span>
                            <span v-if="isExpanded">ข้อมูลลูกค้า</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/sale-records" class="block py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">contact_page</span>
                            <span v-if="isExpanded">บันทึกการขาย</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/daily-sale" class="block py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">calendar_month</span>
                            <span v-if="isExpanded">ยอดขายประจำวัน</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/setup-menu-ph" class="block py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">menu_book</span>
                            <span v-if="isExpanded">Setup Menu Premium Health</span>
                        </router-link>
                    </li>


                    <li class="hover:bg-custom-orange-hover">
                        <router-link to="/test" class="block py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">fullscreen</span>
                            <span v-if="isExpanded">test</span>
                        </router-link>
                    </li>
                    <!-- <li class="hover:bg-custom-orange-hover">
                        <router-link to="/test2" class="block py-2 px-4 flex items-center space-x-2">
                            <span class="material-symbols-outlined text-3xl">fullscreen</span>
                            <span v-if="isExpanded">test2</span>
                        </router-link>
                    </li> -->


                    <li v-if="isExpanded" class="relative">
                        <button @click="toggleSubMenu"
                            class="block py-2 px-4 flex items-center space-x-2 w-full text-left">
                            <span class="material-symbols-outlined">folder</span>
                            <span>ข้อมูลทั้งหมด</span>
                            <span class="material-symbols-outlined text-3xl">expand_more</span>
                        </button>
                        <ul v-show="isSubMenuOpen" class="space-y-2 px-4 font-normal">
                            <li class="hover:bg-custom-orange-hover">
                                <router-link to="/packages" class="block py-2 px-4 flex items-center space-x-2">
                                    <span v-if="isExpanded">ข้อมูลแพ็คเกจ</span>
                                </router-link>
                            </li>
                            <li class="hover:bg-custom-orange-hover">
                                <router-link to="/zone-deliveries" class="block py-2 px-4 flex items-center space-x-2">
                                    <span v-if="isExpanded">ข้อมูลโซนการจัดส่ง</span>
                                </router-link>
                            </li>
                            <li class="hover:bg-custom-orange-hover">
                                <router-link to="/menus" class="block py-2 px-4 flex items-center space-x-2">
                                    <span v-if="isExpanded">ข้อมูลเมนู</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
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

            <div v-if="$route.path === '/customers' || $route.path === '/customers-hhb'"
                class="pt-16 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="customers" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/customers' }">
                    ข้อมูลลูกค้า AFF
                </router-link>
                <router-link to="/customers-hhb" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/customers-hhb' }">
                    ข้อมูลลูกค้า HHB
                </router-link>
            </div>

            <div v-if="$route.path === '/packages' || $route.path === '/programs' || $route.path === '/promotion-types' || $route.path === '/package-types'"
                class="pt-16 p-4 flex items-left space-x-6 text-m font-bold">
                <router-link to="packages" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/packages' }">
                    ข้อมูลแพ็คเกจ
                </router-link>
                <router-link to="/programs" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/programs' }">
                    ข้อมูลโปรแกรม
                </router-link>
                <router-link to="/promotion-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/promotion-types' }">
                    ข้อมูลประเภทโปรโมชัน
                </router-link>
                <router-link to="/package-types" class="hover:text-custom-orange"
                    :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/package-types' }">
                    ข้อมูลประเภทแพ็คเกจ
                </router-link>
            </div>

            <div v-if="$route.path === '/zone-deliveries' || $route.path === '/zone-delivery-types'"
                class="pt-16 p-4 flex items-left space-x-6 text-m font-bold">
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
                class="pt-16 p-4 flex items-left space-x-6 text-m font-bold">
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

            <!-- Content of the page -->
            <div class="pt-16">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: "MainLayout",
    data() {
        return {
            isExpanded: false, // เริ่มต้นให้ sidebar แสดงแบบเต็ม
            pageTitle: "", // ชื่อของหน้าปัจจุบัน
            pageIcon: "",
            isSubMenuOpen: false, // สถานะของเมนูย่อย
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
                case "ยอดขายประจำวัน":
                    this.pageIcon = "calendar_month";
                    break;
                case "Setup Menu Premium Health":
                    this.pageIcon = "menu_book";
                    break;
                default:
                    this.pageIcon = ""; // ไอคอนเริ่มต้น
            }
        },
    },
    watch: {
        $route(to) {
            if (to.name) {
                this.pageTitle = to.name;
                this.setPageIcon(to.name);
            }
        },
    },
    created() {
        if (this.$route.name) {
            this.pageTitle = this.$route.name;
            this.setPageIcon(this.$route.name);
        }
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

.pt-16 {
    padding-top: 20px;
}
</style>
