<template>
    <div class="mt-[-20px]">

        <div class="flex space-x-2 items-center relative">
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <!-- <span class="material-symbols-outlined text-2xl text-gray-700">person</span> -->
                <span class="text-m text-gray-700">จำนวนโปรแกรมทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ programs.length }} รายการ</span>
            </div>

            <div class="add relative inline-block">
                <button @click="openAddModal"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
                    <span class="text-white text-base leading-none">เพิ่มโปรแกรม</span>
                </button>

                <div v-if="isAddModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[500px] flex flex-col">
                        <div
                            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <h2 class="text-xl font-bold">เพิ่มโปรแกรมเข้า</h2>
                            <span @click="closeAddModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>

                        <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                            <div>
                                <label for="programName" class="block font-bold text-gray-700">ชื่อโปรแกรม</label>
                                <input id="programName" v-model="newProgram.name" type="text"
                                    placeholder="กรอกชื่อโปรแกรม"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                            <div>
                                <label for="promotionType" class="block font-bold text-gray-700">ประเภทโปรโมชั่น</label>
                                <select id="promotionType" v-model="newProgram.promotion_type_id"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                                    <option value="" disabled>เลือกประเภทโปรโมชั่น</option>
                                    <option v-for="type in promotion_types" :key="type.id" :value="type.id">
                                        {{ type.name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Footer (with buttons) -->
                        <div class="flex justify-end space-x-4 p-4 bg-gray-100 rounded-b-md">
                            <button @click="closeAddModal"
                                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                                ยกเลิก
                            </button>
                            <button @click="addProgram"
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
                        <div class="grid grid-cols-3 gap-4">
                            <label v-for="type in promotion_types" :key="type.id" class="flex items-center space-x-2">
                                <!-- Custom checkbox -->
                                <input type="checkbox" v-model="selectedPromotionType" :value="type.id"
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
                <tr v-for="(program, index) in filteredProgram" :key="index" class="customers-data bg-white relative">
                    <td class="px-4 py-2 align-top">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td class="px-4 py-2 align-top font-bold text-custom-orange">{{ program.name }}</td>
                    <td class="px-4 py-2 align-top">{{ getPromotionTypeName(program.promotion_type_id) }}</td>
                    <td class="px-4 py-2 align-top text-right">
                        <div class="flex justify-end space-x-2">
                            <button @click="openEditModal(program)"
                                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">edit_square</span>
                                <span>แก้ไข</span>
                            </button>
                            <button @click="confirmDelete(program.id)"
                                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">delete</span>
                                <span>ลบ</span>
                            </button>

                        </div>

                    </td>
                </tr>

                <tr v-if="filteredProgram.length === 0">
                    <td colspan="6" class="py-20 bg-white text-center text-gray-500 font-bold">
                        ไม่พบข้อมูลที่ค้นหา
                    </td>
                </tr>
            </tbody>

            <div v-if="isEditModalOpen"
                class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div class="bg-white rounded-md shadow-lg w-1000">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">แก้ไขโปรแกรม</span>
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
                            <input v-model="selectedProgram.name" id="editName" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>

                        <div class="mb-4">
                            <label for="editPromotionType" class="block font-bold text-gray-700">ประเภทโปรโมชั่น</label>
                            <select id="editPromotionType" v-model="selectedProgram.promotion_type_id"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                                <option value="" disabled>เลือกประเภทโปรโมชั่น</option>
                                <option v-for="type in promotion_types" :key="type.id" :value="type.id">
                                    {{ type.name }}
                                </option>
                            </select>
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
    name: "ProgramPage",
    data() {
        return {
            headers: ['#', 'ชื่อ', 'ประเภทโปรโมชัน', ''],
            headerWidths: ['10%', '50%', '35%', '5%'],

            searchQuery: "",
            filteredProgram: [],

            selectedPromotionType: [],
            isFilterDropdownOpen: false,

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            programs: [],
            currentPage: 1,
            itemsPerPage: 10,

            // selectedProgram: {},
            isEditModalOpen: false,

            isAddModalOpen: false,
            newProgram: {
                name: "",
                promotion_type_id: "",
            },
            selectedProgram: {
                id: '',
                name: '',
                promotion_type_id: ''
            },
            promotion_types: [],

            isDeleteModalOpen: false,
            itemToDelete: null,

        };
    },
    computed: {
        totalPages() {
            return Math.ceil(
                this.programs.filter((program) => {
                    const matchesSearch = program.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        program.id.toString().includes(this.searchQuery);
                    const matchesPromotionType = this.selectedPromotionType.length === 0 || this.selectedPromotionType.includes(program.promotion_type_id);
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
        async fetchPrograms() {
            try {
                const response = await axios.get('http://127.0.0.1:3333/programs');
                this.filteredProgram = response.data;
                console.log("Response data:", response.data);
                this.programs = response.data;
                this.updatePage();
            } catch (error) {
                console.error("Error fetching program:", error);
            }
        },
        search() {
            const filtered = this.programs.filter((program) => {
                const matchesSearch = program.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    program.id.toString().includes(this.searchQuery);
                const matchesPromotionType = this.selectedPromotionType.length === 0 || this.selectedPromotionType.includes(program.promotion_type_id);
                return matchesSearch && matchesPromotionType;
            });
            this.currentPage = 1;
            this.filteredProgram = filtered;
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

            this.filteredProgram = this.programs.filter((program) => {
                const matchesSearch = program.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    program.id.toString().includes(this.searchQuery);
                const matchesPromotionType = this.selectedPromotionType.length === 0 || this.selectedPromotionType.includes(program.promotion_type_id);
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

            this.programs.sort((a, b) => {
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
            this.programs.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
            this.updatePage();
        },

        toggleFiltterDropdown() {
            this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
        },
        applyFilter() {
            if (this.selectedPromotionType.length > 0) {
                this.filteredProgram = this.programs.filter(program =>
                    this.selectedPromotionType.includes(program.promotion_type_id)
                );
            } else {
                this.filteredProgram = this.programs;
            }
            this.isFilterDropdownOpen = false;
            this.updatePage();
        },
        clearFilter() {
            this.selectedPromotionType = [];
            this.filteredProgram = this.programs;
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

        getPromotionTypeName(promotion_type_id) {
            const type = this.promotion_types.find(type => type.id === promotion_type_id);
            return type ? type.name : 'ไม่พบข้อมูล';
        },

        openEditModal(program) {
            this.selectedProgram = { ...program };
            this.isEditModalOpen = true;
        },
        async saveChanges() {
            try {
                if (!this.selectedProgram.name || !this.selectedProgram.promotion_type_id) {
                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }

                const response = await axios.put(`http://127.0.0.1:3333/programs/${this.selectedProgram.id}`, {
                    name: this.selectedProgram.name,
                    promotion_type_id: this.selectedProgram.promotion_type_id,
                });

                console.log("Program updated:", response.data);

                const index = this.programs.findIndex(pro => pro.id === this.selectedProgram.id);
                if (index !== -1) {
                    this.programs[index] = response.data;  // แทนที่ข้อมูลเดิมด้วยข้อมูลที่อัปเดตแล้ว
                }
                this.isEditModalOpen = false;
                this.updatePage();
            } catch (error) {
                console.error('Error saving changes:', error);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedProgram = {};
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
                await axios.delete(`http://127.0.0.1:3333/programs/${this.itemToDelete}`);
                this.programs = this.programs.filter(
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
            this.resetNewProgram();
        },
        resetNewProgram() {
            this.newProgram = {
                name: "",
                promotion_type_id: "",
            };
        },
        async addProgram() {
            if (!this.newProgram.name || !this.newProgram.promotion_type_id) {
                alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                return;
            }
            try {
                const response = await axios.post('http://127.0.0.1:3333/programs', {
                    name: this.newProgram.name,
                    promotion_type_id: this.newProgram.promotion_type_id,
                });
                console.log("Added Program:", response.data);

                this.programs.push(response.data);
                this.closeAddModal();
                this.updatePage();
            } catch (error) {
                console.error("Error adding program:", error);
                alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
            }
        },

        async fetchPromotionTypes() {
            try {
                const response = await axios.get('http://127.0.0.1:3333/promotion-types');
                this.promotion_types = response.data;
            } catch (error) {
                console.error("Error fetching promotion types:", error);
            }
        },


    },
    created() {
        this.filteredProgram = this.programs;
        this.sortData('id');
        this.fetchPrograms();
        this.fetchPromotionTypes();
        this.updatePage();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchPrograms();
        this.fetchPromotionTypes();
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