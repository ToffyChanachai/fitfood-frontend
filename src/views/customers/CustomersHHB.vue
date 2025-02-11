<template>
    <div>

        <div class="flex space-x-2 items-center relative">
            <!-- แสดงจำนวนข้อมูลทั้งหมด -->
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <span class="material-symbols-outlined text-2xl text-gray-700">person</span>
                <span class="text-m text-gray-700">จำนวนลูกค้าทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ customers.length }} คน</span>
            </div>

            <div class="sort relative inline-block" ref="sortDropdown">
                <!-- Sort Dropdown Button -->
                <button @click="toggleSortDropdown"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">sort</span>
                    <span class="text-white text-base leading-none">Sort</span>
                    <span
                        class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto">arrow_drop_down</span>
                </button>

                <!-- Dropdown Sort Menu -->
                <div v-if="isSortDropdownOpen"
                    class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-48 z-50 border border-gray-300">
                    <ul class="list-none p-0 m-0">
                        <li @click="sortData('customer_id')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามรหัส</span>
                            <span v-if="sortColumn === 'customer_id'" class="material-symbols-outlined text-sm">
                                {{ sortDirection['customer_id'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
                            </span>
                        </li>
                        <li @click="sortData('name')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามชื่อ</span>
                            <span v-if="sortColumn === 'name'" class="material-symbols-outlined text-sm">
                                {{ sortDirection['name'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
                            </span>
                        </li>
                        <li @click="clearSort"
                            class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-right border-t hover:underline">
                            <span>Clear Sort</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Search Input -->
            <div class="flex w-[250px] relative">
                <!-- Input Field -->
                <input type="text" v-model="searchQuery" placeholder="ค้นหาชื่อและรหัส..."
                    class="border border-gray-300 rounded-l px-4 py-2 w-full" @keyup.enter="search" />
                <!-- Clear Button -->
                <button v-if="searchQuery" @click="clearSearch"
                    class="material-symbols-outlined absolute right-[55px] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    close
                </button>
                <!-- Search Button -->
                <button @click="search"
                    class="bg-custom-orange material-symbols-outlined text-white text-xl px-4 py-2 rounded-r hover:bg-custom-orange-hover">
                    search
                </button>
            </div>


        </div>

        <!-- ตารางแสดงข้อมูลรหัสและชื่อ -->
        <table class="min-w-full table-fixed border-collapse mt-4">
            <thead>
                <tr class="bg-custom-orange text-white">
                    <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
                        :style="{ width: headerWidths[index] }">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(customer, index) in filteredCustomers" :key="index"
                    class="customers-data bg-white relative">
                    <td class="px-4 py-2 align-top">{{ customer.customer_id }}</td>
                    <td class="px-4 py-2 align-top font-bold text-custom-orange">{{ customer.name }}</td>
                    <td class="px-4 py-2 align-top">
                        <div class="flex items-center">
                            <span class="material-symbols-outlined mr-1 text-xl">mail</span>{{ customer.email }}
                        </div>
                        <div class="flex items-center">
                            <span class="material-symbols-outlined mr-1 text-xl">phone</span>{{ customer.tel }}
                        </div>
                    </td>
                    <td class="px-4 py-2 align-top">{{ customer.address }}</td>
                    <td class="px-4 py-2 align-top font-bold">{{ customer.package }}</td>

                    <td class="px-4 py-2 text-right relative">
                        <button @click="toggleMoreDropdown(index)">
                            <span class="material-symbols-outlined cursor-pointer">more_vert</span>
                        </button>
                        <div v-if="moreOpenDropdownIndex === index" :class="moreDropdownPositionClass(index)"
                            class="dropdown-menu absolute right-0 text-center bg-white shadow-lg rounded-md z-50 w-40 border border-gray-300">
                            <ul class="list-none p-0 m-0">
                                <li @click="onViewDetails(customer)"
                                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 border-b border-gray-300">
                                    ดูรายละเอียด
                                </li>
                                <li @click="onEdit(customer)"
                                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-blue-500 border-b border-gray-300">
                                    แก้ไขข้อมูล
                                </li>
                                <li @click="onDelete(customer)"
                                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500 border-b border-gray-300">
                                    ลบข้อมูล
                                </li>
                            </ul>
                        </div>
                    </td>

                    <!-- Modal Popup -->
                    <div v-if="isDetailModalOpen"
                        class="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10 z-50">
                        <div class="bg-white rounded-md shadow-lg w-1000">
                            <!-- Header -->
                            <div
                                class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                                <span class="font-bold">Copy & Paste เพื่อสรุปยอดส่งให้ลูกค้า</span>
                                <div class="flex space-x-2">
                                    <!-- Edit Icon -->
                                    <span class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                        edit
                                    </span>

                                    <span @click="closeDetailModal"
                                        class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                        close
                                    </span>
                                </div>
                            </div>
                            <!-- Modal Content -->
                            <div class="p-6">
                                <p class="text-gray-500"><strong>ขออนุญาตสรุปยอดนะคะ</strong></p>
                                <div v-for="(value, key) in filteredResultCustomer" :key="key" class="mb-2">
                                    <p><strong>{{ formatLabel(key) }}:</strong> {{ value }}</p>
                                </div>
                                <p class="text-gray-500"><strong>กรุณาชำระเงิน ของวันสรุปยอด
                                        เพื่อให้ท่านได้รับอาหารตามวันที่กำหนดในรายการสรุปยอดนี้นะคะ</strong></p>
                            </div>
                        </div>
                    </div>
                </tr>
                <tr v-if="filteredCustomers.length === 0">
                    <td colspan="6" class="py-20 bg-white text-center text-gray-500 font-bold">
                        ไม่พบข้อมูลที่ค้นหา
                    </td>
                </tr>
            </tbody>
        </table>


        <!-- Pagination Controls -->
        <div class="pagination-controls flex justify-center items-center space-x-2 bg-white px-4 py-2">
            <!-- Previous Page Button -->
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50">
                <span class="material-symbols-outlined">chevron_left</span>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center space-x-1">
                <!-- ปุ่มสำหรับหน้าแรก -->
                <button v-if="totalPagesArray.start > 1" @click="goToPage(1)"
                    class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
                    1
                </button>
                <!-- ปุ่ม ... ก่อนหน้า -->
                <button v-if="totalPagesArray.start > 2" @click="goToPage(totalPagesArray.start - 1)"
                    class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
                    ...
                </button>

                <!-- หมายเลขหน้าปัจจุบัน -->
                <button v-for="page in totalPagesArray.range" :key="page" @click="goToPage(page)"
                    :class="['px-3 py-2 rounded-md', { 'bg-custom-orange text-white': currentPage === page, 'bg-white': currentPage !== page }]"
                    class="cursor-pointer hover:bg-custom-orange hover:text-white">
                    {{ page }}
                </button>

                <!-- ปุ่ม ... ถัดไป -->
                <button v-if="totalPagesArray.end < totalPages - 1" @click="goToPage(totalPagesArray.end + 1)"
                    class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
                    ...
                </button>
                <!-- ปุ่มสำหรับหน้าสุดท้าย -->
                <button v-if="totalPagesArray.end < totalPages" @click="goToPage(totalPages)"
                    class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white">
                    {{ totalPages }}
                </button>
            </div>

            <!-- Next Page Button -->
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50">
                <span class="material-symbols-outlined">chevron_right</span>
            </button>
        </div>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "Test2Page",
    data() {
        return {
            headers: ['รหัสลูกค้า', 'ชื่อ', 'ช่องทางการติดต่อ', 'ที่อยู่', 'แพ็กเกจที่เลือก', ""],
            headerWidths: ['10%', '15%', '20%', '40%', '10%', '5%'],

            searchQuery: "", // ข้อความที่ใช้ค้นหา
            filteredCustomers: [], // รายการที่ค้นพบหลังจากกดค้นหา

            isSortDropdownOpen: false, // ควบคุมการเปิด/ปิด dropdown สำหรับการจัดเรียง
            sortDirection: { // ควบคุมทิศทางการจัดเรียง
                id: 1, // 1 = ascending, -1 = descending
                name: 1
            },
            sortColumn: '', // เก็บชื่อคอลัมน์ที่ถูกเลือก
            openDropdownIndex: null, // เก็บ index ของ Dropdown ที่ถูกเปิด

            customers: [],
            currentPage: 1, // current page number
            itemsPerPage: 10, // items per page

            selectedCustomer: {},
            moreOpenDropdownIndex: null,

        };
    },
    computed: {
        totalPages() {
            // คำนวณจำนวนหน้าจากผลลัพธ์ที่กรอง
            return Math.ceil(
                this.customers.filter((customer) => {
                    const matchesSearch = customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        customer.customer_id.toString().includes(this.searchQuery);
                    return matchesSearch;
                }).length / this.itemsPerPage
            );
        },
        totalPagesArray() {
            const maxVisiblePages = 5;
            const halfVisible = Math.floor(maxVisiblePages / 2);

            let start = this.currentPage - halfVisible;
            let end = this.currentPage + halfVisible;

            // ตรวจสอบว่าขอบล่างสุดไม่เกิน 1
            if (start < 1) {
                start = 1;
                end = Math.min(maxVisiblePages, this.totalPages);
            }

            // ตรวจสอบว่าขอบบนสุดไม่เกินจำนวนหน้าทั้งหมด
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
        filteredResultCustomer() {
            return {
                name: this.selectedCustomer.name,
                address: this.selectedCustomer.address
            };
        }

    },
    methods: {
        async fetchCustomers() {
            try {
                // ดึงข้อมูลจาก API
                const response = await axios.get('http://127.0.0.1:3333/customers-hhb'); // ปรับ URL ตาม API ที่ใช้
                this.filteredCustomers = response.data;
                console.log("Customers loaded: ", this.customers);  // ตรวจสอบข้อมูลที่ดึงมา
                this.customers = response.data; // เพิ่มข้อมูลเข้าใน customers
                this.updatePage();
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },
        search() {
            const filtered = this.customers.filter((customer) => {
                const matchesSearch = customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    customer.customer_id.toString().includes(this.searchQuery);
                return matchesSearch;
            });
            this.currentPage = 1;
            this.filteredCustomers = filtered;
            this.updatePage();
        },
        clearSearch() {
            this.searchQuery = '';
            this.search();
        },

        //Page
        goToPage(page) {
            // ป้องกันไม่ให้หน้ามากกว่าหน้าสุดท้ายหรือน้อยกว่าหน้าแรก
            if (page < 1 || page > this.totalPages) return;

            // เปลี่ยนหน้าปัจจุบัน
            this.currentPage = page;

            // อัปเดตข้อมูลที่แสดง
            this.updatePage();
        },
        updatePage() {
            // กรองข้อมูลให้แสดงเฉพาะหน้าที่ต้องการ
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;

            // อัปเดตข้อมูลที่แสดงเฉพาะในหน้าปัจจุบัน
            this.filteredCustomers = this.customers.filter((customer) => {
                const matchesSearch = customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    customer.customer_id.toString().includes(this.searchQuery);
                return matchesSearch;
            }).slice(startIndex, endIndex);
        },

        //Sort
        toggleSortDropdown() {
            this.isSortDropdownOpen = !this.isSortDropdownOpen; // เปิด/ปิด dropdown
        },
        sortData(column) {
            if (this.sortColumn === column) {
                this.sortDirection[column] = -this.sortDirection[column];
            } else {
                this.sortColumn = column;
                this.sortDirection[column] = 1;
            }

            this.customers.sort((a, b) => {
                const aValue = a[column];
                const bValue = b[column];
                if (aValue < bValue) return -this.sortDirection[column];
                if (aValue > bValue) return this.sortDirection[column];
                return 0;
            });

            // หลังจัดเรียงเสร็จ ให้กลับไปหน้าแรก
            this.currentPage = 1;
            this.updatePage();
        },
        clearSort() {
            // รีเซ็ตค่าการจัดเรียง
            this.sortColumn = 'id'; // กำหนดให้กลับมาจัดเรียงตาม 'id'
            this.sortDirection.id = 1; // กำหนดให้เรียงลำดับจากน้อยไปมาก
            this.customers.sort((a, b) => a.id - b.id); // จัดเรียงข้อมูลต้นฉบับใหม่ตาม 'id'

            // รีเซ็ตหน้าปัจจุบันและข้อมูลที่แสดง
            this.currentPage = 1;
            this.updatePage();
        },

        handleClickOutside(event) {
            if (this.$refs.sortDropdown && !this.$refs.sortDropdown.contains(event.target)) {
                this.isSortDropdownOpen = false;
            }
            if (!event.target.closest('.dropdown-menu') && !event.target.closest('button')) {
                this.moreOpenDropdownIndex = null;
            }
        },

        toggleMoreDropdown(index) {
            this.moreOpenDropdownIndex = this.moreOpenDropdownIndex === index ? null : index;
        },
        moreDropdownPositionClass(index) {
            if (index >= this.filteredCustomers.length - 2) {
                return 'dropdown-up';
            }
            return 'dropdown-down';
        },

        onViewDetails(customer) {
            this.selectedCustomer = customer;
            this.isDetailModalOpen = true;
            this.moreOpenDropdownIndex = null;
        },
        closeDetailModal() {
            this.isDetailModalOpen = false;
            this.selectedCustomer = {};
        },
        onEdit(customer) {
            alert(`แก้ไขข้อมูล: ${customer.name}`);
        },
        onDelete(customer) {
            alert(`ลบข้อมูล: ${customer.name}`);
        },

        formatLabel(key) {
            const labels = {
                name: 'ชื่อ',
                address: 'muj'
            };
            return labels[key] || key;
        },
    },
    created() {
        this.filteredCustomers = this.customers;
        this.sortData('id'); // เรียกจัดเรียงตามรหัสโดยเริ่มต้น

        this.fetchCustomers(); // ดึงข้อมูลเมื่อ component ถูกสร้าง
        this.updatePage(); // คำนวณจำนวนหน้าตอนเริ่มต้น
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchCustomers(); // ดึงข้อมูลเมื่อ component ถูกสร้าง
        this.updatePage(); // คำนวณจำนวนหน้าตอนเริ่มต้น
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },


};
</script>


<style scoped>
table {
    width: 100%;
    table-layout: fixed;
    border: 1px solid #ddd;
    border-top-left-radius: 15px;
    /* ขอบมนด้านซ้ายบน */
    border-top-right-radius: 15px;
    /* ขอบมนด้านขวาบน */
    border-bottom-left-radius: 0;
    /* ขอบตรงด้านซ้ายล่าง */
    border-bottom-right-radius: 0;
    /* ขอบตรงด้านขวาล่าง */
    overflow: hidden;
}

.customers-data td {
    border-bottom: 1px solid #EAEAEA;
    padding-bottom: 30px;
}

.dropdown-up {
    bottom: 100%;
    /* แสดง Dropdown ด้านบน */
    margin-bottom: 4px;
}

.pagination-controls {
    border-bottom-left-radius: 15px;
    /* กำหนดขอบมนข้างซ้ายล่าง */
    border-bottom-right-radius: 15px;
    /* กำหนดขอบมนข้างขวาล่าง */
}
</style>