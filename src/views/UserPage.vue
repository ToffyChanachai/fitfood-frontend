<template>
    <div class="fixed top-4 right-8 bg-green-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
        :class="{ 'opacity-100': showSuccessToast, 'opacity-0': !showSuccessToast }">
        <span class="material-symbols-outlined text-white">check_circle</span>
        <span>{{ toastSuccessMessage }}</span>
        <button @click="showSuccessToast = false" class="text-white hover:text-gray-200 focus:outline-none">
            <span class="material-symbols-outlined text-xl">close</span>
        </button>
    </div>

    <div class="fixed top-4 right-8 bg-red-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
        :class="{ 'opacity-100': showFailToast, 'opacity-0': !showFailToast }">
        <span class="material-symbols-outlined text-white">cancel</span>
        <span>{{ toastFailMessage }}</span>
        <button @click="showFailToast = false" class="text-white hover:text-gray-200 focus:outline-none">
            <span class="material-symbols-outlined text-xl">close</span>
        </button>
    </div>

    <div class="flex space-x-2 items-center relative">
        <div class="px-4 flex items-center space-x-1 mr-auto ">
            <span class="material-symbols-outlined text-2xl text-gray-700">account_circle</span>
            <span class="text-m text-gray-700">จำนวนผู้ใช้งานทั้งหมด: </span>
            <span class="text-m text-custom-orange font-bold"> {{ users.length }} ผู้ใช้งาน</span>
        </div>

        <button v-if="selectedUser.length > 0" @click="clearFilter"
            class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
            <span class="material-symbols-outlined">close</span>
            <span class="ml-2">
                รีเซ็ตตัวกรอง
                <template v-if="selectedUser.length > 0">
                    ({{ selectedUser.length }})
                </template>
            </span>
        </button>

        <div class="sort relative inline-block" ref="sortDropdown">
            <button @click="toggleSortDropdown"
                class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                <span class="material-symbols-outlined text-white text-xl leading-none">sort</span>
                <span class="text-white text-base leading-none">จัดเรียง</span>
                <span :class="{ 'rotate-180': isSortDropdownOpen }"
                    class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto transition-transform duration-300">arrow_drop_down</span>
            </button>

            <div v-if="isSortDropdownOpen"
                class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-48 z-50 border border-gray-300">
                <ul class="list-none p-0 m-0">
                    <li @click="sortData('id')"
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                        <span>จัดเรียงตามลำดับ</span>
                        <span v-if="sortColumn === 'id'" class="material-symbols-outlined text-sm">
                            {{ sortDirection['id'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
                        </span>
                    </li>
                    <li @click="sortData('username')"
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                        <span>จัดเรียงตามชื่อ</span>
                        <span v-if="sortColumn === 'username'" class="material-symbols-outlined text-sm">
                            {{ sortDirection['username'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
                        </span>
                    </li>
                    <li @click="clearSort"
                        class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-right border-t hover:underline">
                        <span>รีเซ็ตจัดเรียง</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="filter relative inline-block" ref="filterDropdown">
            <button @click="toggleFiltterDropdown"
                class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                <span class="material-symbols-outlined text-white text-xl leading-none">filter_alt</span>
                <span class="text-white text-base leading-none">ตัวกรอง</span>
                <span :class="{ 'rotate-180': isFilterDropdownOpen }"
                    class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto duration-300">arrow_drop_down</span>
            </button>

            <div v-if="isFilterDropdownOpen"
                class="absolute right-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md overflow-y-auto z-50 border border-gray-300">
                <div class="p-4 w-[500px] list-none">
                    <h3 class="font-bold mb-2">กรองโดย Role</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <label v-for="role in uniqueRoles" :key="role" class="flex items-center space-x-2">
                            <input type="checkbox" v-model="selectedUser" :value="role"
                                class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-custom-orange checked:border-transparent">
                            <span>{{ getRoleText(role) }}</span>
                        </label>
                    </div>


                </div>
                <div class="flex justify-between space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                    <li @click="clearFilter"
                        class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                        <span>รีเซ็ตตัวกรอง</span>
                    </li>

                    <div class="flex space-x-2">
                        <button @click="toggleFiltterDropdown"
                            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                            ยกเลิก
                        </button>
                        <button @click="applyFilter"
                            class="bg-custom-orange hover:bg-custom-orange-hover text-white px-4 py-2 rounded-md">
                            ใช้ตัวกรอง
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex w-[250px] relative">
            <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
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

    <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
        <thead>
            <tr class="bg-custom-orange text-white">
                <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
                    :style="{ width: headerWidths[index] }">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="isLoading" class="bg-white">
                <td colspan="10" class="py-16 text-center">
                    <div class="flex justify-center items-center space-x-2">
                        <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                        <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                        <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-400"></div>
                    </div>
                </td>
            </tr>

            <template v-else>
                <template v-if="filteredUser.length > 0">
                    <tr v-for="(user, index) in filteredUser" :key="index"
                        class=" bg-white relative border-b border-b-gray-200">
                        <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                        <td class="px-4 py-2 align-top font-bold text-custom-orange pb-5">{{ user.username }}</td>
                        <td class="px-4 py-2 align-top pb-5">{{ user.firstname }} {{ user.lastname }}</td>
                        <td class="px-4 py-2 align-top pb-5">{{ user.email }}</td>

                        <td class="px-4 py-2 align-top font-bold pb-5">
                            <button @click="openChangeRoleModal(user)"
                                class="px-4 py-1 rounded-full font-bold focus:outline-none hover:text-gray-200"
                                :class="getRoleClass(user.role)">
                                {{ getRoleText(user.role) }}
                            </button>

                            <div v-if="isChangeRoleModalOpen"
                                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-10 z-50">

                                <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg transition-opacity duration-300 z-60"
                                    :class="{
                                        'opacity-100': showErrorToast,
                                        'opacity-0': !showErrorToast,
                                    }">
                                    <span class="material-symbols-outlined text-white">error</span>
                                    <span>{{ toastErrorMessage }}</span>
                                    <button @click="showErrorToast = false"
                                        class="text-white hover:text-gray-200 focus:outline-none">
                                        <span class="material-symbols-outlined text-xl">close</span>
                                    </button>
                                </div>

                                <div class="bg-white rounded-md w-1/3 max-w-lg">
                                    <div :class="{
                                        'bg-green-500':
                                            selectedUserRole.role === 'admin',
                                        'bg-yellow-500': selectedUserRole.role === 'customer',
                                    }" class="flex justify-between items-center text-white px-4 py-2 rounded-t-md">
                                        <span class="font-bold">
                                            {{
                                                selectedUserRole.role === "customer"
                                                    ? `เปลี่ยน Role เป็น "แอดมิน"`
                                                    : `เปลี่ยน Role เป็น "ผู้ใช้งานทั่วไป"`
                                            }}
                                        </span>
                                        <button @click="closeChangeRoleModal" class="text-white hover:text-gray-200">
                                            <span class="material-symbols-outlined">close</span>
                                        </button>
                                    </div>

                                    <div class="p-6 space-y-4">
                                        <p class="text-gray-700">
                                            {{
                                                selectedUserRole.role === "customer"
                                                    ? 'คุณต้องการเปลี่ยน Role เป็น "แอดมิน" หรือไม่?'
                                                    : 'คุณต้องการเปลี่ยน Role เป็น "ผู้ใช้งานทั่วไป" หรือไม่?'
                                            }}
                                        </p>
                                    </div>

                                    <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md">
                                        <button @click="closeChangeRoleModal"
                                            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                            ยกเลิก
                                        </button>
                                        <button @click="confirmPayment" :class="{
                                            'bg-green-500 hover:bg-green-600':
                                                selectedUserRole.role === 'admin',
                                            'bg-yellow-500 hover:bg-yellow-600':
                                                selectedUserRole.role === 'customer',
                                        }" class="text-white px-4 py-2 rounded">
                                            ยืนยัน
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>

                        <td class="px-4 py-2 align-top text-right pb-5">
                            <div class="flex justify-end space-x-2">
                                <button @click="confirmDelete(user.id)"
                                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                                    <span class="material-symbols-outlined">delete</span>
                                    <span>ลบ</span>
                                </button>
                            </div>

                        </td>
                    </tr>
                </template>

                <template v-if="filteredUser.length === 0">
                    <tr>
                        <td colspan="5" class="py-10 bg-white text-center text-gray-500 font-bold">
                            ไม่พบข้อมูล
                        </td>
                    </tr>
                </template>
            </template>
        </tbody>

        <div v-if="isDeleteModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">

            <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
                :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
                <span class="material-symbols-outlined text-white">error</span>
                <span>{{ toastErrorMessage }}</span>
                <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
                    <span class="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            <div class="bg-white rounded-lg shadow-md w-1/3">
                <div class="flex justify-between items-center bg-red-500 text-white px-4 py-2 rounded-t">
                    <h2 class="text-lg font-bold">ยืนยันการลบ</h2>
                    <span @click="closeDeleteModal"
                        class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                        close
                    </span>
                </div>
                <div class="p-4">
                    <p>
                        คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?
                        การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </p>
                </div>

                <div class="flex justify-end space-x-2 p-4 border-t">
                    <button @click="closeDeleteModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        ยกเลิก
                    </button>
                    <button @click="deleteConfirmed" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>

    </table>
    <div class="rounded-b-2xl flex justify-center items-center space-x-2 bg-white px-2 py-1">
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
</template>

<script>
import axios from "axios";
import { API_URL } from "@/services/api";

export default {
    name: "UserPage",
    data() {
        return {
            headers: ['#', 'Username', "ชื่อ", 'Email', 'Role', ""],
            headerWidths: ['10%', '20%', '20%', '20%', '15%', '15%'],

            searchQuery: "",
            isFilterDropdownOpen: false,
            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            users: [],
            currentPage: 1,
            itemsPerPage: 10,

            isDetailModalOpen: false,
            moreOpenDropdownIndex: null,

            isEditModalOpen: false,
            isDeleteModalOpen: false,
            itemToDelete: null,
            selectedUserRole: [],

            toastSuccessMessage: "",
            showSuccessToast: false,
            toastFailMessage: "",
            showFailToast: false,
            showErrorToast: false,
            toastErrorMessage: "",
            selectedUser: [],

            isChangeRoleModalOpen: false,

        };
    },
    computed: {
        filteredUser() {
            const filtered = this.users.filter(user => {
                const name = user.username || '';
                const matchesSearch = name.toLowerCase().includes(this.searchQuery.toLowerCase());

                const matchesRole = this.selectedUser.length === 0 || this.selectedUser.includes(user.role);

                return matchesSearch && matchesRole;
            });

            // คำนวณ pagination
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;

            return filtered.slice(startIndex, endIndex);
        },

        totalPages() {
            const filtered = this.users.filter(user => {
                const name = user.username || '';
                const matchesSearch = name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesRole = this.selectedUser.length === 0 || this.selectedUser.includes(user.role);

                return matchesSearch && matchesRole;
            });

            return Math.ceil(filtered.length / this.itemsPerPage);
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

        uniqueRoles() {
            return [...new Set(this.users.map(user => user.role))];
        }

    },
    methods: {
        async fetchUsers() {
            this.isLoading = true;

            try {
                const response = await axios.get(`${API_URL}/users`);
                this.users = response.data;
                this.users.sort((a, b) => a.id - b.id);
            } catch (error) {
                // console.error("Error fetching users:", error);
            } finally {
                this.isLoading = false;
            }
        },
        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
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

            this.users.sort((a, b) => {
                const aValue = a[column];
                const bValue = b[column];
                if (aValue < bValue) return -this.sortDirection[column];
                if (aValue > bValue) return this.sortDirection[column];
                return 0;
            });

            this.currentPage = 1;
        },
        clearSort() {
            this.sortColumn = 'id';
            this.sortDirection.id = 1;
            this.users.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
        },

        toggleFiltterDropdown() {
            this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
        },
        applyFilter() {
            if (this.selectedUser.length > 0) {
                this.filteredUser = this.users.filter(user =>
                    this.selectedUser.includes(user.role) // กรองตาม role
                );
            } else {
                this.filteredUser = this.users;
            }
            this.isFilterDropdownOpen = false;
        },

        clearFilter() {
            this.selectedUser = [];
            this.filteredUser = this.users;
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
                await axios.delete(
                    `${API_URL}/users/${this.itemToDelete}`
                );
                this.users = this.users.filter((item) => item.id !== this.itemToDelete);
                this.closeDeleteModal();
                await this.fetchUsers();
                this.showFailToastNotification("ลบข้อมูลสำเร็จ!");
            } catch (error) {
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการลบข้อมูล!");
            }
        },

        openChangeRoleModal(user) {
            this.selectedUserRole = user;
            this.isChangeRoleModalOpen = true;
        },
        closeChangeRoleModal() {
            this.isChangeRoleModalOpen = false;
        },
        async confirmPayment() {
            try {
                if (!this.selectedUserRole) {
                    this.showErrorToastNotification("กรุณาเลือกผู้ใช้ที่ต้องการอัปเดต!");
                    return;
                }

                // เปลี่ยน role เป็นค่าตรงข้าม
                const newRole = this.selectedUserRole.role === "customer" ? "admin" : "customer";

                // ส่ง request ไปยัง backend
                const response = await axios.put(
                    `${API_URL}/users/${this.selectedUserRole.id}/role`,
                    { role: newRole }
                );

                if (response.status === 200) {
                    this.showSuccessToastNotification(`เปลี่ยน Role เป็น ${newRole} สำเร็จ!`);
                    this.selectedUserRole.role = newRole; // อัปเดต UI ทันที
                } else {
                    throw new Error("Unexpected response status");
                }
            } catch (error) {
                console.error("Error updating user role:", error);
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดต role!");
            }
            this.closeChangeRoleModal();
        },


        getRoleText(status) {
            return status === "admin" ? "แอดมิน" : "ผู้ใช้งานทั่วไป";
        },
        getRoleClass(status) {
            return status === "admin"
                ? "text-white bg-yellow-500"
                : "text-white bg-green-500";
        },

        showSuccessToastNotification(message) {
            this.toastSuccessMessage = message;
            this.showSuccessToast = true;
            setTimeout(() => {
                this.showSuccessToast = false;
            }, 3000);
        },
        showFailToastNotification(message) {
            this.toastFailMessage = message;
            this.showFailToast = true;
            setTimeout(() => {
                this.showFailToast = false;
            }, 3000);
        },
        showErrorToastNotification(message) {
            this.toastErrorMessage = message;
            this.showErrorToast = true;
            setTimeout(() => {
                this.showErrorToast = false;
            }, 3000);
        },

    },
    created() {
        this.fetchUsers();
        this.sortData('id');

    },
    mounted() {
        // document.addEventListener('click', this.handleClickOutside);
        this.fetchUsers();
    },
    // beforeUnmount() {
    //     document.removeEventListener('click', this.handleClickOutside);
    // },


};
</script>