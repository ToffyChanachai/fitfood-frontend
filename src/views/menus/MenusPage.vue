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

    <div class="mt-[-20px]">

        <div class="flex space-x-2 items-center relative">
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <!-- <span class="material-symbols-outlined text-2xl text-gray-700">person</span> -->
                <span class="text-m text-gray-700">จำนวนเมนูทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ menus.length }} รายการ</span>
            </div>

            <button v-if="selectedMealType.length > 0" @click="clearFilter"
                class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
                <span class="material-symbols-outlined">close</span>
                <span class="ml-2">รีเซ็ตตัวกรอง ({{ selectedMealType.length }})</span>
            </button>

            <div class="add relative inline-block">
                <button @click="openAddModal"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
                    <span class="text-white text-base leading-none">เพิ่ม</span>
                </button>

                <div v-if="isAddModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">

                    <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
                        :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
                        <span class="material-symbols-outlined text-white">error</span>
                        <span>{{ toastErrorMessage }}</span>
                        <button @click="showErrorToast = false"
                            class="text-white hover:text-gray-200 focus:outline-none">
                            <span class="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">

                        <!-- Header -->
                        <div
                            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <h2 class="text-xl font-bold">เพิ่มเมนู</h2>
                            <span @click="closeAddModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">close</span>
                        </div>

                        <!-- Content -->
                        <div class="p-6 space-y-4">

                            <div>
                                <label for="Image" class="block text-gray-700 font-bold">เลือกรูปภาพ</label>
                                <div class="flex items-center space-x-4 w-full">
                                    <!-- รูปภาพตัวอย่าง -->
                                    <div v-if="previewImage || newMenu.image" class="flex-shrink-0">
                                        <img :src="previewImage || `${API_URL}/images/${newMenu.image}`"
                                            alt="Menu Image" class="max-w-48 max-h-48 object-contain rounded border">
                                    </div>

                                    <!-- Input อัปโหลดไฟล์ -->
                                    <div class="w-full">
                                        <input id="Image" type="file" @change="onFileChange"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>
                                </div>

                            </div>

                            <!-- รหัสเมนู -->
                            <div>
                                <label for="menuCode" class="block font-bold text-gray-700">รหัสเมนู</label>
                                <input id="menuCode" v-model="newMenu.menu_code" type="text" placeholder="กรอกรหัสเมนู"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <!-- ชื่อเมนูภาษาอังกฤษ -->
                            <div>
                                <label for="nameEnglish"
                                    class="block font-bold text-gray-700">ชื่อเมนูภาษาอังกฤษ</label>
                                <input id="nameEnglish" v-model="newMenu.name_english" type="text"
                                    placeholder="กรอกชื่อเมนูภาษาอังกฤษ"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <!-- ชื่อเมนูภาษาไทย -->
                            <div>
                                <label for="nameThai" class="block font-bold text-gray-700">ชื่อเมนูภาษาไทย</label>
                                <input id="nameThai" v-model="newMenu.name_thai" type="text"
                                    placeholder="กรอกชื่อเมนูภาษาไทย"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <div>
                                <label for="promotionType" class="block font-bold text-gray-700">ประเภทเมนู</label>
                                <multiselect v-model="newMenu.meal_type_id" :options="meal_types.map(item => ({
                                    id: item.id,
                                    name: `${item.name} (${item.menuType ? item.menuType.name : 'ไม่มีข้อมูล'})`
                                }))" :multiple="false" :searchable="true" :close-on-select="true"
                                    placeholder="เลือกประเภทเมนู" label="name" track-by="id" class="z-50" />
                            </div>

                            <div class="flex space-x-4">
                                <!-- แคลอรี่ -->
                                <div class="flex-1">
                                    <label for="cal" class="block font-bold text-gray-700">แคลอรี่</label>
                                    <input id="cal" v-model="newMenu.cal" type="number" placeholder="กรอกแคลอรี่"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- โปรตีน -->
                                <div class="flex-1">
                                    <label for="protein" class="block font-bold text-gray-700">โปรตีน</label>
                                    <input id="protein" v-model="newMenu.protein" type="number" placeholder="กรอกโปรตีน"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- ไขมัน -->
                                <div class="flex-1">
                                    <label for="fat" class="block font-bold text-gray-700">ไขมัน</label>
                                    <input id="fat" v-model="newMenu.fat" type="number" placeholder="กรอกไขมัน"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- คาร์โบไฮเดรต -->
                                <div class="flex-1">
                                    <label for="carb" class="block font-bold text-gray-700">คาร์โบไฮเดรต</label>
                                    <input id="carb" v-model="newMenu.carb" type="number" placeholder="กรอกคาร์โบไฮเดรต"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>


                        </div>

                        <!-- Footer -->
                        <div class="flex justify-between space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                            <li @click="resetNewMenu"
                                class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                                <span>รีเซ็ตข้อมูล</span>
                            </li>
                            <div class="flex space-x-2">
                                <button @click="closeAddModal"
                                    class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                                    ยกเลิก
                                </button>
                                <button @click="addMenu"
                                    class="px-4 py-2 rounded bg-custom-orange text-white hover:bg-custom-orange-hover">
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sort relative inline-block" ref="sortDropdown">
                <button @click="toggleSortDropdown"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">sort</span>
                    <span class="text-white text-base leading-none">จัดเรียง</span>
                    <span :class="{ 'rotate-180': isSortDropdownOpen }"
                        class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto duration-300">arrow_drop_down</span>
                </button>

                <div v-if="isSortDropdownOpen"
                    class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-64 z-50 border border-gray-300">
                    <ul class="list-none p-0 m-0">
                        <li @click="sortData('id')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามลำดับ</span>
                            <span v-if="sortColumn === 'id'" class="material-symbols-outlined text-sm">
                                {{ sortDirection['id'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
                            </span>
                        </li>

                        <li @click="sortData('name_english')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามชื่อภาษาอังกฤษ</span>
                            <span v-if="sortColumn === 'name_english'" class="material-symbols-outlined text-sm">
                                {{ sortDirection['name_english'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
                            </span>
                        </li>

                        <li @click="sortData('name_thai')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามชื่อภาษาไทย</span>
                            <span v-if="sortColumn === 'name_thai'" class="material-symbols-outlined text-sm">
                                {{ sortDirection['name_thai'] === 1 ? 'arrow_upward' : 'arrow_downward' }}
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
                    <div class="p-4 w-[500px] h-auto max-h-[400px] overflow-y-auto flex-grow list-none">
                        <h3 class="font-bold mb-2">กรองโดยประเภทเมนู</h3>
                        <div v-for="(types, menuType) in groupedMealTypes" :key="menuType" class="mb-4">
                            <div class="flex justify-between items-center">
                                <h4 class="font-semibold mb-2 text-custom-orange">{{ menuType }}</h4>
                                <button @click="toggleSelectMenuTypeAll(menuType)"
                                    class="text-custom-orange hover:text-custom-orange-hover text-sm">
                                    {{ selectAllMenuTypeState[menuType] ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด' }}
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <label v-for="type in types" :key="type.id" class="flex items-center space-x-2">
                                    <!-- Custom checkbox -->
                                    <input type="checkbox" v-model="selectedMealType" :value="type.id"
                                        class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-custom-orange checked:border-transparent flex-shrink-0">
                                    <span class="break-words">{{ type.name }}</span>
                                </label>
                            </div>
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
                <tr v-for="(menu, index) in filteredMenu" :key="index"
                    class=" bg-white relative border-b border-b-gray-200">
                    <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <!-- <td class="px-4 py-2 align-top text-center">
                        <img v-if="menu.image" :src="`${API_URL}/images/${menu.image}`" alt="Menu Image"
                            class="w-16 h-16 object-cover rounded">
                        <span v-else>ไม่มีรูปภาพ</span>
                    </td> -->

                    <td class="px-4 py-2 align-top font-bold text-custom-orange pb-5">{{ menu.name_english }}</td>
                    <td class="px-4 py-2 align-top font-bold pb-5">{{ menu.name_thai }}</td>
                    <td class="px-4 py-2 align-top pb-5">
                        {{ getMealTypeName(menu.meal_type_id) }}
                        <span v-if="menu.mealType && menu.mealType.menuType">
                            ({{ menu.mealType.menuType.name }})
                        </span>
                        <span v-else>
                            (ไม่มีข้อมูล)
                        </span>
                    </td>
                    <td class="px-4 py-2 align-top pb-5">{{ menu.cal }}</td>
                    <td class="px-4 py-2 align-top pb-5">{{ menu.protein }}</td>
                    <td class="px-4 py-2 align-top pb-5">{{ menu.fat }}</td>
                    <td class="px-4 py-2 align-top pb-5">{{ menu.carb }}</td>
                    <td class="px-4 py-2 align-top text-right pb-5">
                        <div class="flex justify-end space-x-2">
                            <button @click="openEditModal(menu)"
                                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">edit_square</span>
                                <span>แก้ไข</span>
                            </button>
                            <button @click="confirmDelete(menu.id)"
                                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">delete</span>
                                <span>ลบ</span>
                            </button>

                        </div>

                    </td>
                </tr>

                <tr v-if="filteredMenu.length === 0">
                    <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">
                        ไม่พบข้อมูล
                    </td>
                </tr>
            </tbody>

            <div v-if="isEditModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">

                <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
                    :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
                    <span class="material-symbols-outlined text-white">error</span>
                    <span>{{ toastErrorMessage }}</span>
                    <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">แก้ไขเมนู</span>
                        <div class="flex space-x-2">
                            <span @click="closeEditModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">close</span>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">

                        <div class="mb-4">
                            <label for="editImage" class="block text-gray-700 font-bold">เลือกรูปภาพ</label>
                            <div v-if="selectedMenu.image || previewImage" class="mb-2 flex items-center space-x-4">
                                <!-- ใช้ object-contain เพื่อให้รูปภาพพอดีกับขนาด -->
                                <img :src="previewImage || `${API_URL}/images/${selectedMenu.image}`"
                                    alt="Menu Image" class="max-w-48 max-h-48 object-contain rounded border">

                                <input id="editImage" type="file" @change="onFileChange"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                            <!-- ถ้ายังไม่มีรูปภาพให้แสดง input -->
                            <div v-else>
                                <input id="editImage" type="file" @change="onFileChange"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                            <!-- แสดงชื่อไฟล์เก่าจากฐานข้อมูล -->
                            <div v-if="selectedMenu.image" class="mt-2 text-sm text-gray-500">
                                ชื่อไฟล์ปัจจุบัน: {{ selectedMenu.image }}
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="editMenuCode" class="block text-gray-700 font-bold">รหัสเมนู</label>
                            <input v-model="selectedMenu.menu_code" id="editMenuCode" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>

                        <div class="mb-4">
                            <label for="editNameEnglish"
                                class="block text-gray-700 font-bold">ชื่อเมนูภาษาอังกฤษ</label>
                            <input v-model="selectedMenu.name_english" id="editNameEnglish" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>

                        <div class="mb-4">
                            <label for="editNameThai" class="block text-gray-700 font-bold">ชื่อเมนูภาษาไทย</label>
                            <input v-model="selectedMenu.name_thai" id="editNameThai" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>

                        <div class="mb-4">
                            <label for="editPromotionType" class="block font-bold text-gray-700">ประเภทเมนู</label>
                            <multiselect v-model="selectedMenu.meal_type_id" :options="meal_types.map(item => ({
                                id: item.id,
                                name: `${item.name} (${item.menuType ? item.menuType.name : 'ไม่มีข้อมูล'})`
                            }))" :track-by="'id'" :label="'name'" placeholder="เลือกประเภทเมนู" :multiple="false"
                                :searchable="true" :close-on-select="true" class="z-50" />
                        </div>


                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editCal" class="block font-bold text-gray-700">แคลอรี่</label>
                                <input id="editCal" v-model="selectedMenu.cal" type="number" placeholder="กรอกแคลอรี่"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <div class="flex-1">
                                <label for="editProtein" class="block font-bold text-gray-700">โปรตีน</label>
                                <input id="editProtein" v-model="selectedMenu.protein" type="number"
                                    placeholder="กรอกโปรตีน"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <div class="flex-1">
                                <label for="editFat" class="block font-bold text-gray-700">ไขมัน</label>
                                <input id="editFat" v-model="selectedMenu.fat" type="number" placeholder="กรอกไขมัน"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <div class="flex-1">
                                <label for="editCarb" class="block font-bold text-gray-700">คาร์โบไฮเดรต</label>
                                <input id="editCarb" v-model="selectedMenu.carb" type="number"
                                    placeholder="กรอกคาร์โบไฮเดรต"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                        <div class="flex space-x-2">
                            <button @click="closeEditModal"
                                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                                ยกเลิก
                            </button>
                            <button @click="saveChanges"
                                class="px-4 py-2 rounded bg-custom-orange text-white hover:bg-custom-orange-hover">
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
                        <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                    </div>

                    <div class="flex justify-end space-x-2 p-4 border-t">
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

    </div>
</template>

<script>
import axios from 'axios';
import Multiselect from "vue-multiselect";
import { mapActions, mapGetters } from "vuex";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { API_URL } from "@/services/api";

export default {
    name: "menuPage",
    data() {
        return {
            headers: ['#', 'ชื่อเมนูภาษาอังกฤษ', 'ชื่อเมนูภาษาไทย', 'ประเภทโปรแกรมเมนู', 'แคลอรี่', 'โปรตีน', 'ไขมัน', 'คาร์โบไฮเดต', ''],
            headerWidths: ['5%', '25%', '20%', '15%', '5%', '5%', '5%', '10%', '10%'],

            searchQuery: "",
            selectedMealType: [],
            isFilterDropdownOpen: false,

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            menus: [],
            currentPage: 1,
            itemsPerPage: 10,

            // selectedMenu: {},
            isEditModalOpen: false,

            isAddModalOpen: false,
            newMenu: {
                menu_code: "",
                name_english: "",
                name_thai: "",
                meal_type_id: "",
                cal: 0,
                protein: 0,
                fat: 0,
                carb: 0,
                image: '',
            },
            selectedMenu: {
                id: '',
                menu_code: "",
                name_english: "",
                name_thai: "",
                meal_type_id: "",
                cal: 0,
                protein: 0,
                fat: 0,
                carb: 0,
                image: '',
                imageFile: null,
            },
            previewImage: '',

            meal_types: [],

            toastSuccessMessage: "",
            showSuccessToast: false,
            toastFailMessage: "",
            showFailToast: false,
            showErrorToast: false,
            toastErrorMessage: "",

            isDeleteModalOpen: false,
            itemToDelete: null,

            selectAllMenuTypeState: {},
        };
    },
    components: {
        Multiselect
    },
    computed: {
        totalPages() {
            return Math.ceil(
                this.menus.filter((menu) => {
                    const matchesSearch = menu.name_english.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        menu.name_thai.toLowerCase().includes(this.searchQuery.toLowerCase());
                    const matchesPromotionType = this.selectedMealType.length === 0 || this.selectedMealType.includes(menu.meal_type_id);
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
        groupedMealTypes() {
            return this.meal_types.reduce((groups, type) => {
                const menuTypeName = type.menuType ? type.menuType.name : 'ไม่มีข้อมูล';
                if (!groups[menuTypeName]) {
                    groups[menuTypeName] = [];
                }
                groups[menuTypeName].push(type);
                return groups;
            }, {});
        },
        filteredMenu() {
            const filtered = this.menus.filter((menu) => {
                const matchesSearch = menu.name_english.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    menu.name_thai.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesPromotionType = this.selectedMealType.length === 0 || this.selectedMealType.includes(menu.meal_type_id);
                return matchesSearch && matchesPromotionType;
            });
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return filtered.slice(startIndex, endIndex);
        },

        ...mapGetters(["menus"]),
    },
    methods: {
        ...mapActions(["fetchMealTypes", "fetchMenus"]),

        async fetchMenus() {
            try {
                const response = await axios.get('${API_URL}/menus');
                this.menus = response.data;
                this.menus.sort((a, b) => a.id - b.id);
            } catch (error) {
                // console.error("Error fetching menu:", error);
            }
        },
        search() {
            this.currentPage = 1;
        },
        clearSearch() {
            this.searchQuery = "";
            this.currentPage = 1;
        },

        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedMenu.imageFile = file;  // กำหนดให้กับ imageFile
                this.previewImage = URL.createObjectURL(file); // อัพเดต URL สำหรับแสดงตัวอย่าง
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

            this.menus.sort((a, b) => {
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
            this.menus.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
        },

        toggleFiltterDropdown() {
            this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
        },
        applyFilter() {

            this.currentPage = 1;

            if (this.selectedMealType.length > 0) {
                this.filteredMenu = this.menus.filter(menu =>
                    this.selectedMealType.includes(menu.meal_type_id)
                );
            } else {
                this.filteredMenu = this.menus;
            }
            this.isFilterDropdownOpen = false;
            this.currentPage = 1;
        },
        toggleSelectMenuTypeAll(menuType) {
            if (this.selectAllMenuTypeState[menuType]) {
                this.selectedMealType = this.selectedMealType.filter(id => !this.groupedMealTypes[menuType].some(type => type.id === id));
            } else {
                const mealTypeIds = this.groupedMealTypes[menuType].map(type => type.id);
                this.selectedMealType = [...new Set([...this.selectedMealType, ...mealTypeIds])];
            }
            this.selectAllMenuTypeState[menuType] = !this.selectAllMenuTypeState[menuType];
        },
        clearFilter() {
            this.selectedMealType = [];
            this.filteredMenu = this.menus;
            Object.keys(this.selectAllMenuTypeState).forEach(key => {
                this.selectAllMenuTypeState[key] = false;
            });
            this.applyFilter();
        },

        handleClickOutside(event) {
            if (this.$refs.sortDropdown && !this.$refs.sortDropdown.contains(event.target)) {
                this.isSortDropdownOpen = false;
            }
            if (this.$refs.filterDropdown && !this.$refs.filterDropdown.contains(event.target)) {
                this.isFilterDropdownOpen = false;
            }
        },

        getMealTypeName(meal_type_id) {
            const type = this.meal_types.find(type => type.id === meal_type_id);
            return type ? type.name : 'ไม่พบข้อมูล';
        },

        openEditModal(menu) {
            const mealType = this.meal_types.find((type) => type.id === menu.meal_type_id);
            this.selectedMenu = {
                ...menu,
                meal_type_id: mealType
                    ? {
                        id: mealType.id,
                        name: `${mealType.name} (${mealType.menuType ? mealType.menuType.name : 'ไม่มีข้อมูล'})`,
                    }
                    : null,
            };
            this.isEditModalOpen = true;
        },
        async saveChanges() {
            try {
                if (!this.selectedMenu.name_english || !this.selectedMenu.name_thai || !this.selectedMenu.meal_type_id) {
                    this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
                    return;
                }

                const formData = new FormData();
                formData.append("menu_code", this.selectedMenu.menu_code);
                formData.append("name_english", this.selectedMenu.name_english);
                formData.append("name_thai", this.selectedMenu.name_thai);
                formData.append("meal_type_id", this.selectedMenu.meal_type_id.id);
                formData.append("cal", this.selectedMenu.cal);
                formData.append("protein", this.selectedMenu.protein);
                formData.append("fat", this.selectedMenu.fat);
                formData.append("carb", this.selectedMenu.carb);

                if (this.selectedMenu.imageFile) {
                    formData.append("image", this.selectedMenu.imageFile);
                }

                const response = await axios.put(`${API_URL}/menus/${this.selectedMenu.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const index = this.menus.findIndex(menu => menu.id === this.selectedMenu.id);
                if (index !== -1) {
                    this.menus[index] = {
                        ...response.data,
                        mealType: this.meal_types.find(mt => mt.id === response.data.meal_type_id) || {},
                    };
                }

                this.isEditModalOpen = false;
                await this.fetchMenus();
                this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
            } catch (error) {
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการแก้ไขข้อมูล!");
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedMenu = {};
            this.previewImage = null;
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
                await axios.delete(`${API_URL}/menus/${this.itemToDelete}`);
                this.menus = this.menus.filter(
                    (item) => item.id !== this.itemToDelete
                );
                this.closeDeleteModal();
                await this.fetchMenus();
                this.showFailToastNotification("ลบข้อมูลสำเร็จ!");
            } catch (error) {
                console.error("Error deleting item:", error);
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการลบข้อมูล!");
            }
        },

        openAddModal() {
            this.isAddModalOpen = true;
        },
        closeAddModal() {
            this.isAddModalOpen = false;
            this.resetNewMenu();
        },
        resetNewMenu() {
            this.newMenu = {
                menu_code: "",
                name_english: "",
                name_thai: "",
                meal_type_id: "",
                cal: 0,
                protein: 0,
                fat: 0,
                carb: 0,
                image: '',
                imageFile: null,
            };
            this.previewImage = null;
        },
        async addMenu() {
            if (!this.newMenu.name_english || !this.newMenu.name_thai || !this.newMenu.meal_type_id) {
                this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบ!");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("menu_code", this.newMenu.menu_code);
                formData.append("name_english", this.newMenu.name_english);
                formData.append("name_thai", this.newMenu.name_thai);
                formData.append("meal_type_id", this.newMenu.meal_type_id.id);
                formData.append("cal", this.newMenu.cal);
                formData.append("protein", this.newMenu.protein);
                formData.append("fat", this.newMenu.fat);
                formData.append("carb", this.newMenu.carb);

                // ถ้ามีการเลือกไฟล์รูปภาพ
                if (this.newMenu.imageFile) {
                    formData.append("image", this.newMenu.imageFile);
                }

                const response = await axios.post('${API_URL}/menus', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data && response.data.mealType && response.data.mealType.menuType) {
                    this.menus.push(response.data);
                }

                this.closeAddModal();
                await this.fetchMenus();
                this.showSuccessToastNotification("เพิ่มข้อมูลสำเร็จ!");
            } catch (error) {
                console.error("Error adding menu:", error);
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
            }
        },

        async fetchMealTypes() {
            try {
                const response = await axios.get('${API_URL}/meal-types');
                this.meal_types = response.data;
            } catch (error) {
                console.error("Error fetching promotion types:", error);
            }
        },

        getMenuThaiName(menuId) {
            const menu = this.menus.find((m) => m.id === menuId);
            return menu ? menu.name_thai : " ";
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
        this.sortData('id');
        this.fetchMenus();
        this.fetchMealTypes();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchMenus();
        this.fetchMealTypes();
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },


};
</script>


<style>
.multiselect__option--highlight {
    background-color: #f3f4f6;
    color: #000000;
}

.multiselect__option--selected:hover {
    background-color: #f3f4f6;
    color: #000000;
}
</style>