<template>
    <div class="mt-[-20px]">
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
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <!-- <span class="material-symbols-outlined text-2xl text-gray-700">person</span> -->
                <span class="text-m text-gray-700">จำนวน Package ทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ packages.length }} รายการ</span>
            </div>

            <button v-if="selectedProgram.length > 0 || selectedMonthYear" @click="clearFilter"
                class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
                <span class="material-symbols-outlined">close</span>
                <span class="ml-2">
                    รีเซ็ตตัวกรอง
                    <template v-if="selectedProgram.length > 0">
                        ({{ selectedProgram.length }})
                    </template>
                    <template v-if="selectedMonthYear">
                        <span v-if="selectedProgram.length > 0">, </span>
                        {{ formattedStartDate(selectedMonthYear) }}
                    </template>
                </span>
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
                        <div
                            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <h2 class="font-bold">เพิ่ม Package</h2>
                            <span @click="closeAddModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>

                        <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                            <!-- Dropdown สำหรับ Promotion Type -->
                            <div>
                                <label for="promotionType" class="block font-bold text-gray-700">Promotion Type</label>
                                <multiselect v-model="selectedPromotionType" :options="promotion_types"
                                    :custom-label="customLabel" placeholder="เลือก Promotion Type" track-by="id"
                                    label="name" />
                            </div>

                            <!-- Dropdown สำหรับ Program -->
                            <div>
                                <label for="programType" class="block font-bold text-gray-700">Program</label>
                                <multiselect v-model="newPackage.program_id" :options="filteredPrograms" track-by="id"
                                    label="name" placeholder="เลือกประเภทโปรแกรม" />
                            </div>

                            <div>
                                <label for="packageName" class="block font-bold text-gray-700">Package</label>
                                <input id="packageName" v-model="newPackage.name" type="text"
                                    placeholder="กรอกชื่อแพ็คเกจ"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>



                            <div>
                                <label for="packageDetail" class="block font-bold text-gray-700">Package Details for
                                    Purchase Summary</label>
                                <textarea id="packageDetail" v-model="newPackage.package_detail"
                                    placeholder="กรอกรายละเอียดแพ็คเกจ" rows="3"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <!-- Package Validity -->
                                <div class="flex-1">
                                    <label for="packageValidity" class="block font-bold text-gray-700">Package
                                        Validity</label>
                                    <input id="packageValidity" v-model="newPackage.package_validity" type="number"
                                        step="1" min="0" placeholder="กรอก Package Validity"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Total Days -->
                                <div class="flex-1">
                                    <label for="totalDays" class="block font-bold text-gray-700">Total Days</label>
                                    <input id="totalDays" v-model="newPackage.total_days" type="number" step="1" min="0"
                                        placeholder="กรอก Total Days"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- # of Boxes/Day -->
                                <div class="flex-1">
                                    <label for="boxesPerDay" class="block font-bold text-gray-700"># of
                                        Boxes/Day</label>
                                    <input id="boxesPerDay" v-model="newPackage.boxes_per_day" type="number" step="1"
                                        min="0" placeholder="กรอก # of Boxes/Day"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Total Boxes -->
                                <div class="flex-1">
                                    <label for="totalBoxes" class="block font-bold text-gray-700">Total Boxes</label>
                                    <input id="totalBoxes" v-model="newPackage.total_boxes" type="number" step="1"
                                        min="0" placeholder="กรอก Total Boxes"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex gap-4">
                                <!-- ราคา -->
                                <div class="flex-1">
                                    <label for="packagePrice" class="block font-bold text-gray-700">ราคา</label>
                                    <input id="packagePrice" v-model="newPackage.price" type="number" step="1" min="0"
                                        placeholder="กรอกราคา"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <div class="flex-1">
                                    <label for="startMonth" class="block font-bold text-gray-700">เลือกเดือนเริ่มต้น
                                        (เฉพาะ Flash Sale)</label>
                                    <input id="startMonth" v-model="newPackage.start_date" type="month"
                                        placeholder="เลือกเดือนเริ่มต้น"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>


                            <div>
                                <label for="promotionDetail"
                                    class="block font-bold text-gray-700">รายละเอียดโปรโมชัน</label>
                                <textarea id="promotionDetail" v-model="newPackage.promotion_detail"
                                    placeholder="กรอกรายละเอียดโปรโมชัน" rows="3"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                            </div>

                            <div class="space-y-4 overflow-y-auto flex-grow">
                                <div class="flex flex-wrap gap-4">
                                    <!-- Free Mad -->
                                    <div class="flex-1">
                                        <label for="freeMad" class="block font-bold text-gray-700">Main Dish</label>
                                        <input id="freeMad" v-model="newPackage.free_mad" type="number" min="0" step="1"
                                            placeholder="กรอกจำนวน Main Dish"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>

                                    <!-- Free Dessert -->
                                    <div class="flex-1">
                                        <label for="freeDessert" class="block font-bold text-gray-700">Dessert</label>
                                        <input id="freeDessert" v-model="newPackage.free_dessert" type="number" min="0"
                                            step="1" placeholder="กรอกจำนวน Dessert"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>

                                    <!-- Free Brittles -->
                                    <div class="flex-1">
                                        <label for="freeBrittles" class="block font-bold text-gray-700">Brittles</label>
                                        <input id="freeBrittles" v-model="newPackage.free_brittles" type="number"
                                            min="0" step="1" placeholder="กรอกจำนวน Brittles"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>

                                    <!-- Free Energy Balls -->
                                    <div class="flex-1">
                                        <label for="freeEnergyBalls" class="block font-bold text-gray-700">Energy
                                            Balls</label>
                                        <input id="freeEnergyBalls" v-model="newPackage.free_energy_balls" type="number"
                                            min="0" step="1" placeholder="กรอกจำนวน Energy Balls"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-4">
                                    <!-- Free Dressing -->
                                    <div class="flex-1">
                                        <label for="freeDressing" class="block font-bold text-gray-700">Dressing</label>
                                        <input id="freeDressing" v-model="newPackage.free_dressing" type="number"
                                            min="0" step="1" placeholder="กรอกจำนวน Free Dressing"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>

                                    <!-- Free Yoghurt -->
                                    <div class="flex-1">
                                        <label for="freeYoghurt" class="block font-bold text-gray-700">Yoghurt</label>
                                        <input id="freeYoghurt" v-model="newPackage.free_yoghurt" type="number" min="0"
                                            step="1" placeholder="กรอกจำนวน Yoghurt"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>

                                    <!-- Free Granola -->
                                    <div class="flex-1">
                                        <label for="freeGranola" class="block font-bold text-gray-700">Granola</label>
                                        <input id="freeGranola" v-model="newPackage.free_granola" type="number" min="0"
                                            step="1" placeholder="กรอกจำนวน Granola"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="flex justify-between space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                            <li @click="clearAdd"
                                class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                                <span>รีเซ็ตข้อมูล</span>
                            </li>
                            <div class="flex space-x-2">
                                <button @click="closeAddModal"
                                    class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                                    ยกเลิก
                                </button>
                                <button @click="addPackage"
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
                    class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-48 z-50 border border-gray-300">
                    <ul class="list-none p-0 m-0">
                        <li @click="sortData('id')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามลำดับ</span>
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
                        <h3 class="font-bold mb-2">กรองโดย Program</h3>
                        <div v-for="(types, promotionType) in groupedPrograms" :key="promotionType" class="mb-4">
                            <div class="flex justify-between items-center">
                                <h4 class="font-semibold mb-2 text-custom-orange">{{ promotionType }}</h4>
                                <button @click="toggleSelectPromotionAll(promotionType)"
                                    class="text-custom-orange hover:text-custom-orange-hover text-sm">
                                    {{ selectAllProgramState[promotionType] ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด' }}
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <label v-for="program in types" :key="program.id" class="flex items-center space-x-2">
                                    <input type="checkbox" v-model="selectedProgram" :value="program.id"
                                        class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-custom-orange checked:border-transparent flex-shrink-0">
                                    <span class="break-words">{{ program.name }}</span>
                                </label>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="startMonth"
                                class="block font-semibold mb-2 text-custom-orange">กรองตามเดือนและปี</label>
                            <input id="startMonth" v-model="selectedMonthYear" type="month"
                                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
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
                <tr v-for="(packaged, index) in filteredPackage" :key="index"
                    class=" bg-white relative border-b border-b-gray-200">
                    <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td class="px-4 py-2 align-top pb-5"> {{ packaged.program && packaged.program.promotionType ?
                        packaged.program.promotionType.name : 'N/A' }}</td>
                    <td class="px-4 py-2 align-top pb-5">{{ getProgramName(packaged.program_id) }}</td>
                    <td class="px-4 py-2 align-top font-bold text-custom-orange pb-5">{{ packaged.name }}
                        <span v-if="packaged.start_date">( {{ formattedStartDate(packaged.start_date) }} )</span>
                    </td>
                    <td class="px-4 py-2 align-top pb-5">{{ packaged.package_validity }} วัน</td>
                    <td class="px-4 py-2 align-top pb-5">{{ packaged.total_days }} วัน</td>
                    <td class="px-4 py-2 align-top pb-5">{{ formatPrice(packaged.price) }} </td>
                    <td class="px-4 py-2 align-top text-right pb-5">
                        <div class="flex justify-end space-x-2 list-none">
                            <li @click="onViewDetails(packaged)"
                                class="px-2 py-1 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                                <span>ดูรายละเอียด</span>
                            </li>
                            <button @click="openEditModal(packaged)"
                                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">edit_square</span>
                                <span>แก้ไข</span>
                            </button>
                            <button @click="confirmDelete(packaged.id)"
                                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                                <span class="material-symbols-outlined">delete</span>
                                <span>ลบ</span>
                            </button>

                        </div>
                    </td>
                </tr>

                <tr v-if="filteredPackage.length === 0">
                    <td colspan="8" class="py-10 bg-white text-center text-gray-500 font-bold">
                        ไม่พบข้อมูล
                    </td>
                </tr>
            </tbody>

            <div v-if="isDetailModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">รายละเอียด Package</span>
                        <div class="flex space-x-2">
                            <span @click="closeDetailModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="p-6">
                        <div v-for="(value, key) in filteredDetail" :key="key" class="mb-2">
                            <p><strong>{{ formatLabel(key) }}:</strong> {{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>

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
                        <span class="font-bold">แก้ไข Package</span>
                        <div class="flex space-x-2">
                            <span @click="closeEditModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="p-6 space-y-4 overflow-y-auto flex-grow">

                        <div>
                            <label for="editPromotionType" class="block font-bold text-gray-700">Promotion Type</label>
                            <multiselect v-model="selectedPackage.program.promotionType" :options="promotion_types"
                                :custom-label="customLabel" placeholder="เลือก Promotion Type" track-by="id"
                                label="name" />
                        </div>


                        <div class="mb-4">
                            <label for="editProgramType" class="block font-bold text-gray-700">Program</label>
                            <multiselect v-model="selectedPackage.program_id" :options="filteredEditPrograms"
                                placeholder="เลือกประเภทโปรแกรม" track-by="id" label="name" class="w-full" />
                        </div>

                        <div class="mb-4">
                            <label for="editName" class="block text-gray-700 font-bold">Package</label>
                            <input v-model="selectedPackage.name" id="editName" type="text"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                        </div>


                        <div class="mb-4">
                            <label for="editPackageDetail" class="block text-gray-700 font-bold">Package Details for
                                Purchase
                                Summary</label>
                            <textarea id="editPackageDetail" v-model="selectedPackage.package_detail"
                                placeholder="กรอก Package Details for Purchase Summary" rows="3"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                        </div>

                        <div class="flex flex-wrap gap-4">
                            <!-- Package Validity -->
                            <div class="flex-1">
                                <label for="packageValidity" class="block font-bold text-gray-700">Package
                                    Validity</label>
                                <input id="packageValidity" v-model="selectedPackage.package_validity" type="number"
                                    step="1" min="0" placeholder="กรอก Package Validity"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <!-- Total Days -->
                            <div class="flex-1">
                                <label for="totalDays" class="block font-bold text-gray-700">Total Days</label>
                                <input id="totalDays" v-model="selectedPackage.total_days" type="number" step="1"
                                    min="0" placeholder="กรอก Total Days"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <!-- # of Boxes/Day -->
                            <div class="flex-1">
                                <label for="boxesPerDay" class="block font-bold text-gray-700"># of Boxes/Day</label>
                                <input id="boxesPerDay" v-model="selectedPackage.boxes_per_day" type="number" step="1"
                                    min="0" placeholder="กรอก # of Boxes/Day"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <!-- Total Boxes -->
                            <div class="flex-1">
                                <label for="totalBoxes" class="block font-bold text-gray-700">Total Boxes</label>
                                <input id="totalBoxes" v-model="selectedPackage.total_boxes" type="number" step="1"
                                    min="0" placeholder="กรอก Total Boxes"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <!-- ราคา -->
                            <div class="flex-1">
                                <label for="packagePrice" class="block font-bold text-gray-700">ราคา</label>
                                <input id="packagePrice" v-model="selectedPackage.price" type="number" step="1" min="0"
                                    placeholder="กรอกราคา"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <div class="flex-1">
                                <label for="startMonth" class="block font-bold text-gray-700">เลือกเดือนเริ่มต้น
                                    (เฉพาะ Flash Sale)</label>
                                <input id="startMonth" v-model="selectedPackage.start_date" type="month"
                                    placeholder="เลือกเดือนเริ่มต้น"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>


                        </div>

                        <div class="mb-4">
                            <label for="editPromotionDetail"
                                class="block text-gray-700 font-bold">รายละเอียดโปรโมชัน</label>
                            <textarea id="editPromotionDetail" v-model="selectedPackage.promotion_detail"
                                placeholder="กรอกรายละเอียดโปรโมชัน" rows="3"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                        </div>

                        <div class="space-y-4 overflow-y-auto flex-grow">
                            <div class="flex flex-wrap gap-4">
                                <!-- Free Mad -->
                                <div class="flex-1">
                                    <label for="freeMad" class="block font-bold text-gray-700">Main Dish</label>
                                    <input id="freeMad" v-model="selectedPackage.free_mad" type="number" min="0"
                                        step="1" placeholder="กรอกจำนวน Main Dish"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Dessert -->
                                <div class="flex-1">
                                    <label for="freeDessert" class="block font-bold text-gray-700">Dessert</label>
                                    <input id="freeDessert" v-model="selectedPackage.free_dessert" type="number" min="0"
                                        step="1" placeholder="กรอกจำนวน Dessert"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Brittles -->
                                <div class="flex-1">
                                    <label for="freeBrittles" class="block font-bold text-gray-700">Brittles</label>
                                    <input id="freeBrittles" v-model="selectedPackage.free_brittles" type="number"
                                        min="0" step="1" placeholder="กรอกจำนวน Brittles"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Energy Balls -->
                                <div class="flex-1">
                                    <label for="freeEnergyBalls" class="block font-bold text-gray-700">Energy
                                        Balls</label>
                                    <input id="freeEnergyBalls" v-model="selectedPackage.free_energy_balls"
                                        type="number" min="0" step="1" placeholder="กรอกจำนวน Energy Balls"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <!-- Free Dressing -->
                                <div class="flex-1">
                                    <label for="freeDressing" class="block font-bold text-gray-700">Dressing</label>
                                    <input id="freeDressing" v-model="selectedPackage.free_dressing" type="number"
                                        min="0" step="1" placeholder="กรอกจำนวน Free Dressing"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Yoghurt -->
                                <div class="flex-1">
                                    <label for="freeYoghurt" class="block font-bold text-gray-700">Yoghurt</label>
                                    <input id="freeYoghurt" v-model="selectedPackage.free_yoghurt" type="number" min="0"
                                        step="1" placeholder="กรอกจำนวน Yoghurt"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Granola -->
                                <div class="flex-1">
                                    <label for="freeGranola" class="block font-bold text-gray-700">Granola</label>
                                    <input id="freeGranola" v-model="selectedPackage.free_granola" type="number" min="0"
                                        step="1" placeholder="กรอกจำนวน Granola"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                        <div class="flex space-x-2">
                            <button @click="isEditModalOpen = false"
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
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

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
                    <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
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
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { API_URL } from "@/services/api";


export default {
    name: "PackagePage",
    data() {
        return {
            headers: ['#', 'Promotion Type', 'Program', 'Package', 'Package Validity', 'Total Days', 'ราคา', ''],
            headerWidths: ['5%', '10%', '10%', '15%', '10%', '10%', '10%', '15%', '15%'],

            searchQuery: "",

            selectedProgram: [],
            isFilterDropdownOpen: false,
            //groupedPrograms: {}, 
            selectAllProgramState: {},

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            packages: [],
            currentPage: 1,
            itemsPerPage: 10,

            isDetailModalOpen: false,
            selectedPackageDetail: {},

            isEditModalOpen: false,
            isAddModalOpen: false,
            newPackage: {
                name: '',
                program_id: '',
                package_detail: '',
                package_validity: 0,
                total_days: 0,
                boxes_per_day: 0,
                total_boxes: 0,
                price: 0,
                promotion_detail: '',
                free_mad: 0,
                free_dessert: 0,
                free_brittles: 0,
                free_energy_balls: 0,
                free_dressing: 0,
                free_yoghurt: 0,
                free_granola: 0,
                start_date: null,
            },
            selectedPackage: {
                id: '',
                name: '',
                program_id: '',
                package_detail: '',
                package_validity: 0,
                total_days: 0,
                boxes_per_day: 0,
                total_boxes: 0,
                price: 0,
                promotion_detail: '',
                free_mad: 0,
                free_dessert: 0,
                free_brittles: 0,
                free_energy_balls: 0,
                free_dressing: 0,
                free_yoghurt: 0,
                free_granola: 0,
                start_date: null,
            },
            programs: [],
            promotion_types: [],
            selectedPromotionType: "",

            isDeleteModalOpen: false,
            itemToDelete: null,

            toastSuccessMessage: "",
            showSuccessToast: false,
            toastFailMessage: "",
            showFailToast: false,
            showErrorToast: false,
            toastErrorMessage: "",

        };
    },
    components: {
        Multiselect
    },
    computed: {
        totalPages() {
            return Math.ceil(
                this.packages.filter((packaged) => {
                    const matchesSearch = packaged.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        packaged.id.toString().includes(this.searchQuery);
                    const matchesProgram = this.selectedProgram.length === 0 || this.selectedProgram.includes(packaged.program_id);
                    const matchesMonthYear = this.selectedMonthYear
                        ? new Date(packaged.start_date).toISOString().slice(0, 7) === this.selectedMonthYear
                        : true;

                    return matchesSearch && matchesProgram && matchesMonthYear;
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
        filteredPackage() {
            if (!this.packages || !Array.isArray(this.packages)) {
                return [];
            }
            const filtered = this.packages.filter((packaged) => {
                const matchesSearch = packaged.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    packaged.id.toString().includes(this.searchQuery);
                const matchesProgram = this.selectedProgram.length === 0 || this.selectedProgram.includes(packaged.program_id);
                const matchesMonthYear = this.selectedMonthYear
                    ? new Date(packaged.start_date).toISOString().slice(0, 7) === this.selectedMonthYear
                    : true;

                return matchesSearch && matchesProgram && matchesMonthYear;
            });
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return filtered.slice(startIndex, endIndex);
        },

        filteredDetail() {
            return {
                name: this.selectedPackageDetail.name,
                program: this.selectedPackageDetail.program.name,
                package_detail: this.selectedPackageDetail.package_detail,
                package_validity: this.selectedPackageDetail.package_validity,
                total_days: this.selectedPackageDetail.total_days,
                boxes_per_day: this.selectedPackageDetail.boxes_per_day,
                total_boxes: this.selectedPackageDetail.total_boxes,
                price: this.formatPrice(this.selectedPackageDetail.price),
                promotion_detail: this.selectedPackageDetail.promotion_detail,
                free_mad: this.selectedPackageDetail.free_mad,
                free_dessert: this.selectedPackageDetail.free_dessert,
                free_brittles: this.selectedPackageDetail.free_brittles,
                free_energy_balls: this.selectedPackageDetail.free_energy_balls,
                free_dressing: this.selectedPackageDetail.free_dressing,
                free_yoghurt: this.selectedPackageDetail.free_yoghurt,
                free_granola: this.selectedPackageDetail.free_granola,

            };
        },
        filteredPrograms() {
            if (!this.selectedPromotionType || !this.selectedPromotionType.id) {
                return [];
            }

            return this.programs.filter(
                (program) => program.promotion_type_id === this.selectedPromotionType.id
            );
        },
        filteredEditPrograms() {
            if (!this.selectedPackage.program || !this.selectedPackage.program.promotionType) {
                return [];
            }

            return this.programs.filter(
                (program) => program.promotion_type_id === this.selectedPackage.program.promotionType.id
            );
        },
        groupedPrograms() {
            return this.programs.reduce((groups, type) => {
                const promotionTypeName = type.promotionType ? type.promotionType.name : 'ไม่มีข้อมูล';
                if (!groups[promotionTypeName]) {
                    groups[promotionTypeName] = [];
                }
                groups[promotionTypeName].push(type);
                return groups;
            }, {});
        },
        ...mapGetters(["packages"]),


    },
    methods: {
        ...mapActions(["fetchPackages", "fetchPrograms", "fetchPromotionTypes"]),
        formatPrice(price) {
            return "฿" + new Intl.NumberFormat("th-TH").format(price);
        },
        formattedStartDate(date) {
            if (!date) return '';
            const newDate = new Date(date);
            const month = newDate.getMonth();
            const year = newDate.getFullYear();

            const englishMonths = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            return `${englishMonths[month]} ${year}`;
        },

        async fetchPackages() {
            try {
                const response = await axios.get(`${API_URL}/packages`);
                this.packages = response.data;
                this.packages.sort((a, b) => a.id - b.id);

            } catch (error) {
                console.error("Error fetching program:", error);
            }
        },
        search() {
            this.currentPage = 1;
        },
        clearSearch() {
            this.searchQuery = "";
            this.currentPage = 1;
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

            this.packages.sort((a, b) => {
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
            this.packages.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
        },


        toggleFiltterDropdown() {
            this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
        },
        applyFilter() {
            if (this.selectedProgram.length > 0) {
                this.filteredPackage = this.packages.filter(packaged =>
                    this.selectedProgram.includes(packaged.program_id)
                );
            } else {
                this.filteredPackage = this.packages;
            }

            if (this.selectedMonthYear) {
                const [selectedYear, selectedMonth] = this.selectedMonthYear.split("-").map(Number); // แปลงเป็นตัวเลข
                this.filteredPackage = this.filteredPackage.filter(packaged => {
                    const startDate = new Date(packaged.start_date);
                    return (
                        startDate.getFullYear() === selectedYear &&
                        startDate.getMonth() + 1 === selectedMonth // +1 เนื่องจาก getMonth() เริ่มที่ 0
                    );
                });
            }

            this.isFilterDropdownOpen = false;
            this.currentPage = 1;
        },
        toggleSelectPromotionAll(promotionType) {
            if (this.selectAllProgramState[promotionType]) {
                this.selectedProgram = this.selectedProgram.filter(id =>
                    !this.groupedPrograms[promotionType].some(promotion => promotion.id === id)
                );
            } else {
                const programIds = this.groupedPrograms[promotionType].map(promotion => promotion.id);
                this.selectedProgram = [...new Set([...this.selectedProgram, ...programIds])];
            }
            this.selectAllProgramState[promotionType] = !this.selectAllProgramState[promotionType];
        },
        clearFilter() {
            this.selectedProgram = [];
            this.selectedMonthYear = "";
            this.filteredPackage = this.packages;
            Object.keys(this.selectAllProgramState).forEach(key => {
                this.selectAllProgramState[key] = false;
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

        getProgramName(program_id) {
            const type = this.programs.find(type => type.id === program_id);
            return type ? type.name : 'ไม่พบข้อมูล';
        },

        onViewDetails(packaged) {
            this.selectedPackageDetail = { ...packaged };
            this.isDetailModalOpen = true;
        },
        closeDetailModal() {
            this.isDetailModalOpen = false;
            this.selectedPackageDetail = {};
        },

        formatLabel(key) {
            const labels = {
                name: 'Package',
                program: 'Program',
                package_detail: 'Package Details for Purchase Summary',
                package_validity: 'Package Validity',
                total_days: 'Total Days',
                boxes_per_day: '# of Boxes/Day',
                total_boxes: 'Total Boxes',
                price: 'ราคา',
                promotion_detail: 'รายละเอียดโปรโมชัน',
                free_mad: 'จำนวนกล่องที่แถม M or A or D',
                free_dessert: 'จำนวนกล่องที่แถม Dessert',
                free_brittles: 'จำนวนกล่องที่แถม Brittles',
                free_energy_balls: 'จำนวนกล่องที่แถม Energy Balls',
                free_dressing: 'จำนวนกล่องที่แถม Dressing',
                free_yoghurt: 'จำนวนกล่องที่แถม Yoghurt',
                free_granola: 'จำนวนกล่องที่แถม Granola',

            };
            return labels[key] || key;
        },

        openEditModal(packaged) {
            const program = this.programs.find((program) => program.id === packaged.program_id);
            this.selectedPackage = {
                ...packaged,
                program_id: program
                    ? {
                        id: program.id,
                        name: `${program.name}`
                    }
                    : null,
            };
            this.isEditModalOpen = true;
        },
        async saveChanges() {
            try {
                if (!this.selectedPackage.name || !this.selectedPackage.program_id) {
                    this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
                    return;
                }

                const response = await axios.put(`${API_URL}/packages/${this.selectedPackage.id}`, {
                    name: this.selectedPackage.name,
                    program_id: this.selectedPackage.program_id.id,
                    package_detail: this.selectedPackage.package_detail,
                    package_validity: this.selectedPackage.package_validity,
                    total_days: this.selectedPackage.total_days,
                    boxes_per_day: this.selectedPackage.boxes_per_day,
                    total_boxes: this.selectedPackage.total_boxes,
                    price: this.selectedPackage.price,
                    promotion_detail: this.selectedPackage.promotion_detail,
                    free_mad: this.selectedPackage.free_mad,
                    free_dessert: this.selectedPackage.free_dessert,
                    free_brittles: this.selectedPackage.free_brittles,
                    free_energy_balls: this.selectedPackage.free_energy_balls,
                    free_dressing: this.selectedPackage.free_dressing,
                    free_yoghurt: this.selectedPackage.free_yoghurt,
                    free_granola: this.selectedPackage.free_granola,
                    start_date: this.selectedPackage.start_date,
                });

                const index = this.packages.findIndex(packaged => packaged.id === this.selectedPackage.id);
                if (index !== -1) {
                    this.packages[index] = {
                        ...response.data,
                        promotionType: this.promotion_types.find(p => p.id === response.data.promotion_type_id) || {},
                    }
                }

                this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
                this.isEditModalOpen = false;
                await this.fetchPackages();
            } catch (error) {
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการแก้ไขข้อมูล!");
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedPackage = {};
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
                await axios.delete(`${API_URL}/packages/${this.itemToDelete}`);
                this.packages = this.packages.filter(
                    (item) => item.id !== this.itemToDelete
                );
                this.closeDeleteModal();
                await this.fetchPackages();
                this.showFailToastNotification("ลบข้อมูลสำเร็จ!");
            } catch (error) {
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการลบข้อมูล!");
            }
        },

        openAddModal() {
            this.isAddModalOpen = true;
        },
        closeAddModal() {
            this.isAddModalOpen = false;
            this.clearAdd();
        },
        clearAdd() {
            this.newPackage = {
                name: '',
                program_id: '',
                package_detail: '',
                package_validity: 0,
                total_days: 0,
                boxes_per_day: 0,
                total_boxes: 0,
                price: 0,
                promotion_detail: '',
                free_mad: 0,
                free_dessert: 0,
                free_brittles: 0,
                free_energy_balls: 0,
                free_dressing: 0,
                free_yoghurt: 0,
                free_granola: 0,
                start_date: null,
            };
            this.selectedPromotionType = null;
        },
        async addPackage() {
            if (!this.newPackage.name) {
                this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
                return;
            }
            try {
                const response = await axios.post(`${API_URL}/packages`, {
                    name: this.newPackage.name,
                    program_id: this.newPackage.program_id.id,
                    package_detail: this.newPackage.package_detail,
                    package_validity: this.newPackage.package_validity,
                    total_days: this.newPackage.total_days,
                    boxes_per_day: this.newPackage.boxes_per_day,
                    total_boxes: this.newPackage.total_boxes,
                    price: this.newPackage.price,
                    promotion_detail: this.newPackage.promotion_detail,
                    start_date: this.newPackage.start_date,
                    free_mad: this.newPackage.free_mad,
                    free_dessert: this.newPackage.free_dessert,
                    free_brittles: this.newPackage.free_brittles,
                    free_energy_balls: this.newPackage.free_energy_balls,
                    free_dressing: this.newPackage.free_dressing,
                    free_yoghurt: this.newPackage.free_yoghurt,
                    free_granola: this.newPackage.free_granola,
                });

                if (response.data && response.data.promotionType && response.data.program.promotionType) {
                    this.packages.push(response.data);
                }


                this.showSuccessToastNotification("เพิ่มข้อมูลสำเร็จ!");
                this.closeAddModal();
                await this.fetchPackages();
            } catch (error) {
                console.error("Error adding program:", error);
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
            }
        },

        async fetchPrograms() {
            try {
                const response = await axios.get(`${API_URL}/programs`);
                this.programs = response.data;
            } catch (error) {
                console.error("Error fetching promotion types:", error);
            }
        },

        async fetchPromotionTypes() {
            try {
                const response = await axios.get(`${API_URL}/promotion-types`);
                this.promotion_types = response.data;
            } catch (error) {
                console.error("Error fetching promotion types:", error);
            }
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
        this.fetchPackages();
        this.fetchPrograms();
        this.fetchPromotionTypes();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchPackages();
        this.fetchPrograms();
        this.fetchPromotionTypes();

        flatpickr("#startMonth", {
            dateFormat: "Y-m",
            altInput: true,
            altFormat: "F Y",
            allowInput: true,
        });
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },


};
</script>


<style scoped></style>