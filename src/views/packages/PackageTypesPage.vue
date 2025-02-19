<template>
    <div class="mt-[-20px]">

        <div class="flex space-x-2 items-center relative">
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <!-- <span class="material-symbols-outlined text-2xl text-gray-700">person</span> -->
                <span class="text-m text-gray-700">จำนวนประเภทโปรโมชันทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ promotion_types.length }} รายการ</span>
            </div>

            <div class="add relative inline-block">
                <button @click="openAddModal"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
                    <span class="text-white text-base leading-none">เพิ่มประเภทแพ็คเกจ</span>
                </button>

                <div v-if="isAddModalOpen"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-md shadow-lg w-1000">
                        <div
                            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <div class="flex-1 flex items-left">
                                <span class="text-xl font-bold">เพิ่มประเภทแพ็คเกจ</span>
                            </div>
                            <div class="flex space-x-2">
                                <span @click="closeAddModal"
                                    class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                    close
                                </span>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-6 w-[400px]">
                            <form @submit.prevent="addPromotionType">
                                <div class="mb-4">
                                    <label for="name" class="block text-gray-700">ชื่อประเภทแพ็คเกจ</label>
                                    <input type="text" id="name" v-model="newPromotionType.name"
                                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-custom-orange" />
                                </div>
                                <div class="flex justify-end space-x-2">
                                    <button @click="closeAddModal"
                                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">ยกเลิก</button>
                                    <button type="submit"
                                        class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-30">
                                        <span class="material-symbols-outlined">save</span>บันทึก</button>
                                </div>
                            </form>
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
                <tr v-for="(promotion_type, index) in filteredPackageType" :key="index"
                    class="customers-data bg-white relative">
                    <td class="px-4 py-2 align-top">{{ promotion_type.id }}</td>
                    <td class="px-4 py-2 align-top font-bold text-custom-orange">{{ promotion_type.name }}</td>
                    <td class="px-4 py-2 align-top text-right">
                        <div class="flex justify-end space-x-2">
                            <button @click="openEditModal(promotion_type)"
                                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">edit_square</span>
                                <span>แก้ไข</span>
                            </button>
                            <button @click="confirmDelete(promotion_type.id)"
                                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">delete</span>
                                <span>ลบ</span>
                            </button>

                        </div>

                    </td>
                </tr>

                <tr v-if="filteredPackageType.length === 0">
                    <td colspan="6" class="py-20 bg-white text-center text-gray-500 font-bold">
                        ไม่พบข้อมูลที่ค้นหา
                    </td>
                </tr>
            </tbody>

            <div v-if="isEditModalOpen"
                class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div class="bg-white rounded-md shadow-lg w-1000">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">แก้ไขประเภทแพ็คเกจ</span>
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
                            <input v-model="selectedPromotionType.name" id="editName" type="text"
                                class="border rounded px-4 py-2 w-full">
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

            <!-- Modal ยืนยันการลบ -->
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
    name: "PromotionTypePage",
    data() {
        return {
            headers: ['รหัส', 'ชื่อ', ""],
            headerWidths: ['10%', '85%', '5%'],

            searchQuery: "",
            filteredPackageType: [],

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            promotion_types: [],
            currentPage: 1,
            itemsPerPage: 10,

            selectedPromotionType: {},
            isEditModalOpen: false,

            isAddModalOpen: false,
            newPromotionType: {
                name: '',
            },

            isDeleteModalOpen: false, // สถานะการแสดง Modal
            itemToDelete: null,

        };
    },
    computed: {
        totalPages() {
            return Math.ceil(
                this.promotion_types.filter((promotion_type) => {
                    const matchesSearch = promotion_type.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        promotion_type.id.toString().includes(this.searchQuery);
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
    },
    methods: {
        async fetchPackageTypes() {
            try {
                const response = await axios.get('http://127.0.0.1:3333/package-types');
                this.filteredPackageType = response.data;
                console.log("Response data:", response.data);
                this.promotion_types = response.data;
                this.updatePage();
            } catch (error) {
                console.error("Error fetching promotion_type:", error);
            }
        },
        search() {
            const filtered = this.promotion_types.filter((promotion_type) => {
                const matchesSearch = promotion_type.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    promotion_type.id.toString().includes(this.searchQuery);
                return matchesSearch;
            });
            this.currentPage = 1;
            this.filteredPackageType = filtered;
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

            this.filteredPackageType = this.promotion_types.filter((promotion_type) => {
                const matchesSearch = promotion_type.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    promotion_type.id.toString().includes(this.searchQuery);
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

            this.promotion_types.sort((a, b) => {
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
            this.promotion_types.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
            this.updatePage();
        },

        handleClickOutside(event) {
            if (this.$refs.sortDropdown && !this.$refs.sortDropdown.contains(event.target)) {
                this.isSortDropdownOpen = false;
            }
        },

        openEditModal(promotionType) {
            this.selectedPromotionType = { ...promotionType };
            this.isEditModalOpen = true;
        },
        async saveChanges() {
            try {
                await axios.put(`http://127.0.0.1:3333/package-types/${this.selectedPromotionType.id}`, {
                    name: this.selectedPromotionType.name,
                });
                const index = this.promotion_types.findIndex(pt => pt.id === this.selectedPromotionType.id);
                if (index !== -1) {
                    this.promotion_types[index] = { ...this.selectedPromotionType };
                    this.updatePage();
                }
                this.isEditModalOpen = false;
            } catch (error) {
                console.error("Error updating promotion type:", error);
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedPromotionType = {};
        },

        confirmDelete(itemId) {
            this.itemToDelete = itemId; // เก็บ ID ของข้อมูลที่ต้องการลบ
            this.isDeleteModalOpen = true; // เปิด Modal
        },
        closeDeleteModal() {
            this.isDeleteModalOpen = false; // ปิด Modal
            this.itemToDelete = null;      // ล้างข้อมูลที่เลือก
        },
        async deleteConfirmed() {
            try {
                await axios.delete(`http://127.0.0.1:3333/package-types/${this.itemToDelete}`);
                this.promotion_types = this.promotion_types.filter(
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
            this.newPromotionType = { name: '' };
        },
        closeAddModal() {
            this.isAddModalOpen = false;
        },
        async addPromotionType() {
            if (!this.newPromotionType.name.trim()) {
                alert('กรุณากรอกชื่อ');
                return;
            }
            try {
                const response = await axios.post('http://127.0.0.1:3333/package-types', this.newPromotionType);
                this.promotion_types.push(response.data);
                this.updatePage();
                this.closeAddModal();
            } catch (error) {
                console.error('Error adding promotion type:', error);
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
            }
        },
    },
    created() {
        this.filteredPackageType = this.promotion_types;
        this.sortData('id');
        this.fetchPackageTypes();
        this.updatePage();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchPackageTypes();
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