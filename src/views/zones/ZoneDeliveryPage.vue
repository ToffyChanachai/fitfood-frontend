<template>
    <div>

        <div class="flex space-x-2 items-center relative">
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <!-- <span class="material-symbols-outlined text-2xl text-gray-700">person</span> -->
                <span class="text-m text-gray-700">จำนวนโปรแกรมทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ zoneDeliveries.length }} รายการ</span>
            </div>

            <div class="add relative inline-block">
                <button @click="openAddModal"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
                    <span class="text-white text-base leading-none">เพิ่มโซนการจัดส่ง</span>
                </button>

                <div v-if="isAddModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[500px] flex flex-col">
                        <div
                            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <h2 class="text-xl font-bold">เพิ่มโซนการจัดส่ง</h2>
                            <span @click="closeAddModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>

                        <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                            <div>
                                <label for="zoneDeliveryName"
                                    class="block font-bold text-gray-700">ชื่อโซนการจัดส่ง</label>
                                <input id="zoneDeliveryName" v-model="newZoneDelivery.name" type="text"
                                    placeholder="กรอกชื่อโซนการจัดส่ง"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                            <div>
                                <label for="zoneDeliveryType"
                                    class="block font-bold text-gray-700">ประเภทโซนการจัดส่ง</label>
                                <select id="zoneDeliveryType" v-model="newZoneDelivery.zone_type_id"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                                    <option value="" disabled>เลือกประเภทโปรโมชั่น</option>
                                    <option v-for="type in zone_delivery_types" :key="type.id" :value="type.id">
                                        {{ type.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label for="zoneDeliveryPrice" class="block text-gray-700 font-medium">ราคา</label>
                                <input v-model="newZoneDelivery.price" id="zoneDeliveryPrice" type="number" step="1"
                                    min="0"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                            </div>
                        </div>

                        <!-- Footer (with buttons) -->
                        <div class="flex justify-end space-x-4 p-4 bg-gray-100 rounded-b-md">
                            <button @click="closeAddModal"
                                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                                ยกเลิก
                            </button>
                            <button @click="addzoneDelivery"
                                class="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
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
                        <li @click="sortData('id')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามรหัส</span>
                            <span v-if="sortColumn === 'id'" class="material-symbols-outlined text-sm">
                                {{ sortDirection['id'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
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

            <div class="filter relative inline-block" ref="filterDropdown">
                <button @click="toggleFiltterDropdown"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">filter_alt</span>
                    <span class="text-white text-base leading-none">Filter</span>
                    <span
                        class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto">arrow_drop_down</span>
                </button>

                <div v-if="isFilterDropdownOpen"
                    class="absolute right-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md overflow-y-auto z-50 border border-gray-300">
                    <div class="p-4 w-[500px] list-none">
                        <h3 class="font-bold mb-2">กรองโดยประเภทโปรโมชัน</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <label v-for="type in zone_delivery_types" :key="type.id"
                                class="flex items-center space-x-2">
                                <!-- Custom checkbox -->
                                <input type="checkbox" v-model="selectedZoneDeliveryTypes" :value="type.id"
                                    class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-custom-orange checked:border-transparent">
                                <span>{{ type.name }}</span>
                            </label>
                        </div>
                        <div class="flex justify-between mt-4 border-t pt-2">
                            <li @click="clearFilter"
                                class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                                <span>Clear Filter</span>
                            </li>

                            <div class="flex space-x-2">
                                <button @click="applyFilter"
                                    class="bg-custom-orange hover:bg-custom-orange-hover text-white px-4 py-2 rounded-md">
                                    ใช้ตัวกรอง
                                </button>
                                <button @click="toggleFiltterDropdown"
                                    class="px-4 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded-md">
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
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
                <tr v-for="(zone_delivery, index) in filteredZoneDeliveries" :key="index"
                    class="customers-data bg-white relative">
                    <td class="px-4 py-2 align-top">{{ zone_delivery.id }}</td>
                    <td class="px-4 py-2 align-top font-bold text-custom-orange">{{ zone_delivery.name }}</td>
                    <td class="px-4 py-2 align-top">{{ getZoneDeliveryTypeName(zone_delivery.zone_type_id) }}</td>
                    <td class="px-4 py-2 align-top">{{ parseFloat(zone_delivery.price).toLocaleString('th-TH', { minimumFractionDigits: 2 }) }} บาท</td>
                    <td class="px-4 py-2 align-top text-right">
                        <div class="flex justify-end space-x-2">
                            <button @click="openEditModal(zone_delivery)"
                                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">edit_square</span>
                                <span>แก้ไข</span>
                            </button>
                            <button @click="confirmDelete(zone_delivery.id)"
                                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">delete</span>
                                <span>ลบ</span>
                            </button>

                        </div>

                    </td>
                </tr>

                <tr v-if="filteredZoneDeliveries.length === 0">
                    <td colspan="6" class="py-20 bg-white text-center text-gray-500 font-bold">
                        ไม่พบข้อมูลที่ค้นหา
                    </td>
                </tr>
            </tbody>

            <div v-if="isEditModalOpen"
                class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div class="bg-white rounded-md shadow-lg w-1000">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">แก้ไขโซนการจัดส่ง</span>
                        <div class="flex space-x-2">
                            <span @click="closeEditModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                        <div class="mb-4">
                            <label for="editName" class="block text-gray-700 font-medium">ชื่อ</label>
                            <input v-model="selectedZoneDelivery.name" id="editName" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>

                        <div class="mb-4">
                            <label for="editZoneDeliveryType"
                                class="block font-bold text-gray-700">ประเภทโซนการจัดส่ง</label>
                            <select id="editZoneDeliveryType" v-model="selectedZoneDelivery.zone_type_id"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                                <option value="" disabled>เลือกประเภทโซนการจัดส่ง</option>
                                <option v-for="type in zone_delivery_types" :key="type.id" :value="type.id">
                                    {{ type.name }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="editZoneDeliveryPrice" class="block text-gray-700 font-medium">ราคา</label>
                            <input v-model="selectedZoneDelivery.price" id="editZoneDeliveryPrice" type="number"
                                step="1" min="0"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>

                        <div class="flex justify-end space-x-2">
                            <button @click="isEditModalOpen = false"
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                ยกเลิก
                            </button>
                            <button @click="saveChanges"
                                class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-30">
                                <span class="material-symbols-outlined">save</span>บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isDeleteModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div class="bg-white rounded-lg shadow-md w-1/3">
                    <div class="flex justify-between items-center bg-red-500 text-white px-4 py-2 rounded-t">
                        <h2 class="text-lg font-bold">ยืนยันการลบ</h2>
                        <span @click="closeDeleteModal"
                            class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                            close
                        </span>
                    </div>
                    <div class="p-4">
                        <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                    </div>
                    <div class="flex justify-end space-x-2 p-4">
                        <button @click="closeDeleteModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                            ยกเลิก
                        </button>
                        <button @click="deleteConfirmed"
                            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            ยืนยัน
                        </button>
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
    name: "zoneDeliveryPage",
    data() {
        return {
            headers: ['รหัส', 'ชื่อ', 'ประเภทโซนการจัดส่ง', 'ราคา', ''],
            headerWidths: ['10%', '30%', '35%', '20', '5%'],

            searchQuery: "",
            filteredZoneDeliveries: [],

            selectedZoneDeliveryTypes: [],
            isFilterDropdownOpen: false,

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            zoneDeliveries: [],
            currentPage: 1,
            itemsPerPage: 10,

            // selectedZoneDelivery: {},
            isEditModalOpen: false,

            isAddModalOpen: false,
            newZoneDelivery: {
                name: "",
                zone_type_id: "",
                price: "",
            },
            selectedZoneDelivery: {
                id: '',
                name: '',
                zone_type_id: '',
                price: ''
            },
            zone_delivery_types: [],

            isDeleteModalOpen: false,
            itemToDelete: null,

        };
    },
    computed: {
        totalPages() {
            return Math.ceil(
                this.zoneDeliveries.filter((zoneDelivery) => {
                    const matchesSearch = zoneDelivery.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        zoneDelivery.id.toString().includes(this.searchQuery);
                    const matchesPromotionType = this.selectedZoneDeliveryTypes.length === 0 || this.selectedZoneDeliveryTypes.includes(zoneDelivery.zone_type_id);
                    return matchesSearch && matchesPromotionType;
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
    },
    methods: {
        async fetchZoneDeliveries() {
            try {
                const response = await axios.get('http://127.0.0.1:3333/zone-deliveries');
                this.filteredZoneDeliveries = response.data;
                console.log("Response data:", response.data);
                this.zoneDeliveries = response.data;
                this.updatePage();
            } catch (error) {
                console.error("Error fetching zoneDelivery:", error);
            }
        },
        search() {
            const filtered = this.zoneDeliveries.filter((zoneDelivery) => {
                const matchesSearch = zoneDelivery.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    zoneDelivery.id.toString().includes(this.searchQuery);
                const matchesPromotionType = this.selectedZoneDeliveryTypes.length === 0 || this.selectedZoneDeliveryTypes.includes(zoneDelivery.zone_type_id);
                return matchesSearch && matchesPromotionType;
            });
            this.currentPage = 1;
            this.filteredZoneDeliveries = filtered;
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

            this.filteredZoneDeliveries = this.zoneDeliveries.filter((zoneDelivery) => {
                const matchesSearch = zoneDelivery.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    zoneDelivery.id.toString().includes(this.searchQuery);
                const matchesPromotionType = this.selectedZoneDeliveryTypes.length === 0 || this.selectedZoneDeliveryTypes.includes(zoneDelivery.zone_type_id);
                return matchesSearch && matchesPromotionType;
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

            this.zoneDeliveries.sort((a, b) => {
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
            this.zoneDeliveries.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
            this.updatePage();
        },

        toggleFiltterDropdown() {
            this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
        },
        applyFilter() {
            if (this.selectedZoneDeliveryTypes.length > 0) {
                this.filteredZoneDeliveries = this.zoneDeliveries.filter(zoneDelivery =>
                    this.selectedZoneDeliveryTypes.includes(zoneDelivery.zone_type_id)
                );
            } else {
                this.filteredZoneDeliveries = this.zoneDeliveries;
            }
            this.isFilterDropdownOpen = false;
            this.updatePage();
        },
        clearFilter() {
            this.selectedZoneDeliveryTypes = [];
            this.filteredZoneDeliveries = this.zoneDeliveries;
            this.updatePage();
        },

        handleClickOutside(event) {
            if (this.$refs.sortDropdown && !this.$refs.sortDropdown.contains(event.target)) {
                this.isSortDropdownOpen = false;
            }
            if (this.$refs.filterDropdown && !this.$refs.filterDropdown.contains(event.target)) {
                this.isFilterDropdownOpen = false;
            }
        },

        getZoneDeliveryTypeName(zone_type_id) {
            const type = this.zone_delivery_types.find(type => type.id === zone_type_id);
            return type ? type.name : 'ไม่พบข้อมูล';
        },

        openEditModal(zoneDelivery) {
            this.selectedZoneDelivery = { ...zoneDelivery };
            this.isEditModalOpen = true;
        },
        async saveChanges() {
            try {
                if (!this.selectedZoneDelivery.name || !this.selectedZoneDelivery.zone_type_id || !this.selectedZoneDelivery.price) {
                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }

                const response = await axios.put(`http://127.0.0.1:3333/zone-deliveries/${this.selectedZoneDelivery.id}`, {
                    name: this.selectedZoneDelivery.name,
                    zone_type_id: this.selectedZoneDelivery.zone_type_id,
                    price: this.selectedZoneDelivery.price
                });

                console.log("zoneDelivery updated:", response.data);
                // alert('บันทึกข้อมูลสำเร็จ');

                const index = this.zoneDeliveries.findIndex(delivery => delivery.id === this.selectedZoneDelivery.id);
                if (index !== -1) {
                    this.zoneDeliveries[index] = response.data;  // แทนที่ข้อมูลเดิมด้วยข้อมูลที่อัปเดตแล้ว
                }

                this.closeEditModal();
                this.updatePage();
            } catch (error) {
                console.error('Error saving changes:', error);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedZoneDelivery = {};
        },

        confirmDelete(itemId) {
            this.itemToDelete = itemId;
            this.isDeleteModalOpen = true;
        },
        closeDeleteModal() {
            this.isDeleteModalOpen = false;
            this.itemToDelete = null;
        },
        async deleteConfirmed() {
            try {
                await axios.delete(`http://127.0.0.1:3333/zone-deliveries/${this.itemToDelete}`);
                this.zoneDeliveries = this.zoneDeliveries.filter(
                    (item) => item.id !== this.itemToDelete
                );
                this.closeDeleteModal();
                this.updatePage();
                // alert("ลบข้อมูลสำเร็จ");
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            }
        },

        openAddModal() {
            this.isAddModalOpen = true;
        },
        closeAddModal() {
            this.isAddModalOpen = false;
            this.resetNewZoneDelivery();
        },
        resetNewZoneDelivery() {
            this.newZoneDelivery = {
                name: "",
                zone_type_id: "",
                price: "",
            };
        },
        async addzoneDelivery() {
            if (!this.newZoneDelivery.name || !this.newZoneDelivery.zone_type_id) {
                alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                return;
            }
            try {
                const response = await axios.post('http://127.0.0.1:3333/zone-deliveries', {
                    name: this.newZoneDelivery.name,
                    zone_type_id: this.newZoneDelivery.zone_type_id,
                    price: this.newZoneDelivery.price,
                });
                console.log("Added zoneDelivery:", response.data);

                this.zoneDeliveries.push(response.data);
                this.closeAddModal();
                this.updatePage();
            } catch (error) {
                console.error("Error adding zoneDelivery:", error);
                alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
            }
        },

        async fetchZoneDliveryTypes() {
            try {
                const response = await axios.get('http://127.0.0.1:3333/zone-delivery-types');
                this.zone_delivery_types = response.data;
            } catch (error) {
                console.error("Error fetching promotion types:", error);
            }
        },


    },
    created() {
        this.filteredZoneDeliveries = this.zoneDeliveries;
        this.sortData('id');
        this.fetchZoneDeliveries();
        this.fetchZoneDliveryTypes();
        this.updatePage();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchZoneDeliveries();
        this.fetchZoneDliveryTypes();
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

.pagination-controls {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}
</style>