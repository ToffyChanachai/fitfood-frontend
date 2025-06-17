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

    <div>
        <div class="flex mt-[-20px] space-x-2 items-center relative">
            <div class="px-4 flex items-center space-x-1 mr-auto ">
                <span class="material-symbols-outlined text-2xl text-gray-700">person</span>
                <span class="text-m text-gray-700">จำนวนลูกค้าทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ customers.length }} คน</span>
            </div>

            <div class="sort relative inline-block" ref="sortDropdown">
                <!-- Sort Dropdown Button -->
                <button @click="toggleSortDropdown"
                    class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">sort</span>
                    <span class="text-white text-base leading-none">จัดเรียง</span>
                    <span :class="{ 'rotate-180': isSortDropdownOpen }"
                        class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto transition-transform duration-300">arrow_drop_down</span>
                </button>

                <!-- Dropdown Sort Menu -->
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
                
        <div class="max-h-[640px] overflow-y-auto rounded-t-2xl mt-4">
            <table class="min-w-[5000px] table-auto">
                <thead class="sticky top-0 bg-custom-orange text-white z-10">
                    <tr>
                        <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold whitespace-nowrap']"
                            :style="{ width: headerWidths[index] }">
                            {{ header }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="isLoading" class="bg-white">
                        <td colspan="17" class="py-16 text-center">
                            <div class="flex ml-[900px] justify-left items-center space-x-2">
                                <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                                <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                                <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-400"></div>
                            </div>
                        </td>
                    </tr>

                    <template v-else>
                        <template v-if="filteredCustomers.length > 0">
                            <tr v-for="(customer, index) in filteredCustomers" :key="index"
                                class=" bg-white relative border-b border-b-gray-200">
                                <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                <td class="px-4 py-2 align-top font-bold text-custom-orange pb-5">{{ customer.name }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.customer_id }}</td>
                                <td class="px-4 py-2 align-top pb-5">
                                    <div class="flex items-center">
                                        <span class="material-symbols-outlined text-xl" :class="customer.gender === 'male' ? 'text-blue-500' : 'text-pink-500'">
                                            {{ customer.gender === 'male' ? 'male' : 'female' }}
                                        </span>
                                        {{ customer.gender === 'male' ? 'ผู้ชาย' : 'ผู้หญิง' }}
                                    </div>
                                </td>
                                <td class="px-4 py-2 align-top pb-5">
                                    <div class="flex items-center">
                                        <span class="material-symbols-outlined mr-1 text-xl">mail</span>{{ customer.email
                                        }}
                                    </div>
                                    <div class="flex items-center">
                                        <span class="material-symbols-outlined mr-1 text-xl">phone</span>{{ customer.tel }}
                                    </div>
                                    <div class="flex items-center">
                                        <strong class="font-semibold">Line ID:</strong> <p class="ml-2">{{ customer.line_id }}</p>
                                    </div>
                                </td>
                                <td class="px-4 py-2 align-top pb-5">
                                    {{ formatFoodAllergies(customer.food_allergies) }}
                                    <span v-if="customer.food_allergies_detail">
                                        {{ customer.food_allergies_detail }}
                                    </span>
                                </td>                            
                                <td class="px-4 py-2 align-top pb-5">{{ customer.delivery_date }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.recipient_mon_to_fri }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.note }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.address_1 }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.address_1 }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.address_1 }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ formattedDeliveryTime(customer.delivery_time) }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.delivery_round }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.deliver }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.delivery_zone }}</td>
                                <td class="px-4 py-2 align-top pb-5">{{ customer.delivery_address }}</td>


                                <!-- <td class="px-4 py-2 text-right relative" ref="moreDropdown">
                                    <button @click="toggleMoreDropdown(index)">
                                        <span class="material-symbols-outlined cursor-pointer">more_vert</span>
                                    </button>

                                    <div v-if="filteredCustomers.length > 4">
                                        <div v-if="moreOpenDropdownIndex === index"
                                            :class="moreDropdownPositionClass(index)"
                                            class="dropdown-menu absolute right-0 text-center bg-white shadow-lg rounded-md z-50 w-40 border border-gray-300">
                                            <ul class="list-none p-0 m-0">
                                                <li @click="onEdit(customer)"
                                                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-blue-500 border-b border-gray-300">
                                                    แก้ไขข้อมูล
                                                </li>
                                                <li @click="confirmDelete(customer.id)"
                                                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500 border-b border-gray-300">
                                                    ลบข้อมูล
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div v-else>
                                        <div v-if="moreOpenDropdownIndex === index"
                                            class="dropdown-menu absolute right-0 text-center bg-white shadow-lg rounded-md z-50 w-40 border border-gray-300">
                                            <ul class="list-none p-0 m-0">
                                                <li @click="onEdit(customer)"
                                                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-blue-500 border-b border-gray-300">
                                                    แก้ไขข้อมูล
                                                </li>
                                                <li @click="confirmDelete(customer.id)"
                                                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500 border-b border-gray-300">
                                                    ลบข้อมูล
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </td> -->

                                <td class="px-4 py-2 align-top text-right">
                                    <div class="flex justify-end space-x-2">
                                    <button @click="onEdit(customer)"
                                        class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                                        <span class="material-symbols-outlined">edit_square</span>
                                        <span>แก้ไข</span>
                                    </button>
                                    <button @click="confirmDelete(customer.id)"
                                        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                                        <span class="material-symbols-outlined">delete</span>
                                        <span>ลบ</span>
                                    </button>
                                    </div>
                                </td>

                            </tr>
                        </template>

                        <template v-if="filteredCustomers.length < 6 && filteredCustomers.length > 0">
                            <tr v-for="emptyIndex in (6 - filteredCustomers.length)" :key="'empty-' + emptyIndex"
                                class="bg-white">
                                <td colspan="18" class="py-16"></td>
                            </tr>
                        </template>

                        <template v-if="filteredCustomers.length === 0">
                            <tr>
                                <td colspan="18" class="py-10 bg-white text-center text-gray-500 font-bold">
                                    ไม่พบข้อมูล
                                </td>
                            </tr>
                        </template>
                    </template>


                </tbody>

                <div v-if="isDetailModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                        <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <span class="font-bold">
                                <h2>รายละเอียดลูกค้า</h2>
                            </span>
                            <div class="flex space-x-2">
                                <span @click="closeDetailModal"
                                    class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                    close
                                </span>
                            </div>
                        </div>

                        <div class="pb-2 pt-2 overflow-y-auto flex-grow">
                            <div v-for="(value, key, index) in filteredDetailsCustomer" :key="key"
                                :class="index % 2 === 0 ? 'bg-white rounded-none' : 'bg-gray-100 rounded-none'"
                                class="p-2 rounded-md">
                                <p class="pl-3 pr-3">
                                    <strong class="mr-2">{{ formatLabel(key) }}</strong>
                                    <span :style="{
                                        whiteSpace: key === 'note' ? 'pre-wrap' : 'normal',
                                        display: 'inline-block',
                                        width: '100%'
                                    }">{{ value }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <div v-if="isEditModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                        <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <span class="font-bold">แก้ไขข้อมูลลูกค้า</span>
                            <div class="flex space-x-2">
                                <span @click="closeEditModal"
                                    class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                    close </span>
                            </div>
                        </div>
                        <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                            <div class="mb-4">
                                <label for="editCustomerName" class="block text-gray-700 font-medium">ชื่อ</label>
                                <input v-model="selectedCustomer.name" id="editCustomerName" type="text"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                            </div>

                            <div class="mb-4">
                                <label for="editCustomerEmail" class="block text-gray-700 font-medium">อีเมล</label>
                                <input v-model="selectedCustomer.email" id="editCustomerEmail" type="email"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                            </div>

                            <div>
                                <label for="customer_id"
                                    class="block  font-medium text-gray-700">รหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา</label>
                                <input type="text" v-model="selectedCustomer.customer_id"
                                    placeholder="กรอกรหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <div>
                                <label class="block  font-medium text-gray-700">เพศ</label>
                                <div class="flex space-x-4">
                                    <label>
                                        <input type="radio" v-model="selectedCustomer.gender" value="female"
                                            class="focus:ring-custom-orange" />
                                        ผู้หญิง / Female
                                    </label>
                                    <label>
                                        <input type="radio" v-model="selectedCustomer.gender" value="male"
                                            class="focus:ring-custom-orange" />
                                        ผู้ชาย / Male
                                    </label>
                                </div>
                            </div>

                            <div class="flex space-x-4">
                                <div class="w-1/2">
                                    <label for="tel" class="block  font-medium text-gray-700">เบอร์โทรศัพท์</label>
                                    <input type="text" v-model="selectedCustomer.tel" maxlength="10"
                                        placeholder="กรอกหมายเลขโทรศัพท์"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <div class="w-1/2">
                                    <label for="line_id" class="block  font-medium text-gray-700">Line ID
                                        (ถ้ามี)</label>
                                    <input type="text" v-model="selectedCustomer.line_id" placeholder="กรอก line id"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div>
                                <label class="block  font-medium text-gray-700">คุณแพ้อาหารชนิดใดหรือไม่?</label>
                                <div class="flex space-x-4">
                                    <label>
                                        <input type="radio" v-model="selectedCustomer.food_allergies" value="No"
                                            @change="selectedCustomer.food_allergies_detail = null" />

                                        ไม่ / No
                                    </label>
                                    <label>
                                        <input type="radio" v-model="selectedCustomer.food_allergies" value="Yes"
                                            class="focus:ring-custom-orange" />
                                        ใช่ / Yes
                                    </label>

                                </div>
                            </div>

                            <div v-if="selectedCustomer.food_allergies === 'Yes'">
                                <label for="food_allergies_detail"
                                    class="block  font-medium text-gray-700">โปรดระบุประเภทอาหารที่คุณมีอาการแพ้ในบรรทัดด้านล่าง</label>
                                <textarea id="food_allergies_detail" v-model="selectedCustomer.food_allergies_detail"
                                    placeholder="Enter details here"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                    rows="4"></textarea>
                            </div>

                            <div>
                                <label for="delivery_date"
                                    class="block  font-medium text-gray-700">โปรดระบุวันที่คุณต้องการรับอาหาร</label>
                                <input type="text" v-model="selectedCustomer.delivery_date"
                                    placeholder="กรอกโปรดระบุวันที่คุณต้องการรับอาหาร"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>

                            <div>
                                <label class="block font-medium text-gray-700">ผู้รับอาหาร?</label>
                                <div class="flex space-x-4">
                                    <label class="text-gray-700">
                                        <input type="radio" v-model="selectedCustomer.recipient_mon_to_fri"
                                            value="ตัวคุณเอง" class="focus:ring-custom-orange custom-radio" />
                                        ตัวคุณเอง
                                    </label>
                                    <label class="text-gray-700">
                                        มีผู้อื่นรับแทน (โปรดระบุชื่อ พร้อมเบอร์โทรติดต่อในบรรทัดด้านล่าง)
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label for="recipient_mon_to_fri" class="block  font-medium text-gray-700">โปรดระบุชื่อ
                                    พร้อมเบอร์โทรติดต่อ</label>
                                <textarea id="recipient_mon_to_fri" v-model="selectedCustomer.recipient_mon_to_fri"
                                    placeholder="Enter details here"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                    rows="4"></textarea>
                            </div>

                            <div>
                                <label for="note" class="block font-medium text-gray-700">หากมีรายละเอียดอื่นๆ
                                    ที่เราควรทราบ
                                    โปรดระบุ</label>
                                <textarea id="note" v-model="selectedCustomer.note" placeholder="กรอกรายละเอียดอื่นๆ"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                    rows="4"></textarea>
                            </div>

                            <div>
                                <label for="address_1" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 1</label>
                                <textarea id="address" v-model="selectedCustomer.address_1"
                                    placeholder="กรอกที่อยู่การจัดส่ง"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                    rows="4"></textarea>
                            </div>

                            <div>
                                <label for="address_2" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 2
                                    (ถ้ามี)</label>
                                <textarea id="address_2" v-model="selectedCustomer.address_2"
                                    placeholder="กรอกที่อยู่การจัดส่ง"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                    rows="4"></textarea>
                            </div>

                            <div>
                                <label for="address_3" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 3
                                    (ถ้ามี)</label>
                                <textarea id="address_3" v-model="selectedCustomer.address_3"
                                    placeholder="กรอกที่อยู่การจัดส่ง"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                    rows="4"></textarea>
                            </div>

                            <div>
                                <label for="delivery_address"
                                    class="block font-medium text-gray-700">เลือกที่อยู่สำหรับจัดส่ง</label>
                                <select v-model="selectedCustomer.delivery_address"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange">
                                    <option :value="selectedCustomer.address_1" v-if="selectedCustomer.address_1">ที่อยู่ 1:
                                        {{
                                            selectedCustomer.address_1 }}
                                    </option>
                                    <option :value="selectedCustomer.address_2" v-if="selectedCustomer.address_2">ที่อยู่ 1:
                                        {{
                                            selectedCustomer.address_2 }}
                                    </option>
                                    <option :value="selectedCustomer.address_3" v-if="selectedCustomer.address_3">ที่อยู่ 1:
                                        {{
                                            selectedCustomer.address_3 }}
                                    </option>
                                </select>
                            </div>

                            <div class="mt-4 flex gap-4">
                                <div class="w-1/2">
                                    <label for="delivery_round" class="block font-medium text-gray-700">รอบการจัดส่ง</label>
                                    <textarea v-model="selectedCustomer.delivery_round"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                        rows="3"></textarea>
                                </div>

                                <div class="w-1/2">
                                    <label for="deliver" class="block font-medium text-gray-700">ผู้ส่ง</label>
                                    <textarea v-model="selectedCustomer.deliver"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                        rows="3"></textarea>
                                </div>
                            </div>

                            <div class="mt-4 flex gap-4">
                                <div class="w-1/2">
                                    <label for="delivery_zone"
                                        class="block font-medium text-gray-700">โซนจัดส่งตามที่อยู่ตาม
                                        Routing</label>
                                    <textarea v-model="selectedCustomer.delivery_zone"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                                        rows="3"></textarea>
                                </div>


                                <div class="w-1/2">
                                    <label for="delivery_time" class="block font-medium text-gray-700">เวลาจัดส่ง</label>
                                    <input type="time" v-model="selectedCustomer.delivery_time"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange">
                                </div>
                            </div>



                        </div>

                        <!-- Footer (with buttons) -->
                        <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                            <div class="flex space-x-2">
                                <button @click="closeEditModal"
                                    class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                    ยกเลิก
                                </button>
                                <button @click="saveChanges"
                                    class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-30">
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
                            <p>
                                คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?
                                การดำเนินการนี้ไม่สามารถย้อนกลับได้
                            </p>
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
        </div>

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
import { API_URL } from "@/services/api";


export default {
    name: "AFF Customers",
    data() {
        return {
            headers: ['#', 'ชื่อ', 'รหัสอ้างอิง', 'เพศ', 'ช่องทางการติดต่อ', 'ข้อมูลแพ้อาหาร', 'วันที่ต้องการรับอาหาร', 'ผู้รับอาหาร', 'รายละเอียดอื่นๆ', 'ที่อยู่ 1', 'ที่อยู่ 2', 'ที่อยู่ 3', 'เวลาจัดส่ง', 'รอบการจัดส่ง', 'ผู้จัดส่ง', 'โซนจัดส่งที่อยู่ตาม Routing', 'ที่อยู่จัดส่ง',  ""],
            headerWidths: ['150px', '500px', '200px', '150px', '200px', '700px', '500px', '500px', '700px', '700px', '700px', '700px', '300px', '550px', '550px', '550px', '700px', '50px'],


            searchQuery: "",

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            customers: [],
            currentPage: 1,
            itemsPerPage: 10,

            // selectedCustomer: {
            //     id: null, // id ของลูกค้า
            //     email: '',
            //     customer_id: '',  // customer_id ที่ไม่ซ้ำ
            //     name: '',
            //     customer_gender: '',  // 'male' หรือ 'female'
            //     customer_tel: '',
            //     customer_line_id: '',
            //     food_allergies: '',
            //     delivery_date: '',
            //     address_mon_to_fri: '',
            //     recipient_mon_to_fri: '',
            //     address_sat_to_sun: '',
            //     recipient_sat_to_sun: '',
            //     other_detail: '',
            //     note: '',
            //     seller_name_id: null,  // ฟิลด์ที่เชื่อมโยงกับ id ของ seller_names
            //     select_by: '',  // 'customer' หรือ 'aff'
            //     address_1: '',
            //     zone_1: null,  // id ของ zone_deliveries
            //     address_2: '',
            //     zone_2: null,  // id ของ zone_deliveries
            //     address_3: '',
            //     zone_3: null,  // id ของ zone_deliveries
            //     created_at: null,
            //     updated_at: null
            // },
            isDetailModalOpen: false,
            selectedCustomer: {},
            moreOpenDropdownIndex: null,

            isEditModalOpen: false,
            isDeleteModalOpen: false,
            itemToDelete: null,

            toastSuccessMessage: "",
            showSuccessToast: false,
            toastFailMessage: "",
            showFailToast: false,
            showErrorToast: false,
            toastErrorMessage: "",

            isLoading: false,

        };
    },
    computed: {
        filteredCustomers() {
            const filtered = this.customers.filter(customer => {
                const name = customer.name || ''; // ป้องกันการเข้าถึง null หรือ undefined
                return name.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;

            return filtered.slice(startIndex, endIndex); // คืนค่ารายการที่แบ่งหน้าตาม currentPage และ itemsPerPage
        },
        totalPages() {
            // กรองข้อมูลตามคำค้นหา
            const filtered = this.customers.filter(customer => {
                const name = customer.name || ''; // ป้องกันการเข้าถึง null หรือ undefined
                return name.toLowerCase().includes(this.searchQuery.toLowerCase());
            });

            // คำนวณจำนวนหน้าที่จะต้องแสดง
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
        filteredDetailsCustomer() {
            return {
                name: this.selectedCustomer.name,
                customer_id: this.selectedCustomer.customer_id,
                gender: this.selectedCustomer.gender === 'male' ? 'ผู้ชาย' : 'ผู้หญิง',
                email: this.selectedCustomer.email,
                tel: this.selectedCustomer.tel,
                line_id: this.selectedCustomer.line_id,
                food_allergies: this.formatFoodAllergies(this.selectedCustomer.food_allergies) + (this.selectedCustomer.food_allergies_detail || ''),
                delivery_date: this.selectedCustomer.delivery_date,
                recipient_mon_to_fri: this.selectedCustomer.recipient_mon_to_fri,
                note: this.selectedCustomer.note + '\n' + (this.selectedCustomer.other_detail || ''),
                address_1: this.selectedCustomer.address_1,
                address_2: this.selectedCustomer.address_2,
                address_3: this.selectedCustomer.address_3,

                delivery_address: this.selectedCustomer.delivery_address,
                delivery_round: this.selectedCustomer.delivery_round,
                deliver: this.selectedCustomer.deliver,
                delivery_zone: this.selectedCustomer.delivery_zone,
                delivery_time: this.formattedDeliveryTime(this.selectedCustomer.delivery_time),
            };
        },
        formattedDeliveryTime() {
            return (time) => {
                if (!time) return "-"; // กรณีไม่มีข้อมูล
                return time.slice(0, 5); // ตัดเอาแค่ HH:mm
            };
        },


    },
    methods: {
        async fetchCustomers() {
            this.isLoading = true;

            try {
                const response = await axios.get(`${API_URL}/customers`);
                this.customers = response.data;
                this.customers.sort((a, b) => a.id - b.id);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                this.isLoading = false;
            }
        },
        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
        search() {
            this.currentPage = 1; // รีเซ็ตหน้าเป็น 1 เมื่อทำการค้นหาใหม่
        },
        clearSearch() {
            this.searchQuery = ""; // เคลียร์คำค้นหา
            this.currentPage = 1; // รีเซ็ตหน้าเป็น 1
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
        },
        clearSort() {
            this.sortColumn = 'id';
            this.sortDirection.id = 1;
            this.customers.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
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
            this.selectedCustomer = { ...customer }; // คัดลอกข้อมูลลูกค้า
            this.isEditModalOpen = true; // เปิด Modal
            this.moreOpenDropdownIndex = null;
        },
        async saveChanges() {
            try {
                if (!this.selectedCustomer.name || !this.selectedCustomer.email) {
                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }

                const response = await axios.put(`${API_URL}/customers/${this.selectedCustomer.id}`, {
                    email: this.selectedCustomer.email,
                    customer_id: this.selectedCustomer.customer_id,
                    name: this.selectedCustomer.name,
                    gender: this.selectedCustomer.gender,
                    tel: this.selectedCustomer.tel,
                    line_id: this.selectedCustomer.line_id,
                    food_allergies: this.selectedCustomer.food_allergies,
                    food_allergies_detail: this.selectedCustomer.food_allergies_detail,
                    delivery_date: this.selectedCustomer.delivery_date,
                    note: this.selectedCustomer.note,
                    address_1: this.selectedCustomer.address_1,
                    address_2: this.selectedCustomer.address_2,
                    address_3: this.selectedCustomer.address_3,
                    recipient_mon_to_fri: this.selectedCustomer.recipient_mon_to_fri,

                    delivery_round: this.selectedCustomer.delivery_round,
                    deliver: this.selectedCustomer.deliver,
                    delivery_zone: this.selectedCustomer.delivery_zone,
                    delivery_time: this.selectedCustomer.delivery_time,
                    delivery_address: this.selectedCustomer.delivery_address,
                });

                const index = this.customers.findIndex(customer => customer.id === this.selectedCustomer.id);
                if (index !== -1) {
                    this.customers[index] = response.data;
                }

                this.isEditModalOpen = false; // ปิด Modal
                this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
                await this.fetchCustomers();
            } catch (error) {
                console.error('Error saving changes:', error);
                this.showErrorToastNotification('เกิดข้อผิดพลาดในการแก้ไขข้อมูลสำเร็จ');
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false; // ปิด Modal
            this.selectedCustomer = {}; // รีเซ็ตข้อมูลลูกค้าที่เลือก
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
                    `${API_URL}/customers/${this.itemToDelete}`
                );
                this.customers = this.customers.filter((item) => item.id !== this.itemToDelete);
                this.closeDeleteModal();
                await this.fetchCustomers();
                this.showFailToastNotification("ลบข้อมูลสำเร็จ!");
            } catch (error) {
                console.error("Error deleting item:", error);
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการลบข้อมูล!");
            }
        },

        formatLabel(key) {
            const labels = {
                name: 'ชื่อ',
                customer_id: 'รหัสอ้างอิง',
                gender: 'เพศ',
                email: 'อีเมล',
                tel: 'เบอร์โทรศัพท์',
                line_id: 'Line ID',
                food_allergies: 'ข้อมูลแพ้อาหาร',
                delivery_date: 'วันที่ต้องการรับอาหาร',
                recipient_mon_to_fri: 'ผู้รับอาหาร',
                note: 'หากมีรายละเอียดอื่นๆ ที่เราควรทราบ โปรดระบุ',
                address_1: 'ที่อยู่ 1',
                address_2: 'ที่อยู่ 2',
                address_3: 'ที่อยู่ 3',
                delivery_round: "รอบการจัดส่ง",
                deliver: "ผู้จัดส่ง",
                delivery_zone: "โซนจัดส่งตามที่อยู่ตาม Routing",
                delivery_time: "เวลาจัดส่ง",
                delivery_address: "ที่อยู่จัดส่ง",
            };
            return labels[key] || key;
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
        formatFoodAllergies(value) {
            if (value === 'Yes') {
                return 'ใช่ Yes,';
            } else if (value === 'No') {
                return 'ไม่ No';
            }
            return value; // ถ้าไม่ใช่ Yes หรือ No ให้แสดงค่าปกติ
        }

    },
    created() {
        this.fetchCustomers();
        this.sortData('id'); // เรียกจัดเรียงตามรหัสโดยเริ่มต้น

    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchCustomers();
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },


};
</script>


<style scoped>
.dropdown-up {
    bottom: 100%;
    margin-bottom: 4px;
}
</style>