<template>
    <div>

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
                <span class="text-m text-gray-700">จำนวนการบันทึกการขายทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ saleRecords.length }} รายการ</span>
            </div>

            <div class="add relative inline-block">
                <button @click="openAddModal"
                    class="bg-custom-orange text-white px-4 py-2 rounded flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
                    <span class="text-white text-base leading-none">เพิ่มบันทึกการขาย</span>
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

                    <!-- Modal Box -->
                    <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                        <div
                            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <h2 class="text-xl font-bold">เพิ่มข้อมูล</h2>
                            <span @click="closeAddModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>

                        <!-- Form Section -->
                        <div class="p-6 space-y-4 overflow-y-auto flex-grow">

                            <div>
                                <label for="customer" class="block font-bold text-gray-700">ลูกค้า</label>
                                <multiselect v-model="saleRecord.customer_id" :options="customers"
                                    placeholder="เลือกลูกค้า" track-by="id" label="name" />
                            </div>

                            <div>
                                <label for="package_type" class="block font-bold text-gray-700">Package Type</label>
                                <multiselect v-model="saleRecord.package_type_id" :options="packageTypes"
                                    placeholder="เลือก Package Type" track-by="id" label="name" />
                            </div>

                            <div
                                v-if="saleRecord.package_type_id && saleRecord.package_type_id.name.toLowerCase() === 'additional sales'">
                                <div>
                                    <label for="additional_type"
                                        class="block font-bold text-gray-700">ประเภทรายการ</label>
                                    <multiselect v-model="saleRecord.additional_type_id" :options="additionalTypes"
                                        placeholder="เลือกประเภทรายการ" track-by="id" label="name" />
                                </div>

                                <div>
                                    <label for="add_detail"
                                        class="block font-bold text-gray-700">รายละเอียดการขาย</label>
                                    <input v-model="saleRecord.add_detail" id="add_detail" type="text"
                                        placeholder="กรอกรายละเอียดการขาย"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <div class="flex-1">
                                    <label for="add_price" class="block font-bold text-gray-700">มูลค่าขาย</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-4 flex items-center text-gray-500">฿</span>
                                        <input v-model="saleRecord.add_price" id="add_price" type="number" step="1"
                                            placeholder="กรอกมูลค่าขาย"
                                            class="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>
                                </div>
                            </div>

                            <div
                                v-if="saleRecord.package_type_id && saleRecord.package_type_id.name.toLowerCase() === 'consignment'">
                                <!-- Input for Consignment-specific detail when Consignment is selected -->
                                <div>
                                    <label for="consignment_detail"
                                        class="block font-bold text-gray-700">รายละเอียดสำหรับ
                                        Consignment</label>
                                    <input v-model="saleRecord.add_detail" id="consignment_detail" type="text"
                                        placeholder="กรอกรายละเอียด Consignment"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <div class="flex-1">
                                    <label for="add_price" class="block font-bold text-gray-700">มูลค่าขาย</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-4 flex items-center text-gray-500">฿</span>
                                        <input v-model="saleRecord.add_price" id="add_price" type="number" step="1"
                                            placeholder="กรอกมูลค่าขาย"
                                            class="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>
                                </div>
                            </div>

                            <!-- Hide Package, Program, and Promotion when Additional Sale is selected -->
                            <div
                                v-if="!(saleRecord.package_type_id?.name?.toLowerCase() === 'additional sales' || saleRecord.package_type_id?.name?.toLowerCase() === 'consignment')">
                                <div>
                                    <label for="promotion_type" class="block font-bold text-gray-700">Promotion
                                        Type</label>
                                    <multiselect v-model="saleRecord.promotion_type_id" :options="promotionTypes"
                                        placeholder="เลือก Promotion Type" track-by="id" label="name" />
                                </div>

                                <div>
                                    <label for="program" class="block font-bold text-gray-700">Program</label>
                                    <multiselect v-model="saleRecord.program_id" :options="programs"
                                        placeholder="เลือก Program" track-by="id" label="name" />
                                </div>

                                <div>
                                    <label for="package" class="block font-bold text-gray-700">Package</label>
                                    <multiselect v-model="saleRecord.package_id" :options="packages"
                                        placeholder="เลือก Package" track-by="id" label="name" />
                                </div>

                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="discount" class="block font-bold text-gray-700">Discount</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-4 flex items-center text-gray-500">฿</span>
                                        <input v-model="saleRecord.discount" id="discount" type="number" step="1"
                                            placeholder="กรอก Discount"
                                            class="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                    </div>

                                </div>

                                <div class="flex-1">
                                    <label for="extraCharge" class="block font-bold text-gray-700">Extra Charge
                                        (%)</label>
                                    <div class="relative">
                                        <input v-model="saleRecord.extra_charge" id="extraCharge" type="number" step="1"
                                            min="0" placeholder="กรอก Extra Charge (%)"
                                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange pr-12" />
                                        <span
                                            class="absolute inset-y-0 right-4 flex items-center text-gray-500">%</span>
                                    </div>
                                </div>

                            </div>

                            <div v-if="saleRecord.address_1" class="mt-4 p-4 border border-custom-orange rounded-md">
                                <h3 class="font-bold">ที่อยู่ลูกค้า</h3>

                                <div v-if="saleRecord.address_1">
                                    <p><strong>ที่อยู่ 1:</strong> {{ saleRecord.address_1 }}</p>
                                </div>

                                <div v-if="saleRecord.address_2">
                                    <p><strong>ที่อยู่ 2:</strong> {{ saleRecord.address_2 }}</p>
                                </div>

                                <div v-if="saleRecord.address_3">
                                    <p><strong>ที่อยู่ 3:</strong> {{ saleRecord.address_3 }}</p>
                                </div>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone1_delivery" class="block font-bold text-gray-700">In-house Riders
                                        (ที่อยู่ 1)</label>
                                    <multiselect v-model="saleRecord.zone1_id" :options="zoneDeliveries"
                                        placeholder="เลือก In-house Riders (ที่อยู่ 1)" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone1_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone1_quantity" id="zone1_quantity" type="number"
                                        step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone2_delivery" class="block font-bold text-gray-700">In-house Riders
                                        (ที่อยู่ 2)</label>
                                    <multiselect v-model="saleRecord.zone2_id" :options="zoneDeliveries"
                                        placeholder="เลือก In-house Riders (ที่อยู่ 2)" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone2_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone2_quantity" id="zone2_quantity" type="number"
                                        step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone3_delivery" class="block font-bold text-gray-700">In-house Riders
                                        (ที่อยู่ 3)</label>
                                    <multiselect v-model="saleRecord.zone3_id" :options="zoneDeliveries"
                                        placeholder="เลือก In-house Riders (ที่อยู่ 3)" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone3_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone3_quantity" id="zone3_quantity" type="number"
                                        step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone_outsource_delivery" class="block font-bold text-gray-700">Outsource
                                        Riders</label>
                                    <multiselect v-model="saleRecord.zone_outsource_id" :options="zoneDeliveries"
                                        placeholder="เลือก Outsource Riders" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone3_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone3_quantity" id="zone3_quantity" type="number"
                                        step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="sellerName" class="block font-bold text-gray-700">ผู้ขาย</label>
                                    <multiselect v-model="saleRecord.seller_name_id" :options="sellerNames"
                                        placeholder="เลือกผู้ขาย" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="startDate" class="block font-bold text-gray-700">วันเริ่มแพ็คเกจ</label>
                                    <input v-model="saleRecord.start_date" id="startDate" type="date"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <!-- <div class="flex space-x-4">
                  <div class="flex-1">
                    <label for="sellerName" class="block font-bold text-gray-700">เลือกอาหารโดย</label>
                    <multiselect v-model="saleRecord.seller_name_id" :options="sellerNames" placeholder="เลือกผู้ขาย"
                      track-by="id" label="name" />
                  </div>
  
                  <div class="flex-1">
                    <label for="sellerName" class="block font-bold text-gray-700">รอบการจัดส่ง</label>
                    <multiselect v-model="saleRecord.seller_name_id" :options="sellerNames" placeholder="เลือกผู้ขาย"
                      track-by="id" label="name" />
                  </div>
                </div> -->
                        </div>

                        <div class="flex justify-between space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                            <li @click="clearForm"
                                class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                                <span>รีเซ็ตข้อมูล</span>
                            </li>
                            <div class="flex space-x-2">
                                <button @click="closeAddModal"
                                    class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                                    ยกเลิก
                                </button>
                                <button @click="addSaleRecord"
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
                            <span>จัดเรียงตามชื่อลูกค้า</span>
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

        <div v-if="$route.path === '/sale-records' || $route.path === '/sale-records-additional'"
            class="p-4 flex items-left space-x-6 text-m font-bold">
            <router-link to="sale-records" class="hover:text-custom-orange"
                :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/sale-records' }">
                บันทึกการขาย 1stTimer, PackageRenewal
            </router-link>
            <router-link to="sale-records-additional" class="hover:text-custom-orange"
                :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/sale-records-additional' }">
                บันทึกการขาย AdditionalSales
            </router-link>
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
                <template v-if="additionalSalesRecords.length > 0">
                    <tr v-for="(saleRecord, index) in additionalSalesRecords" :key="index"
                        class=" bg-white relative border-b border-b-gray-200">
                        <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

                        <td class="px-4 py-2 align-top pb-5 font-bold text-custom-orange">
                            {{ getCustomerName(saleRecord.customer_id) }}
                        </td>
                        <td class="px-4 py-2 align-top pb-5">
                            {{ getPackageTypeName(saleRecord.package_type_id) }}
                        </td>
                        <td class="px-4 py-2 align-top pb-5">
                            {{ saleRecord.additional_type_id }}
                        </td>
                        <td class="px-4 py-2 align-top pb-5">
                            {{ saleRecord.add_detail }}
                        </td>
                        <td class="px-4 py-2 align-top pb-5">
                            {{ formatPrice(saleRecord.add_price) }}
                        </td>

                        <td class="px-4 py-2 align-top font-bold pb-5">
                            <button @click="openConfirmPaymentModal(saleRecord)"
                                class="px-4 py-1 rounded-full font-bold focus:outline-none"
                                :class="getPaymentStatusClass(saleRecord.payment_status)">
                                {{ getPaymentStatusText(saleRecord.payment_status) }}
                            </button>

                            <div v-if="isConfirmPaymentModalOpen"
                                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-10 z-50">
                                <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg transition-opacity duration-300 z-60"
                                    :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
                                    <span class="material-symbols-outlined text-white">error</span>
                                    <span>{{ toastErrorMessage }}</span>
                                    <button @click="showErrorToast = false"
                                        class="text-white hover:text-gray-200 focus:outline-none">
                                        <span class="material-symbols-outlined text-xl">close</span>
                                    </button>
                                </div>

                                <div class="bg-white rounded-md w-1/3 max-w-lg">
                                    <!-- Header -->
                                    <div :class="{
                                        'bg-green-500': selectedSaleRecord.payment_status === 'unpaid',
                                        'bg-red-500': selectedSaleRecord.payment_status === 'paid',
                                    }" class="flex justify-between items-center text-white px-4 py-2 rounded-t-md">
                                        <span class="font-bold">
                                            {{ selectedSaleRecord.payment_status === 'paid' ?
                                                'เปลี่ยนสถานะเป็นยังไม่ได้ชำระเงิน' :
                                                'ยืนยันการชำระเงิน' }}
                                        </span>
                                        <button @click="closeConfirmPaymentModal"
                                            class="text-white hover:text-gray-200">
                                            <span class="material-symbols-outlined">close</span>
                                        </button>
                                    </div>

                                    <!-- Content -->
                                    <div class="p-6 space-y-4">
                                        <p class="text-gray-700">
                                            {{ selectedSaleRecord.payment_status === 'paid'
                                                ? 'คุณต้องการเปลี่ยนสถานะเป็น "ยังไม่ได้ชำระเงิน" หรือไม่?'
                                                : 'กรุณาเลือกวันที่ชำระเงิน:' }}
                                        </p>

                                        <!-- Date Picker -->
                                        <div v-if="selectedSaleRecord.payment_status !== 'paid'">
                                            <input type="date" v-model="selectedPaidDate"
                                                class="border border-gray-300 rounded px-4 py-2 w-full" />
                                        </div>

                                        <!-- Payment Type Dropdown -->
                                        <div v-if="selectedSaleRecord.payment_status !== 'paid'" class="mt-4">
                                            <label for="payment_types"
                                                class="block text-gray-700">เลือกประเภทการชำระเงิน:</label>
                                            <multiselect v-model="selectedSaleRecord.payment_type_id"
                                                :options="paymentTypes" label="name" track-by="id"
                                                placeholder="เลือกประเภทการชำระเงิน">
                                            </multiselect>

                                        </div>

                                    </div>

                                    <!-- Footer -->
                                    <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md">
                                        <button @click="closeConfirmPaymentModal"
                                            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                            ยกเลิก
                                        </button>
                                        <button @click="confirmPayment" :class="{
                                            'bg-green-500 hover:bg-green-600': selectedSaleRecord.payment_status === 'unpaid',
                                            'bg-red-500 hover:bg-red-600': selectedSaleRecord.payment_status === 'paid',
                                        }" class="text-white px-4 py-2 rounded">
                                            ยืนยัน
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </td>

                        <td class="px-4 py-2 text-right  pb-5 relative" ref="moreDropdown">
                            <button @click="toggleMoreDropdown(index)">
                                <span class="material-symbols-outlined cursor-pointer">more_vert</span>
                            </button>

                            <div v-if="additionalSalesRecords.length > 4">
                                <div v-if="moreOpenDropdownIndex === index" :class="moreDropdownPositionClass(index)"
                                    class="dropdown-menu absolute right-0 text-center bg-white shadow-lg rounded-md z-50 w-40 border border-gray-300">
                                    <ul class="list-none p-0 m-0">
                                        <li @click="onViewResultSaleRecord(saleRecord)"
                                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-custom-orange font-bold border-b border-gray-300">
                                            สรุปยอด
                                        </li>
                                        <li @click="onViewDetail(saleRecord)"
                                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 border-b border-gray-300">
                                            ดูรายละเอียด
                                        </li>
                                        <li @click="openEditModal(saleRecord)"
                                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-blue-500 border-b border-gray-300">
                                            แก้ไขข้อมูล
                                        </li>
                                        <li @click="confirmDelete(saleRecord.id)"
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
                                        <li @click="onViewResultSaleRecord(saleRecord)"
                                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-custom-orange font-bold border-b border-gray-300">
                                            สรุปยอด
                                        </li>
                                        <li @click="onViewDetail(saleRecord)"
                                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 border-b border-gray-300">
                                            ดูรายละเอียด
                                        </li>
                                        <li @click="openEditModal(saleRecord)"
                                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-blue-500 border-b border-gray-300">
                                            แก้ไขข้อมูล
                                        </li>
                                        <li @click="confirmDelete(saleRecord.id)"
                                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500 border-b border-gray-300">
                                            ลบข้อมูล
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </td>

                    </tr>
                </template>

                <template v-if="additionalSalesRecords.length < 5 && additionalSalesRecords.length > 0">
                    <tr v-for="emptyIndex in (5 - additionalSalesRecords.length)" :key="'empty-' + emptyIndex"
                        class="bg-white">
                        <td colspan="8" class="py-20"></td>
                    </tr>
                </template>

                <template v-if="additionalSalesRecords.length === 0">
                    <tr>
                        <td colspan="8" class="py-10 bg-white text-center text-gray-500 font-bold">
                            ไม่พบข้อมูลที่ค้นหา
                        </td>
                    </tr>
                </template>
            </tbody>

            <div v-if="isResultModalOpen"
                class="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10 z-50">
                <div class="bg-white rounded-md shadow-lg w-1000">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">Copy & Paste เพื่อสรุปยอดส่งให้ลูกค้า</span>
                        <div class="flex space-x-2">
                            <span @click="copyResultModalContent"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                {{ isCopied ? 'check_circle' : 'content_copy' }}
                            </span>

                            <span @click="closeResultModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="p-6" ref="modalContent">
                        <p class="text-gray-500"><strong>📌 ขออนุญาตสรุปยอดนะคะ</strong></p>
                        <div v-for="(value, key) in filteredResultSaleRecord" :key="key" class="mb-2">
                            <p><strong>{{ formatResultLabel(key) }}:</strong> {{ value }}</p>
                        </div>
                        <p class="text-gray-500"><strong>📌 กรุณาชำระเงิน ของวันสรุปยอด
                                เพื่อให้ท่านได้รับอาหารตามวันที่กำหนดในรายการสรุปยอดนี้นะคะ</strong></p>
                    </div>
                </div>
            </div>

            <div v-if="isDetailModalOpen"
                class="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10 z-50">
                <div class="bg-white rounded-md shadow-lg w-1000">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">รายละเอียดบันทึกการขาย</span>
                        <div class="flex space-x-2">
                            <span @click="closeDetailModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="p-6" ref="modalContent">
                        <div v-for="(value, key) in filteredDetailSaleRecord" :key="key" class="mb-2">
                            <p>
                                <strong :class="getLabelClass(key)">{{ formatDetialLabel(key) }}:</strong>
                                <span :class="['ml-1', getValueClass(key)]">{{ value }}</span>
                            </p>
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
                        <span class="font-bold">แก้ไขโปรแกรม</span>
                        <div class="flex space-x-2">
                            <span @click="closeEditModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="p-6 space-y-4 overflow-y-auto flex-grow">

                        <div class="mb-4">
                            <label for="editCustomer" class="block font-bold text-gray-700">ลูกค้า</label>
                            <multiselect v-model="selectedSaleRecord.customer_id" :options="customers"
                                placeholder="เลือกลูกค้า" track-by="id" label="name" class="w-full" />

                        </div>

                    </div>

                    <!-- Footer (with buttons) -->
                    <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                        <div class="flex space-x-2">
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

        <div
            class="rounded-b-2xl flex justify-center items-center space-x-2 bg-white px-2 py-1 border-t border-t-gray-200">
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
import Multiselect from 'vue-multiselect';
import { mapActions, mapGetters } from "vuex";

export default {
    components: {
        Multiselect,
    },
    data() {
        return {
            headers: ['#', `Customer's Name`, 'Sales Type', 'ประเภทรายการ', 'รายละเอียดการขาย', 'มูลค่าขาย', 'สถานะการชำระเงิน', ''],
            headerWidths: ['5%', '15%', '15%', '15%', '25%', '10%', '15%', '5%'],
            saleRecords: [],

            searchQuery: "",
            filteredSaleRecords: [],

            isAddModalOpen: false,
            saleRecord: {
                customer_id: '',
                promotion_type_id: '',
                program_id: '',
                package_id: '',
                package_type_id: '',
                seller_name_id: '',
                delivery: '',

                package_price: 0,
                discount: 0,
                extra_charge: 0,
                total_package_price: '',

                zone1_id: '',
                zone1_quantity: 0,

                zone2_id: '',
                zone2_quantity: 0,

                zone3_id: '',
                zone3_quantity: 0,

                zone_outsource_id: '',
                zone_outsource_quantity: 0,

                total_delivery_zone_price: '',
                total_delivery_price: '',
                payment_status: 'unpaid',
                paid_date: '',
                payment_type_id: '',
                start_date: '',
                expiry_date: '',
                remaining_days: 0,

                additional_type_id: '',
                add_detail: '',
                add_price: 0,
            },
            customers: [],
            customerAddress: null,

            promotionTypes: [],
            programs: [],
            packages: [],
            packageTypes: [],
            zoneDeliveries: [],
            zoneDeliveryTypes: [],
            selectedZoneDeliveryType: "",
            sellerNames: [],
            paymentTypes: [],
            additionalTypes: [],

            packageDetails: null,
            isShowingPackageDetails: false,

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1
            },
            sortColumn: '',

            isDetailModalOpen: false,
            isResultModalOpen: false,

            isDeleteModalOpen: false,
            itemToDelete: null,

            moreOpenDropdownIndex: null,
            selectedSaleRecord: {
                id: '',
                customer_id: '',
                promotion_type_id: '',
                program_id: '',
                package_id: '',
                package_type_id: '',
                seller_name_id: '',
                delivery: '',
                discount: 0,
                extra_charge: 0,
                total_package_price: '',

                zone1_id: '',
                zone1_quantity: 0,

                zone2_id: '',
                zone2_quantity: 0,

                zone3_id: '',
                zone3_quantity: 0,

                zone_outsource_id: '',
                zone_outsource_quantity: 0,

                total_delivery_zone_price: '',
                total_delivery_price: '',
                payment_status: 'unpaid',
                paid_date: '',
                payment_type_id: '',
                start_date: '',
                expiry_date: '',
                remaining_days: 0,
            },
            isCopied: false,

            isEditModalOpen: false,
            // selectedSaleRecord: {
            //   id: '',
            //   name: '',
            //   program_id: '',
            //   package_detail: '',
            //   package_validity: '',
            //   total_days: '',
            //   boxes_per_day: '',
            //   total_boxes: '',
            //   price: '',
            //   promotion_detail: '',
            // },

            isConfirmPaymentModalOpen: false,
            selectedPaidDate: '',
            selectedPaymentTypeId: '',
            // selectedSaleRecord: null,

            currentPage: 1,
            itemsPerPage: 10,

            toastSuccessMessage: "",
            showSuccessToast: false,
            toastFailMessage: "",
            showFailToast: false,
            showErrorToast: false,
            toastErrorMessage: "",
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(
                this.additionalSalesRecords.filter((saleRecord) => {
                    const customerName = this.getCustomerName(saleRecord.customer_id).toLowerCase();
                    return customerName.includes(this.searchQuery.toLowerCase());
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
        filteredResultSaleRecord() {
            if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer) {
                return { name: '', expiry_date: '' };
            }
            return {
                name: this.selectedSaleRecord.customer.name,
                package: this.selectedSaleRecord.package.package_detail,
                start_date: this.formatDate(this.selectedSaleRecord.start_date),
                sellect_by: this.getSelectByText(this.selectedSaleRecord.customer.select_by),
                delivery_date: this.selectedSaleRecord.customer.delivery_date,
                delivery: this.selectedSaleRecord.delivery,
                package_price: this.formatPrice(this.selectedSaleRecord.package.price),
                extra_charge: this.formatPrice(this.selectedSaleRecord.extra_charge),
                discount: this.formatPrice(this.selectedSaleRecord.discount),
                total_delivery_price: this.totalDeliveryPrice,
                total_price: this.formatPrice(this.selectedSaleRecord.total_price),
                expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),

            };
        },

        filteredDetailSaleRecord() {
            if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer) {
                return { name: '', expiry_date: '' };
            }
            return {
                customer_id: this.selectedSaleRecord.customer.customer_id,
                name: this.selectedSaleRecord.customer.name,
                package_type: this.getPackageTypeName(this.selectedSaleRecord.package_type_id),
                package: this.selectedSaleRecord.package.package_detail,
                promotion_type: this.selectedSaleRecord.promotionType.name,
                program: this.getProgramName(this.selectedSaleRecord.program_id),
                package_price: this.formatPrice(this.selectedSaleRecord.package.price),
                discount: this.formatPrice(this.selectedSaleRecord.discount),
                extra_charge: this.formatPrice(this.selectedSaleRecord.extra_charge),
                total_package_price: this.formatPrice(this.selectedSaleRecord.total_package_price),
                sellect_by: this.selectedSaleRecord.customer.sellect_by,
                delivery_date: this.selectedSaleRecord.customer.delivery_date,

                start_date: this.formatDate(this.selectedSaleRecord.start_date),
                expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
                note_customer: this.selectedSaleRecord.customer.other_detail || '-',

            };
        },

        zone1Name() {
            return this.selectedSaleRecord.customer.zone1 ? this.selectedSaleRecord.customer.zone1.name : 'ไม่พบข้อมูล';
        },
        zone2Name() {
            return this.selectedSaleRecord.customer.zone2 ? this.selectedSaleRecord.customer.zone2.name : 'ไม่พบข้อมูล';
        },
        zone3Name() {
            return this.selectedSaleRecord.customer.zone3 ? this.selectedSaleRecord.customer.zone3.name : 'ไม่พบข้อมูล';
        },
        totalDeliveryPrice() {
            let zones = [];

            // ตรวจสอบว่า zone1_quantity ไม่เป็น 0
            if (this.selectedSaleRecord.customer.zone_1 !== null && this.selectedSaleRecord.zone1_quantity > 0) {
                zones.push(`${this.selectedSaleRecord.customer.zone1.name} x ${this.selectedSaleRecord.zone1_quantity} ครั้ง`);
            }

            // ตรวจสอบว่า zone2_quantity ไม่เป็น 0
            if (this.selectedSaleRecord.customer.zone_2 !== null && this.selectedSaleRecord.zone2_quantity > 0) {
                zones.push(`${this.selectedSaleRecord.customer.zone2.name} x ${this.selectedSaleRecord.zone2_quantity} ครั้ง`);
            }

            // ตรวจสอบว่า zone3_quantity ไม่เป็น 0
            if (this.selectedSaleRecord.customer.zone_3 !== null && this.selectedSaleRecord.zone3_quantity > 0) {
                zones.push(`${this.selectedSaleRecord.customer.zone3.name} x ${this.selectedSaleRecord.zone3_quantity} ครั้ง`);
            }

            // สร้างข้อความรายละเอียด
            let zoneText = zones.length > 0 ? `(${zones.join(' + ')})` : '';

            // ตรวจสอบว่า total_delivery_price ไม่เป็น 0
            return this.selectedSaleRecord.total_delivery_price > 0
                ? `${this.formatPrice(this.selectedSaleRecord.total_delivery_price)} ${zoneText}`
                : '';
        },

        additionalSalesRecords() {
            return this.saleRecords.filter((record) => {
                const packageTypeName = this.getPackageTypeName(record.package_type_id).toLowerCase();
                return packageTypeName === "additional sales" || packageTypeName === "consignment";
            });
        },



        ...mapGetters(["saleRecords"]),


    },
    methods: {
        ...mapActions(["fetchSaleRecords", "fetchLookupData", "fetchCustomerAddress"]),

        getFilteredSaleRecords() {
            return this.filteredSaleRecords1standRenew;  // ใช้ this ในการเข้าถึง computed หรือ methods
        },
        formatDate(dateString) {
            const months = [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ];
            const date = new Date(dateString);
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();

            return `${day} ${month} ${year}`;
        },
        formatPrice(price) {
            return '฿' + new Intl.NumberFormat('th-TH').format(price);
        },

        fetchCustomerAddress(selectedCustomer) {
            if (!selectedCustomer || !selectedCustomer.id) {
                this.customerAddress = 'เลือกลูกค้าใหม่';
                this.saleRecord.address_1 = '';
                this.saleRecord.address_2 = '';
                this.saleRecord.address_3 = '';
                return;
            }

            const selectedCustomerId = selectedCustomer.id || selectedCustomer.customer_id;
            const customer = this.customers.find(c => c.id === selectedCustomerId);

            if (customer) {
                this.customerAddress = `${customer.address_1 || ''} ${customer.address_2 || ''} ${customer.address_3 || ''}`.trim();
                this.saleRecord.address_1 = customer.address_1;
                this.saleRecord.address_2 = customer.address_2;
                this.saleRecord.address_3 = customer.address_3;

                if (!this.customerAddress) {
                    this.customerAddress = 'ไม่มีที่อยู่';
                }
            } else {
                this.customerAddress = 'ไม่พบข้อมูลลูกค้า';
                // console.log('Customer not found');
            }
        },

        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
            this.updatePage();
        },
        updatePage() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;

            this.filteredSaleRecords = this.saleRecords.filter((saleRecord) => {
                const customerName = this.getCustomerName(saleRecord.customer_id).toLowerCase();
                return customerName.includes(this.searchQuery);
            }).slice(startIndex, endIndex);
        },

        search() {
            const filtered = this.saleRecords.filter((saleRecord) => {
                const customerName = this.getCustomerName(saleRecord.customer_id).toLowerCase();
                return customerName.includes(this.searchQuery);
            });

            this.currentPage = 1;
            this.filteredSaleRecords = filtered;
            this.updatePage();
        },
        clearSearch() {
            this.searchQuery = '';
            this.search();
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

            this.saleRecords.sort((a, b) => {
                let aValue, bValue;
                if (column === 'name') {
                    aValue = this.getCustomerName(a.customer_id);
                    bValue = this.getCustomerName(b.customer_id);
                } else {
                    aValue = a[column];
                    bValue = b[column];
                }

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
            this.saleRecords.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
            this.updatePage();
        },

        toggleMoreDropdown(index) {
            this.moreOpenDropdownIndex =
                this.moreOpenDropdownIndex === index ? null : index;
        },
        moreDropdownPositionClass(index) {
            if (index >= this.additionalSalesRecords.length - 2) {
                return "dropdown-up";
            }
            return "dropdown-down";
        },

        getPaymentStatusText(status) {
            return status === 'paid' ? 'ชำระเงินแล้ว' : 'ยังไม่ได้ชำระเงิน';
        },
        getPaymentStatusClass(status) {
            return status === 'paid' ? 'text-white bg-green-500' : 'text-white bg-red-500';
        },
        getAddPaymentStatusClass(status) {
            return status === 'paid' ? 'text-green-500 font-bold' : 'text-red-500 font-bold';
        },

        filterPrograms() {
            if (this.saleRecord.promotion_type_id && this.saleRecord.promotion_type_id.id) {
                this.programs = this.allPrograms.filter(
                    (program) => program.promotion_type_id === this.saleRecord.promotion_type_id.id
                );
            } else {
                this.programs = this.allPrograms; // หรือค่า default ที่คุณต้องการ
            }
            this.saleRecord.program_id = [];
        },
        filterPackages() {
            if (this.saleRecord.program_id && this.saleRecord.program_id.id) {
                this.packages = this.allPackages.filter(
                    (pkg) => pkg.program_id === this.saleRecord.program_id.id
                );
            } else {
                this.packages = this.allPackages; // ค่า default ที่คุณต้องการ
            }
            this.saleRecord.package_id = []; // รีเซ็ตค่า package_id
        },

        openAddModal() {
            this.isAddModalOpen = true;
        },
        async addSaleRecord() {
            if (!this.saleRecord.customer_id) {
                this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
                return;
            }

            console.log("ข้อมูลที่ส่งไปยัง backend:", this.saleRecord);

            try {
                const response = await axios.post("http://127.0.0.1:3333/sale-records", {
                    customer_id: this.saleRecord.customer_id?.id || null,
                    promotion_type_id: this.saleRecord.promotion_type_id?.id || null,
                    program_id: this.saleRecord.program_id?.id || null,
                    package_id: this.saleRecord.package_id?.id || null,
                    package_type_id: this.saleRecord.package_type_id?.id || null,
                    seller_name_id: this.saleRecord.seller_name_id?.id || null,
                    delivery: this.saleRecord.delivery || "",
                    discount: this.saleRecord.discount || 0,
                    extra_charge: this.saleRecord.extra_charge || 0,
                    payment_status: this.saleRecord.payment_status || "unpaid",
                    paid_date: this.saleRecord.paid_date || null,
                    payment_type_id: this.saleRecord.payment_type_id?.id || null,
                    start_date: this.saleRecord.start_date || null,

                    zone1_id: this.saleRecord.zone1_id?.id || null,
                    zone1_quantity: this.saleRecord.zone1_quantity || 0,

                    zone2_id: this.saleRecord.zone2_id?.id || null,
                    zone2_quantity: this.saleRecord.zone2_quantity || 0,

                    zone3_id: this.saleRecord.zone3_id?.id || null,
                    zone3_quantity: this.saleRecord.zone3_quantity || 0,

                    zone_outsource_id: this.saleRecord.zone_outsource_id?.id || null,
                    zone_outsource_quantity: this.saleRecord.zone_outsource_quantity || 0,

                    additional_type_id: this.saleRecord.additional_type_id.id || null,
                    add_detail: this.saleRecord.add_detail || null,
                    add_price: this.saleRecord.add_price || 0,
                });

                this.saleRecords.push(response.data);
                this.closeAddModal();
                this.filterPrograms();
                this.filterPackages();
                await this.fetchSaleRecords();
                this.showSuccessToastNotification("เพิ่มข้อมูลสำเร็จ!");
            } catch (error) {
                console.error("Error adding sale record:", error);
                if (error.response && error.response.data) {
                    this.showErrorToastNotification(error.response.data.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
                } else {
                    this.showErrorToastNotification("เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
                }
            }
        },
        closeAddModal() {
            this.isAddModalOpen = false;
            this.clearForm();
        },
        clearForm() {
            this.saleRecord = {
                customer_id: '',
                promotion_type_id: '',
                program_id: '',
                package_id: '',
                package_type_id: '',
                seller_name_id: '',
                delivery: '',
                discount: 0,
                extra_charge: 0,
                total_package_price: '',

                zone1_id: '',
                zone1_quantity: 0,

                zone2_id: '',
                zone2_quantity: 0,

                zone3_id: '',
                zone3_quantity: 0,

                zone_outsource_id: '',
                zone_outsource_quantity: 0,

                total_delivery_zone_price: '',
                total_delivery_price: '',
                payment_status: 'unpaid',
                paid_date: '',
                payment_type_id: '',
                start_date: '',
                expiry_date: '',
                remaining_days: 0,

                additional_type_id: '',
                add_detail: '',
                add_price: 0,
            };
            this.packageDetails = null;
            this.isShowingPackageDetails = false;
            this.customerAddress = null;
            this.filterPrograms();
            this.filterPackages();
        },

        openEditModal(saleRecord) {
            // const customer = this.customers.find((customer) => customer.id === saleRecord.customer_id);
            // this.selectedPackage = {
            //   ...saleRecord,
            //   customer_id: customer
            //     ? {
            //       id: customer.id,
            //       name: `${customer.name}`
            //     }
            //     : null,
            // };

            const selectedCustomer = this.customers.find(customer => customer.id === saleRecord.customer_id);
            this.selectedSaleRecord = {
                ...saleRecord,
                customer_id: selectedCustomer || null, // ถ้าไม่เจอ ให้เป็น null
            };
            this.isEditModalOpen = true;
        },
        async saveChanges() {
            try {
                if (!this.selectedSaleRecord.customer_id) {
                    this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
                    return;
                }

                const response = await axios.put(`http://127.0.0.1:3333/sale-records/${this.selectedSaleRecord.id}`, {
                    customer_id: this.selectedSaleRecord.customer_id.id,
                    // program_id: this.selectedPackage.program_id.id,
                    // package_detail: this.selectedPackage.package_detail,
                    // package_validity: this.selectedPackage.package_validity,
                    // total_days: this.selectedPackage.total_days,
                    // boxes_per_day: this.selectedPackage.boxes_per_day,
                    // total_boxes: this.selectedPackage.total_boxes,
                    // price: this.selectedPackage.price,
                    // promotion_detail: this.selectedPackage.promotion_detail,
                    // free_mad: this.selectedPackage.free_mad,
                    // free_dessert: this.selectedPackage.free_dessert,
                    // free_brittles: this.selectedPackage.free_brittles,
                    // free_energy_balls: this.selectedPackage.free_energy_balls,
                    // free_dressing: this.selectedPackage.free_dressing,
                    // free_yoghurt: this.selectedPackage.free_yoghurt,
                    // free_granola: this.selectedPackage.free_granola,
                    // start_date: this.selectedPackage.start_date,
                });

                const index = this.saleRecords.findIndex(saleRecord => saleRecord.id === this.selectedSaleRecord.id);
                if (index !== -1) {
                    this.saleRecords[index] = {
                        ...response.data,
                        //promotionType: this.promotion_types.find(p => p.id === response.data.promotion_type_id) || {},
                    }
                }

                this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
                this.isEditModalOpen = false;
                this.updatePage();
            } catch (error) {
                console.error('Error saving changes:', error);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedSaleRecord = {};
        },

        async showPackageDetails(packageId) {
            const selectedSaleRecord = this.packages.find(pkg => pkg.id === packageId.id);  // เข้าถึง id จาก Proxy
            if (selectedSaleRecord) {
                this.packageDetails = selectedSaleRecord;
                this.isShowingPackageDetails = true;
            } else {
                console.error('ไม่พบแพ็คเกจที่เลือก');
            }
        },
        togglePackageDetails(packageId) {
            if (this.isShowingPackageDetails) {
                this.resetPackageDetails();
            } else {
                this.showPackageDetails(packageId);
            }
        },
        resetPackageDetails() {
            this.packageDetails = null;
            this.isShowingPackageDetails = false;
        },

        async fetchLookupData() {
            try {
                const [customersRes, promotionTypesRes, programsRes, packagesRes, packageTypesRes, zoneDeliveryRes, zoneDeliveryTypeRes, sellerNamesRes, paymentTypeRes, additionalTypeRes] = await Promise.all([
                    axios.get("http://127.0.0.1:3333/customers"),
                    axios.get("http://127.0.0.1:3333/promotion-types"),
                    axios.get("http://127.0.0.1:3333/programs"),
                    axios.get("http://127.0.0.1:3333/packages"),
                    axios.get("http://127.0.0.1:3333/package-types"),
                    axios.get("http://127.0.0.1:3333/zone-deliveries"),
                    axios.get("http://127.0.0.1:3333/zone-delivery-types"),
                    axios.get("http://127.0.0.1:3333/seller-names"),
                    axios.get("http://127.0.0.1:3333/payment-types"),
                    axios.get("http://127.0.0.1:3333/additional-types")
                ]);
                this.customers = customersRes.data;
                this.promotionTypes = promotionTypesRes.data;
                this.allPrograms = programsRes.data || [];
                this.programs = this.allPrograms;
                if (this.saleRecord.promotion_type_id) {
                    this.filterPrograms();
                }
                this.allPackages = packagesRes.data || [];
                this.packages = this.allPackages;
                if (this.saleRecord.program_id) {
                    this.filterPackages();
                }
                this.packageTypes = packageTypesRes.data;
                this.zoneDeliveries = zoneDeliveryRes.data;
                this.zoneDeliveryTypes = zoneDeliveryTypeRes.data;
                this.sellerNames = sellerNamesRes.data;
                this.paymentTypes = paymentTypeRes.data.data;
                this.additionalTypes = additionalTypeRes.data;
                this.updatePage;
                //console.log('Fetched payment types:', paymentTypeRes.data);
                //console.log(this.paymentTypes);

            } catch (error) {
                console.error("Error fetching lookup data:", error);
            }
        },

        async fetchSaleRecords() {
            try {
                const response = await axios.get("http://127.0.0.1:3333/sale-records");
                this.saleRecords = response.data;
                this.filteredSaleRecords = response.data;
                this.saleRecords.sort((a, b) => a.id - b.id);
                this.updatePage();
            } catch (error) {
                console.error("Error fetching sale records:", error);
            }
        },

        getCustomerName(customerId) {
            const customer = this.customers.find((c) => c.id === customerId);
            return customer ? customer.name : "ไม่พบข้อมูล";
        },
        getProgramName(programId) {
            const program = this.programs.find((p) => p.id === programId);
            return program ? program.name : "ไม่พบข้อมูล";
        },
        getPackageName(packageId) {
            // ตรวจสอบว่า allPackages ไม่เป็น undefined หรือ null
            if (this.allPackages && Array.isArray(this.allPackages)) {
                const packaged = this.allPackages.find((p) => p.id === packageId);
                return packaged ? packaged.package_detail : "ไม่พบข้อมูล";
            }
            return "ข้อมูลแพ็คเกจไม่พร้อมใช้งาน";
        },
        getPackageTypeName(packageTypeId) {
            const packageType = this.packageTypes.find((c) => c.id === packageTypeId);
            return packageType ? packageType.name : "ไม่พบข้อมูล";
        },
        getSelectByText() {
            const selectBy = this.selectedSaleRecord.customer.select_by;

            if (selectBy === 'customer') {
                return 'ลูกค้า';
            } else if (selectBy === 'aff') {
                return 'นักโภชนาการของ AFF';
            } else {
                return 'ไม่มี';  // ถ้าค่าเป็น null หรือไม่ตรงกับที่กำหนด
            }
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
                await axios.delete(`http://127.0.0.1:3333/sale-records/${this.itemToDelete}`);
                this.saleRecords = this.saleRecords.filter(
                    (item) => item.id !== this.itemToDelete
                );
                this.showFailToastNotification("ลบข้อมูลสำเร็จ!");
                this.closeDeleteModal();
                this.updatePage();
            } catch (error) {
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการลบข้อมูล!");
                // console.error("Error deleting item:", error);
            }
        },

        onViewDetail(saleRecord) {
            this.selectedSaleRecord = saleRecord;
            this.isDetailModalOpen = true;
            this.moreOpenDropdownIndex = null;
        },
        closeDetailModal() {
            this.isDetailModalOpen = false;
            this.selectedSaleRecord = null;
        },
        formatDetialLabel(key) {
            const labels = {
                customer_id: 'รหัส',
                name: 'ชื่อ',
                package_type: 'ประเภทแพ็คเกจ',
                package: 'แพ็คเกจ',
                promotion_type: 'ประเภทโปรโมชัน',
                program: 'โปรแกรม',
                package_price: 'ราคาแพ็คเกจ',
                discount: 'ส่วนลดเพิ่มเติม',
                extra_charge: 'Extra Chrage',

                total_package_price: 'มูลค่าแพ็กเกจทั้งหมด',


                sellect_by: 'เลือกอาหารโดย',
                delivery_date: 'วันที่รับอาหาร',
                start_date: 'วันเริ่มแพ็กเกจ',
                expiry_date: 'วันหมดอายุแพ็คเกจ',
                note_customer: 'Note ของลูกค้า',

            };
            return labels[key] || key;
        },
        getLabelClass(key) {
            if (key === 'total_package_price') {
                return 'text-custom-orange';
            }
            return '';
        },
        getValueClass() {
            return '';
        },

        onViewResultSaleRecord(saleRecord) {
            this.selectedSaleRecord = saleRecord;
            this.isResultModalOpen = true;
            this.moreOpenDropdownIndex = null;
        },
        closeResultModal() {
            this.isResultModalOpen = false;
            this.selectedSaleRecord = null;
        },
        formatResultLabel(key) {
            const labels = {
                name: 'ชื่อ',
                package: 'แพ็คเกจ',
                start_date: '▶️ วันรับอาหารวันแรก',
                sellect_by: 'เลือกอาหารโดย',
                delivery_date: 'วันที่รับอาหาร',
                delivery: 'จัดส่ง',
                package_price: 'ราคาแพ็คเกจ',
                extra_charge: 'Extra Chrage',
                discount: 'ส่วนลด',
                total_delivery_price: '▶️ ค่าจัดส่ง',
                total_price: '▶️ ยอดชำระ',
                expiry_date: 'วันหมดอายุแพ็คเกจ',

            };
            return labels[key] || key;
        },
        copyResultModalContent() {
            let modalText = this.$refs.modalContent.innerText;
            modalText = modalText.replace(/\n\s*\n/g, '\n');

            if (navigator.clipboard) {
                navigator.clipboard.writeText(modalText)
                    .then(() => {
                        this.isCopied = true;
                        setTimeout(() => {
                            this.isCopied = false;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('ไม่สามารถคัดลอกข้อความ:', err);
                    });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = modalText;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    this.isCopied = true;
                    setTimeout(() => {
                        this.isCopied = false;
                    }, 2000);
                } catch (err) {
                    console.error('ไม่สามารถคัดลอกข้อความ:', err);
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        },

        handleClickOutside(event) {
            if (this.$refs.sortDropdown && !this.$refs.sortDropdown.contains(event.target)) {
                this.isSortDropdownOpen = false;
            }
            if (!event.target.closest('.dropdown-menu') && !event.target.closest('button')) {
                this.moreOpenDropdownIndex = null;
            }

            if (event.target.closest('.sort')) {
                this.moreOpenDropdownIndex = null;
            }

            if (event.target.closest('.more')) {
                this.isSortDropdownOpen = false;
            }
        },


        // onEdit(saleRecord) {
        //   this.selectedSaleRecord = saleRecord;
        //   this.isEditModalOpen = true;
        //   this.moreOpenDropdownIndex = null;
        // },
        // openEditModal(saleRecord) {
        //   this.selectedSaleRecord = { ...saleRecord };
        //   this.isEditModalOpen = true;
        // },
        // async saveChanges() {
        //   try {
        //     // ตรวจสอบข้อมูลที่จำเป็น
        //     if (
        //       !this.selectedSaleRecord.customer_id ||
        //       !this.selectedSaleRecord.promotion_type_id ||
        //       !this.selectedSaleRecord.program_id ||
        //       !this.selectedSaleRecord.package_id ||
        //       !this.selectedSaleRecord.start_date
        //     ) {
        //       alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        //       return;
        //     }

        //     // ส่งข้อมูลไปยัง backend
        //     const response = await axios.put(
        //       `http://127.0.0.1:3333/sale-records/${this.selectedSaleRecord.id}`,
        //       {
        //         customer_id: this.selectedSaleRecord.customer_id,
        //         promotion_type_id: this.selectedSaleRecord.promotion_type_id,
        //         program_id: this.selectedSaleRecord.program_id,
        //         package_id: this.selectedSaleRecord.package_id,
        //         package_type_id: this.selectedSaleRecord.package_type_id,
        //         seller_name_id: this.selectedSaleRecord.seller_name_id,
        //         delivery: this.selectedSaleRecord.delivery,
        //         discount: this.selectedSaleRecord.discount,
        //         extra_charge: this.selectedSaleRecord.extra_charge,
        //         payment_status: this.selectedSaleRecord.payment_status,
        //         paid_date: this.selectedSaleRecord.paid_date,
        //         start_date: this.selectedSaleRecord.start_date,
        //         zone1_quantity: this.selectedSaleRecord.zone1_quantity || 0,
        //         zone2_quantity: this.selectedSaleRecord.zone2_quantity || 0,
        //         zone3_quantity: this.selectedSaleRecord.zone3_quantity || 0,
        //       }
        //     );

        //     console.log("Sale record updated:", response.data);

        //     // อัปเดตข้อมูลใน UI
        //     const index = this.packages.findIndex(
        //       (saleRecord) => saleRecord.id === this.selectedSaleRecord.id
        //     );
        //     if (index !== -1) {
        //       this.saleRecords[index] = response.data.data; // ใช้ข้อมูลที่ backend ส่งกลับ
        //     }

        //     this.isEditModalOpen = false;
        //     this.updatePage();
        //   } catch (error) {
        //     console.error("Error saving changes:", error);
        //     alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        //   }
        // },
        // closeEditModal() {
        //   this.isEditModalOpen = false;
        //   this.selectedSaleRecord = {};
        // },

        openConfirmPaymentModal(saleRecord) {
            this.selectedSaleRecord = saleRecord;
            this.selectedPaidDate = saleRecord.paid_date || '';
            this.isConfirmPaymentModalOpen = true;
        },
        closeConfirmPaymentModal() {
            this.isConfirmPaymentModalOpen = false;
            this.selectedSaleRecord = null;
            this.selectedPaidDate = '';
        },
        async confirmPayment() {
            try {
                const newStatus = this.selectedSaleRecord.payment_status === 'paid' ? 'unpaid' : 'paid';

                const paidDate = newStatus === 'paid' ? this.selectedPaidDate : null;
                const paymentTypeId = newStatus === 'paid' ? this.selectedSaleRecord.payment_type_id?.id : null;

                if (newStatus === 'paid' && !this.selectedPaidDate && !this.selectedPaymentTypeId) {
                    this.showErrorToastNotification("กรุณาเลือกข้อมูลให้ครบ!");
                    return;
                }

                const payload = {
                    payment_status: newStatus,
                    paid_date: paidDate,
                    payment_type_id: paymentTypeId, // ถ้า unpaid จะส่ง null
                };

                const response = await axios.put(
                    `http://127.0.0.1:3333/sale-records/${this.selectedSaleRecord.id}/payment-status`,
                    payload
                );
                await this.fetchSaleRecords();

                if (response.status === 200) {
                    const updatedRecord = response.data.data;
                    const index = this.saleRecords.findIndex((record) => record.id === updatedRecord.id);
                    if (index !== -1) {
                        this.saleRecords[index] = updatedRecord; // อัปเดตข้อมูลในรายการ
                    }
                    this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
                } else {
                    throw new Error('Unexpected response status');
                }
            } catch (error) {
                console.error('Error updating payment status:', error);
                console.error('Error response data:', error.response?.data || 'No additional data');
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
            }
            this.closeConfirmPaymentModal();
            // finally {
            //   this.closeConfirmPaymentModal();
            // }
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
    watch: {
        'saleRecord.customer_id'(newCustomerId) {
            // console.log('Customer ID changed to:', newCustomerId);
            this.fetchCustomerAddress(newCustomerId);
        },
        'saleRecord.promotion_type_id': function () {
            this.filterPrograms();
        },
        'saleRecord.program_id': function () {
            this.filterPackages();
        }
    },
    created() {
        this.filteredSaleRecords = this.saleRecords;
        this.sortData('id');
        this.fetchLookupData();
        this.fetchSaleRecords();
        this.updatePage();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.fetchLookupData();
        this.fetchSaleRecords();
        this.updatePage();
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
};
</script>

<style>
.dropdown-up {
    bottom: 100%;
    margin-bottom: 4px;
}
</style>