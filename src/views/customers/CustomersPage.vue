<template>
    <div>

        <div class="flex space-x-2 items-center relative">
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <span class="material-symbols-outlined text-2xl text-gray-700">person</span>
                <span class="text-m text-gray-700">จำนวนลูกค้าทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ customers.length }} คน</span>
            </div>

            <div class="sort relative inline-block" ref="sortDropdown">
                <button @click="toggleSortDropdown"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">sort</span>
                    <span class="text-white text-base leading-none">Sort</span>
                    <span
                        class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto">arrow_drop_down</span>
                </button>

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
                <input type="text" v-model="searchQuery" placeholder="ค้นหาชื่อและรหัส..."
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
                            <span class="material-symbols-outlined mr-1 text-xl">mail</span>{{ customer.email
                            }}
                        </div>
                        <div class="flex items-center">
                            <span class="material-symbols-outlined mr-1 text-xl">phone</span>{{ customer.tel }}
                        </div>
                    </td>
                    <td class="px-4 py-2 align-top">{{ customer.address_1 }}</td>
                    <td class="px-4 py-2 align-top">{{ customer.food_allergies }}</td>

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

            <div v-if="isEditModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">แก้ไขข้อมูลลูกค้า</span>
                        <div class="flex space-x-2">
                            <span @click="closeEditModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200"> close </span>
                        </div>
                    </div>
                    <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                        <!-- Customer Name -->
                        <div class="mb-4">
                            <label for="editCustomerName" class="block text-gray-700 font-medium">ชื่อ</label>
                            <input v-model="selectedCustomer.name" id="editCustomerName" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>

                        <!-- Customer Email -->
                        <div class="mb-4">
                            <label for="editCustomerEmail" class="block text-gray-700 font-medium">อีเมล</label>
                            <input v-model="selectedCustomer.email" id="editCustomerEmail" type="email"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>

                        <!-- Customer Gender -->
                        <div class="mb-4">
                            <label for="editCustomerGender" class="block font-bold text-gray-700">เพศ</label>
                            <select id="editCustomerGender" v-model="selectedCustomer.gender"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                                <option value="" disabled>เลือกเพศ</option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                            </select>
                        </div>

                        <!-- Customer Tel -->
                        <div class="mb-4">
                            <label for="editCustomerTel" class="block text-gray-700 font-medium">เบอร์โทรศัพท์</label>
                            <input v-model="selectedCustomer.tel" id="editCustomerTel" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>

                        <!-- Food Allergies -->
                        <div class="mb-4">
                            <label for="editFoodAllergies" class="block text-gray-700 font-medium">แพ้อาหาร</label>
                            <textarea id="editFoodAllergies" v-model="selectedCustomer.food_allergies"
                                placeholder="กรอกข้อมูลการแพ้อาหาร" rows="3"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                        </div>

                        <!-- Delivery Date -->
                        <div class="mb-4">
                            <label for="editDeliveryDate" class="block text-gray-700 font-medium">วันที่จัดส่ง</label>
                            <input v-model="selectedCustomer.delivery_date" id="editDeliveryDate" type="date"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>

                        <!-- Address Mon to Fri -->
                        <div class="mb-4">
                            <label for="editAddressMonToFri" class="block text-gray-700 font-medium">ที่อยู่
                                (จันทร์-ศุกร์)</label>
                            <textarea id="editAddressMonToFri" v-model="selectedCustomer.address_mon_to_fri"
                                placeholder="กรอกที่อยู่สำหรับวันจันทร์ถึงวันศุกร์" rows="3"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                        </div>

                        <!-- Recipient Mon to Fri -->
                        <div class="mb-4">
                            <label for="editRecipientMonToFri" class="block text-gray-700 font-medium">ผู้รับ
                                (จันทร์-ศุกร์)</label>
                            <textarea id="editRecipientMonToFri" v-model="selectedCustomer.recipient_mon_to_fri"
                                placeholder="กรอกชื่อผู้รับสำหรับวันจันทร์ถึงวันศุกร์" rows="3"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                        </div>

                        <!-- Other Details -->
                        <div class="mb-4">
                            <label for="editOtherDetail"
                                class="block text-gray-700 font-medium">รายละเอียดเพิ่มเติม</label>
                            <textarea id="editOtherDetail" v-model="selectedCustomer.other_detail"
                                placeholder="กรอกข้อมูลเพิ่มเติม" rows="3"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                        </div>

                    </div>

                    <!-- Footer (with buttons) -->
                    <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                        <div class="flex space-x-2">
                            <button @click="closeEditModal"
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                ยกเลิก
                            </button>
                            <button @click="saveCustomerChanges"
                                class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-30">
                                <span class="material-symbols-outlined">save</span>บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </table>

        <div class="pagination-controls flex justify-center items-center space-x-2 bg-white px-4 py-2">
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

                <button v-for="page in totalPagesArray.range" :key="page" @click="goToPage(page)"
                    :class="['px-3 py-2 rounded-md', { 'bg-custom-orange text-white': currentPage === page, 'bg-white': currentPage !== page }]"
                    class="cursor-pointer hover:bg-custom-orange hover:text-white">
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
import axios from 'axios';

export default {
    name: "Test2Page",
    data() {
        return {
            headers: ['รหัสลูกค้า', 'ชื่อ', 'ช่องทางการติดต่อ', 'ที่อยู่', 'ข้อมูลแพ้อาหาร', ""],
            headerWidths: ['10%', '15%', '20%', '30%', '20%', '5%'],

            searchQuery: "",
            filteredCustomers: [],

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            customers: [],
            currentPage: 1,
            itemsPerPage: 10,

            selectedCustomer: {
                id: null, // id ของลูกค้า
                email: '',
                customer_id: '',  // customer_id ที่ไม่ซ้ำ
                name: '',
                customer_gender: '',  // 'male' หรือ 'female'
                customer_tel: '',
                customer_line_id: '',
                food_allergies: '',
                delivery_date: '',
                address_mon_to_fri: '',
                recipient_mon_to_fri: '',
                address_sat_to_sun: '',
                recipient_sat_to_sun: '',
                other_detail: '',
                note: '',
                seller_name_id: null,  // ฟิลด์ที่เชื่อมโยงกับ id ของ seller_names
                select_by: '',  // 'customer' หรือ 'aff'
                address_1: '',
                zone_1: null,  // id ของ zone_deliveries
                address_2: '',
                zone_2: null,  // id ของ zone_deliveries
                address_3: '',
                zone_3: null,  // id ของ zone_deliveries
                created_at: null,
                updated_at: null
            },

            moreOpenDropdownIndex: null,

            isEditModalOpen: false,
            isDeleteModalOpen: false,
            itemToDelete: null,

        };
    },
    computed: {
        totalPages() {
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
                const response = await axios.get('http://127.0.0.1:3333/customers');
                this.filteredCustomers = response.data;
                this.customers = response.data;
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

        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
            this.updatePage();
        },
        updatePage() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;

            this.filteredCustomers = this.customers.filter((customer) => {
                const matchesSearch = customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    customer.customer_id.toString().includes(this.searchQuery);
                return matchesSearch;
            }).slice(startIndex, endIndex);
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

            this.customers.sort((a, b) => {
                const aValue = a[column];
                const bValue = b[column];
                if (aValue < bValue) return -this.sortDirection[column];
                if (aValue > bValue) return this.sortDirection[column];
                return 0;
            });

            this.currentPage = 1;
            this.updatePage();
        },
        clearSort() {
            this.sortColumn = 'id';
            this.sortDirection.id = 1;
            this.customers.sort((a, b) => a.id - b.id);
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


        // onEdit(customer) {
        //     alert(`แก้ไขข้อมูล: ${customer.name}`);
        // },
        onEdit(customer) {
            this.selectedCustomer = { ...customer }; // คัดลอกข้อมูลลูกค้า
            this.isEditModalOpen = true; // เปิด Modal
        },
        async saveChanges() {
            try {
                // ตรวจสอบว่าฟิลด์สำคัญถูกกรอกครบถ้วน
                if (!this.selectedCustomer.name || !this.selectedCustomer.email) {
                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }

                // ส่งคำขอไปที่ Backend เพื่ออัปเดตข้อมูล
                const response = await axios.put(`http://127.0.0.1:3333/customers/${this.selectedCustomer.id}`, {
                    email: this.selectedCustomer.email,
                    customer_id: this.selectedCustomer.customer_id,
                    name: this.selectedCustomer.name,
                    gender: this.selectedCustomer.gender,
                    tel: this.selectedCustomer.tel,
                    line_id: this.selectedCustomer.line_id,
                    food_allergies: this.selectedCustomer.food_allergies,
                    delivery_date: this.selectedCustomer.delivery_date,
                    address_mon_to_fri: this.selectedCustomer.address_mon_to_fri,
                    recipient_mon_to_fri: this.selectedCustomer.recipient_mon_to_fri,
                    address_sat_to_sun: this.selectedCustomer.address_sat_to_sun,
                    recipient_sat_to_sun: this.selectedCustomer.recipient_sat_to_sun,
                    other_detail: this.selectedCustomer.other_detail,
                    note: this.selectedCustomer.note,
                    seller_name_id: this.selectedCustomer.seller_name_id,
                    select_by: this.selectedCustomer.select_by,
                    address_1: this.selectedCustomer.address_1,
                    zone_1: this.selectedCustomer.zone_1,
                    address_2: this.selectedCustomer.address_2,
                    zone_2: this.selectedCustomer.zone_2,
                    address_3: this.selectedCustomer.address_3,
                    zone_3: this.selectedCustomer.zone_3,
                });

                console.log("Customer updated:", response.data);

                // อัปเดตข้อมูลในรายการลูกค้า
                const index = this.customers.findIndex(customer => customer.id === this.selectedCustomer.id);
                if (index !== -1) {
                    this.customers[index] = response.data; // แทนที่ข้อมูลเดิมด้วยข้อมูลใหม่
                }

                this.isEditModalOpen = false; // ปิด Modal
                this.updatePage(); // รีเฟรชข้อมูลหน้าปัจจุบัน
            } catch (error) {
                console.error('Error saving changes:', error);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false; // ปิด Modal
            this.selectedCustomer = {}; // รีเซ็ตข้อมูลลูกค้าที่เลือก
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
        this.sortData('id');

        this.fetchCustomers();
        this.updatePage();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchCustomers();
        this.updatePage();
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
    border-top-right-radius: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    overflow: hidden;
}

.customers-data td {
    border-bottom: 1px solid #EAEAEA;
    padding-bottom: 30px;
}

.dropdown-up {
    bottom: 100%;
    margin-bottom: 4px;
}

.pagination-controls {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}
</style>