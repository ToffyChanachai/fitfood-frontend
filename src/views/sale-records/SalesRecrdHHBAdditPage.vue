<template>
    <div class="fixed top-4 right-8 bg-green-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
        :class="{
            'opacity-100': showSuccessToast,
            'opacity-0': !showSuccessToast,
        }">
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
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto">
                <span class="material-symbols-outlined text-2xl text-gray-700">contact_page</span>
                <span class="text-m text-gray-700">จำนวนการบันทึกการขายทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold">
                    {{ additionalSalesRecords.length }} รายการ</span>
            </div>

            <button v-if="selectedPackageType.length > 0" @click="clearFilter"
                class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
                <span class="material-symbols-outlined">close</span>
                <span class="ml-2">
                    รีเซ็ตตัวกรอง
                    <template v-if="selectedPackageType.length > 0">
                        ({{ selectedPackageType.length }})
                    </template>
                </span>
            </button>

            <div class="add relative inline-block">
                <button @click="openAddModal"
                    class="bg-custom-orange text-white px-4 py-2 rounded flex items-center space-x-1 hover:bg-custom-orange-hover">
                    <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
                    <span class="text-white text-base leading-none">เพิ่ม</span>
                </button>

                <div v-if="isAddModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">

                    <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
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

                    <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                        <div
                            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                            <h2 class="text-xl font-bold">เพิ่มบันทึกการขาย</h2>
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

                            <div v-if="
                                saleRecord.package_type_id &&
                                saleRecord.package_type_id.name.toLowerCase() ===
                                'additional sales' || saleRecord.package_type_id &&
                                saleRecord.package_type_id.name.toLowerCase() ===
                                'consignment'
                            ">
                                <div>
                                    <label for="additional_type" class="block font-bold text-gray-700">Sales
                                        Type</label>
                                    <multiselect v-model="saleRecord.additional_type_id"
                                        :options="filteredAdditionalTypes" placeholder="เลือก Sales Type" track-by="id"
                                        label="name" />
                                </div>

                                <div>
                                    <label for="add_detail"
                                        class="block text-gray-700 font-bold">รายละเอียดการขาย</label>
                                    <textarea id="add_detail" v-model="saleRecord.add_detail"
                                        placeholder="กรอกรายละเอียดการขาย" rows="3"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
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

                                <div>
                                    <label for="other_promotion_detail"
                                        class="block text-gray-700 font-bold">รายละเอียดเพิ่มเติมที่ต้องได้รับอนุม้ติจาก
                                        Director</label>
                                    <textarea id="other_promotion_detail" v-model="saleRecord.other_promotion_detail"
                                        placeholder="กรอกรายละเอียดโปรโมชันเพิ่มเติม" rows="3"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                                </div>
                            </div>

                            <div v-if="
                                !(
                                    saleRecord.package_type_id?.name?.toLowerCase() ===
                                    'additional sales' ||
                                    saleRecord.package_type_id?.name?.toLowerCase() ===
                                    'consignment'
                                )
                            ">
                                <div>
                                    <label for="promotion_type" class="block font-bold text-gray-700">Promotion
                                        Type</label>
                                    <multiselect v-model="saleRecord.promotion_type_id" :options="promotionTypes"
                                        placeholder="เลือก Promotion Type" track-by="id" label="name" />
                                </div>

                                <div>
                                    <label for="program" class="block font-bold text-gray-700">Program</label>
                                    <multiselect v-model="saleRecord.program_id" :options="filteredPrograms"
                                        placeholder="เลือก Program" track-by="id" label="name" :disabled="!saleRecord.promotion_type_id ||
                                            !saleRecord.promotion_type_id.id
                                            " />
                                </div>

                                <div>
                                    <label for="package" class="block font-bold text-gray-700">Package</label>
                                    <multiselect v-model="saleRecord.package_id" :options="packages"
                                        placeholder="เลือก Package" track-by="id" label="displayLabel" :disabled="!saleRecord.program_id || !saleRecord.program_id.id
                                            " />

                                    <button v-if="saleRecord.package_id && saleRecord.package_id.id"
                                        @click.prevent="togglePackageDetails(saleRecord.package_id)"
                                        class="mt-2 cursor-pointer text-custom-orange text-left hover:underline">
                                        {{
                                            isShowingPackageDetails
                                                ? "ปิดรายละเอียด"
                                                : "ดูรายละเอียดแพ็คเกจ"
                                        }}
                                    </button>

                                    <div v-if="packageDetails" class="mt-4 p-4 border border-custom-orange rounded-md">
                                        <h3 class="font-bold">รายละเอียดแพ็คเกจ</h3>
                                        <p>
                                            <strong>Package:</strong> {{ packageDetails.name }}
                                        </p>
                                        <p><strong>ราคา:</strong> {{ formatPrice(packageDetails.price) }}</p>
                                        <p>
                                            <strong>Package Details for Purchase Summary:</strong>
                                            {{ packageDetails.package_detail }}
                                        </p>
                                        <p>
                                            <strong>Package Validity:</strong>
                                            {{ packageDetails.package_validity }} วัน
                                        </p>
                                        <p>
                                            <strong>Total Days:</strong>
                                            {{ packageDetails.total_days }} วัน
                                        </p>
                                        <p>
                                            <strong># of Boxes/Day:</strong>
                                            {{ packageDetails.boxes_per_day }} กล่อง
                                        </p>
                                        <p>
                                            <strong>Total Boxes:</strong>
                                            {{ packageDetails.total_boxes }} กล่อง
                                        </p>
                                        <p>
                                            <strong>รายละเอียดโปรโมชัน:</strong>
                                            {{ packageDetails.promotion_detail }}
                                        </p>


                                        <div class="flex flex-wrap">
                                            <div class="md:w-1/2 lg:w-1/4">

                                                <p>
                                                    <strong>M or A or D:</strong>
                                                    {{ packageDetails.free_mad }}
                                                </p>
                                            </div>
                                            <div class="md:w-1/2 lg:w-1/4">
                                                <p>
                                                    <strong>Dessert:</strong>
                                                    {{ packageDetails.free_dessert }}
                                                </p>
                                            </div>
                                            <div class="md:w-1/2 lg:w-1/4">

                                                <p>
                                                    <strong>Brittles:</strong>
                                                    {{ packageDetails.free_brittles }}
                                                </p>
                                            </div>
                                            <div class="md:w-1/2 lg:w-1/4">
                                                <p>
                                                    <strong>Energy Balls:</strong>
                                                    {{ packageDetails.free_energy_balls }}
                                                </p>
                                            </div>
                                            <div class="md:w-1/2 lg:w-1/4">
                                                <p>
                                                    <strong>Dressing:</strong>
                                                    {{ packageDetails.free_dressing }}
                                                </p>
                                            </div>
                                            <div class="md:w-1/2 lg:w-1/4">
                                                <p>
                                                    <strong>Yoghurt:</strong>
                                                    {{ packageDetails.free_yoghurt }}
                                                </p>
                                            </div>
                                            <div class="md:w-1/2 lg:w-1/4">
                                                <p>
                                                    <strong>Granola:</strong>
                                                    {{ packageDetails.free_granola }}
                                                </p>
                                            </div>
                                            <div class="md:w-1/2 lg:w-1/4">
                                                <p>
                                                    <strong>เครดิตที่แถม (บาท):</strong>
                                                    {{ packageDetails.free_credit }}
                                                </p>
                                            </div>
                                        </div>


                                    </div>
                                </div>

                                <div>
                                    <label for="other_promotion_detail"
                                        class="block text-gray-700 font-bold">รายละเอียดโปรโมชันเพิ่มเติม
                                        (นอกเหนือจากโปรฯ รายเดือนที่ต้องได้รับอนุมัติ)</label>
                                    <textarea id="other_promotion_detail" v-model="saleRecord.other_promotion_detail"
                                        placeholder="กรอกรายละเอียดโปรโมชันเพิ่มเติม" rows="3"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                                </div>

                                <div class="space-y-4 overflow-y-auto flex-grow mt-4">
                                    <strong class="text-custom-orange text-lg">จำนวนที่แถม</strong>
                                    <div class="flex flex-wrap gap-4">
                                        <!-- Free Mad -->
                                        <div class="flex-1">
                                            <label for="freeMad" class="block font-bold text-gray-700">Main Dish</label>
                                            <input id="freeMad" v-model="saleRecord.free_mad" type="number" min="0"
                                                step="1" placeholder="กรอกจำนวน Main Dish"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>

                                        <!-- Free Dessert -->
                                        <div class="flex-1">
                                            <label for="freeDessert"
                                                class="block font-bold text-gray-700">Dessert</label>
                                            <input id="freeDessert" v-model="saleRecord.free_dessert" type="number"
                                                min="0" step="1" placeholder="กรอกจำนวน Dessert"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>

                                        <!-- Free Brittles -->
                                        <div class="flex-1">
                                            <label for="freeBrittles"
                                                class="block font-bold text-gray-700">Brittles</label>
                                            <input id="freeBrittles" v-model="saleRecord.free_brittles" type="number"
                                                min="0" step="1" placeholder="กรอกจำนวน Brittles"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>

                                        <!-- Free Energy Balls -->
                                        <div class="flex-1">
                                            <label for="freeEnergyBalls" class="block font-bold text-gray-700">Energy
                                                Balls</label>
                                            <input id="freeEnergyBalls" v-model="saleRecord.free_energy_balls"
                                                type="number" min="0" step="1" placeholder="กรอกจำนวน Energy Balls"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>
                                    </div>

                                    <div class="flex flex-wrap gap-4">
                                        <!-- Free Dressing -->
                                        <div class="flex-1">
                                            <label for="freeDressing" class="block font-bold text-gray-700">Free
                                                Dressing</label>
                                            <input id="freeDressing" v-model="saleRecord.free_dressing" type="number"
                                                min="0" step="1" placeholder="กรอกจำนวน Free Dressing"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>

                                        <!-- Free Yoghurt -->
                                        <div class="flex-1">
                                            <label for="freeYoghurt"
                                                class="block font-bold text-gray-700">Yoghurt</label>
                                            <input id="freeYoghurt" v-model="saleRecord.free_yoghurt" type="number"
                                                min="0" step="1" placeholder="กรอกจำนวน Yoghurt"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>

                                        <!-- Free Granola -->
                                        <div class="flex-1">
                                            <label for="freeGranola"
                                                class="block font-bold text-gray-700">Granola</label>
                                            <input id="freeGranola" v-model="saleRecord.free_granola" type="number"
                                                min="0" step="1" placeholder="กรอกจำนวน Granola"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>

                                        <div class="flex-1">
                                            <label for="freeCredit" class="block font-bold text-gray-700">เครดิตที่แถม
                                                (บาท)</label>
                                            <input id="freeCredit" v-model="saleRecord.free_credit" type="number"
                                                min="0" step="1" placeholder="กรอกเครดิตที่แถม (บาท)"
                                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                        </div>
                                    </div>
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

                            <div v-if="!isConsignmentOrAdditional && computedTotalPackagePrice > 0">
                                <div class="flex-1">
                                    <label class="block font-bold text-gray-700">
                                        มูลค่าแพ็กเกจรวม: {{ formatPrice(computedTotalPackagePrice) }}
                                    </label>
                                    <p class="text-gray-600">ราคาแพ็กเกจ: {{ formatPrice(saleRecord.package_price) }}
                                    </p>
                                    <p class="text-gray-600">ส่วนลดเพิ่มเติม: {{ formatPrice(saleRecord.discount) }}</p>
                                    <p class="text-gray-600">มูลค่า Extra Charge: {{
                                        formatPrice(computedExtraChargePackagePrice) }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="isConsignmentOrAdditional && computedTotalAdditionalPrice > 0">
                                <label class="block font-bold text-gray-700">
                                    มูลค่าขาย: {{ formatPrice(computedTotalAdditionalPrice) }}
                                </label>
                                <p class="text-gray-600">มูลค่าขาย: {{ formatPrice(saleRecord.add_price) }}</p>
                                <p class="text-gray-600">ส่วนลดเพิ่มเติม: {{ formatPrice(saleRecord.discount) }}</p>
                                <p class="text-gray-600">มูลค่า Extra Charge: {{
                                    formatPrice(computedExtraChargeAdditionalPrice) }}
                                </p>
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

                            <div class="flex-1">
                                <label for="receiveFood" class="block font-bold text-gray-700">วิธีการรับอาหาร</label>
                                <multiselect v-model="saleRecord.receive_food_id" :options="receiveFoods"
                                    placeholder="เลือกวิธีการรับอาหาร" track-by="id" label="name" />
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone1_delivery" class="block font-bold text-gray-700">In-house Riders
                                        (ที่อยู่
                                        1)</label>
                                    <multiselect v-model="saleRecord.zone1_id" :options="filteredInhouse"
                                        placeholder="เลือก In-house Riders (ที่อยู่ 1)" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone1_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone1_quantity" id="zone1_quantity" type="number"
                                        step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>
                            <div v-if="computedZone1Price > 0" class="flex-1">
                                <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 1): {{
                                    formatPrice(computedZone1Price)
                                }}</label>
                                <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                    formatPrice(getZonePrice(saleRecord.zone1_id.id)) }}
                                </p>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone2_delivery" class="block font-bold text-gray-700">In-house Riders
                                        (ที่อยู่
                                        2)</label>
                                    <multiselect v-model="saleRecord.zone2_id" :options="filteredInhouse"
                                        placeholder="เลือก In-house Riders (ที่อยู่ 2)" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone2_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone2_quantity" id="zone2_quantity" type="number"
                                        step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>
                            <div v-if="computedZone2Price > 0" class="flex-1">
                                <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 2): {{
                                    formatPrice(computedZone2Price)
                                }}</label>
                                <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                    formatPrice(getZonePrice(saleRecord.zone2_id.id)) }}
                                </p>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone3_delivery" class="block font-bold text-gray-700">In-house Riders
                                        (ที่อยู่
                                        3)</label>
                                    <multiselect v-model="saleRecord.zone3_id" :options="filteredInhouse"
                                        placeholder="เลือก In-house Riders (ที่อยู่ 3)" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone3_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone3_quantity" id="zone3_quantity" type="number"
                                        step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>
                            <div v-if="computedZone3Price > 0" class="flex-1">
                                <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 3): {{
                                    formatPrice(computedZone3Price)
                                }}</label>
                                <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                    formatPrice(getZonePrice(saleRecord.zone3_id.id)) }}
                                </p>
                            </div>

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="zone_outsource_delivery" class="block font-bold text-gray-700">Outsource
                                        Riders</label>
                                    <multiselect v-model="saleRecord.zone_outsource_id" :options="filteredOutsource"
                                        placeholder="เลือก Outsource Riders" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="zone_outsource_quantity"
                                        class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                    <input v-model="saleRecord.zone_outsource_quantity" id="zone_outsource_quantity"
                                        type="number" step="1" placeholder="กรอกจำนวนครั้ง"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>
                            <div v-if="computedZoneOutsourcePrice > 0" class="flex-1">
                                <label class="block font-bold text-gray-700">ค่าจัดส่งรวม Outsource: {{
                                    formatPrice(computedZoneOutsourcePrice) }}</label>
                                <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                    formatPrice(getZonePrice(saleRecord.zone_outsource_id.id))
                                }}</p>
                            </div>

                            <div v-if="computedTotalDeliveryPrice > 0" class="flex-1">
                                <label class="block font-bold text-gray-700">รวมค่าจัดส่งทั้งหมด: {{
                                    formatPrice(computedTotalDeliveryPrice) }}</label>
                                <p class="text-gray-600">ค่าจัดส่งรวม In-house Riders: {{
                                    formatPrice(computedTotalZonePrice) }}</p>
                                <p class="text-gray-600">ค่าจัดส่งรวม Outsource: {{
                                    formatPrice(computedZoneOutsourcePrice) }}</p>
                            </div>

                            <div v-if="computedTotalPrice > 0" class="flex-1">
                                <label class="block font-bold text-custom-orange">มูลค่าขายรวม: {{
                                    formatPrice(computedTotalPrice) }}</label>

                                <div v-if="computedTotalPackagePrice > 0">
                                    <p class="text-gray-600">มูลค่าแพ็กเกจรวม: {{
                                        formatPrice(computedTotalPackagePrice) }}</p>
                                </div>

                                <div v-if="computedTotalAdditionalPrice > 0">
                                    <p class="text-gray-600">มูลค่าขาย: {{
                                        formatPrice(computedTotalAdditionalPrice) }}</p>
                                </div>

                                <p class="text-gray-600">รวมค่าจัดส่งทั้งหมด: {{ formatPrice(computedTotalDeliveryPrice)
                                }}</p>
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

                            <div class="flex space-x-4">
                                <div class="flex-1">
                                    <label for="deliveryRound"
                                        class="block font-bold text-gray-700">รอบการจัดส่งอาหาร</label>
                                    <multiselect v-model="saleRecord.delivery_round_id" :options="deliveryRounds"
                                        placeholder="เลือกรอบการจัดส่งอาหาร" track-by="id" label="name" />
                                </div>

                                <div class="flex-1">
                                    <label for="selectFood" class="block font-bold text-gray-700">เลือกอาหารโดย</label>
                                    <multiselect v-model="saleRecord.select_food_id" :options="selectFoods"
                                        placeholder="เลือกอาหารโดย" track-by="id" label="name" />
                                </div>
                            </div>

                            <div class="mb-4">
                                <label for="note" class="block text-gray-700 font-bold">Note
                                    รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า
                                    (ถ้ามี)</label>
                                <textarea id="note" v-model="saleRecord.note"
                                    placeholder="กรอก Note รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า (ถ้ามี)" rows="3"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                            </div>

                            <div class="mb-4">
                <label for="Transaction_ref" class="block text-gray-700 font-bold">Transaction No. อื่นใน Payslip
                  เดียวกัน
                  (ถ้ามี)</label>
                <input id="transaction_ref" v-model="saleRecord.transaction_ref"
                  placeholder="กรอก Transaction No. อื่นใน Payslip เดียวกัน (ถ้ามี)"
                  class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y" />
              </div>
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
                                {{
                                    sortDirection["id"] === 1 ? "arrow_upward" : "arrow_downward"
                                }}
                            </span>
                        </li>
                        <li @click="sortData('name')"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                            <span>จัดเรียงตามชื่อลูกค้า</span>
                            <span v-if="sortColumn === 'name'" class="material-symbols-outlined text-sm">
                                {{
                                    sortDirection["name"] === 1
                                        ? "arrow_upward"
                                        : "arrow_downward"
                                }}
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
                        <h3 class="font-bold mb-2">กรองโดย Package Type</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <label v-for="type in filteredPackageTypes" :key="type.id"
                                class="flex items-center space-x-2">
                                <input type="checkbox" v-model="selectedPackageType" :value="type.id"
                                    class="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-custom-orange checked:border-transparent">
                                <span>{{ type.name }}</span>
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

        <div v-if="$route.path === '/sale-records-hhb' || $route.path === '/sale-records-additional-hhb'"
            class="p-4 flex items-left space-x-6 text-m font-bold">
            <router-link to="sale-records-hhb" class="hover:text-custom-orange"
                :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/sale-records-hhb' }">
                บันทึกการขาย 1stTimer, PackageRenewal
            </router-link>
            <router-link to="sale-records-additional-hhb" class="hover:text-custom-orange"
                :class="{ 'text-custom-orange border-b-2 border-custom-orange': $route.path === '/' || $route.path === '/sale-records-additional-hhb' }">
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
                        <td class="px-4 py-2 align-top pb-5 font-bold ">
                            {{ getPackageTypeName(saleRecord.package_type_id) }}
                        </td>
                        <td class="px-4 py-2 align-top pb-5">
                            {{ getSaleTypeName(saleRecord.additional_type_id) }}
                        </td>
                        <td class="px-4 py-2 align-top pb-5">
                            {{ saleRecord.add_detail }}
                        </td>
                        <td class="px-4 py-2 align-top pb-5">
                            {{ formatPrice(saleRecord.total_price) }}
                        </td>

                        <td class="px-4 py-2 align-top font-bold pb-5">
                            <button @click="openConfirmPaymentModal(saleRecord)"
                                class="px-4 py-1 rounded-full font-bold focus:outline-none hover:text-gray-200"
                                :class="getPaymentStatusClass(saleRecord.payment_status)">
                                {{ getPaymentStatusText(saleRecord.payment_status) }}
                            </button>

                            <div v-if="isConfirmPaymentModalOpen"
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
                                    <!-- Header -->
                                    <div :class="{
                                        'bg-green-500':
                                            selectedSaleRecord.payment_status === 'unpaid',
                                        'bg-red-500': selectedSaleRecord.payment_status === 'paid',
                                    }" class="flex justify-between items-center text-white px-4 py-2 rounded-t-md">
                                        <span class="font-bold">
                                            {{
                                                selectedSaleRecord.payment_status === "paid"
                                                    ? "เปลี่ยนสถานะเป็นยังไม่ได้ชำระเงิน"
                                                    : "ยืนยันการชำระเงิน"
                                            }}
                                        </span>
                                        <button @click="closeConfirmPaymentModal"
                                            class="text-white hover:text-gray-200">
                                            <span class="material-symbols-outlined">close</span>
                                        </button>
                                    </div>

                                    <!-- Content -->
                                    <div class="p-6 space-y-4">
                                        <p class="text-gray-700">
                                            {{
                                                selectedSaleRecord.payment_status === "paid"
                                                    ? 'คุณต้องการเปลี่ยนสถานะเป็น "ยังไม่ได้ชำระเงิน" หรือไม่?'
                                                    : "กรุณาเลือกวันที่ชำระเงิน:"
                                            }}
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
                                            'bg-green-500 hover:bg-green-600':
                                                selectedSaleRecord.payment_status === 'unpaid',
                                            'bg-red-500 hover:bg-red-600':
                                                selectedSaleRecord.payment_status === 'paid',
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

                <template v-if="additionalSalesRecords.length < 6 && additionalSalesRecords.length > 0">
                    <tr v-for="emptyIndex in (6 - additionalSalesRecords.length)" :key="'empty-' + emptyIndex"
                        class="bg-white">
                        <td colspan="8" class="py-16"></td>
                    </tr>
                </template>

                <template v-if="additionalSalesRecords.length === 0">
                    <tr>
                        <td colspan="9" class="py-10 bg-white text-center text-gray-500 font-bold">
                            ไม่พบข้อมูล
                        </td>
                    </tr>
                </template>
            </tbody>

            <div v-if="isResultModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">Copy & Paste เพื่อสรุปยอดส่งให้ลูกค้า</span>
                        <div class="flex space-x-2">
                            <span @click="copyResultModalContent"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                {{ isCopied ? "check_circle" : "content_copy" }}
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
                            <p>
                                <template v-if="key === 'name'">
                                    <strong>{{ formatResultLabel(key)
                                        }}<span>{{ value }}</span></strong>
                                </template>
                                <template v-else>
                                    <strong>{{ formatResultLabel(key) }}</strong> {{ value }}
                                </template>
                            </p>
                        </div>

                        <p class="text-gray-500">
                            <strong>📌 กรุณาชำระเงิน ของวันสรุปยอด
                                เพื่อให้ท่านได้รับอาหารตามวันที่กำหนดในรายการสรุปยอดนี้นะคะ</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="isDetailModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div class="bg-white rounded-md shadow-lg w-1/2 max-w-6xl h-auto max-h-[800px] flex flex-col">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">รายละเอียดบันทึกการขาย</span>
                        <div class="flex space-x-2">
                            <span @click="closeDetailModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="pb-2 pt-2 overflow-y-auto flex-grow" ref="modalContent">
                        <div v-for="(value, key, index) in filteredDetailSaleRecord" :key="key" :class="[
                            'p-2 rounded-md',
                            index % 2 === 0 ? 'bg-white rounded-none' : 'bg-gray-100 rounded-none'  // สลับสีบรรทัด
                        ]">
                            <div v-if="key === 'zone1_id'" class="flex items-center space-x-4 pl-3 pr-3">
                                <div class="flex-1">
                                    <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                                    {{ value }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                                    {{ this.selectedSaleRecord.zone1_quantity }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                                    {{ formatPrice(getZonePrice(selectedSaleRecord.zone1_id)) }}
                                </div>
                            </div>

                            <div v-else-if="key === 'zone2_id'" class="flex items-center space-x-4 pl-3 pr-3">
                                <div class="flex-1">
                                    <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                                    {{ value }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                                    {{ this.selectedSaleRecord.zone2_quantity }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                                    {{ formatPrice(getZonePrice(selectedSaleRecord.zone2_id)) }}
                                </div>
                            </div>

                            <div v-else-if="key === 'zone3_id'" class="flex items-center space-x-4 pl-3 pr-3">
                                <div class="flex-1">
                                    <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                                    {{ value }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                                    {{ this.selectedSaleRecord.zone3_quantity }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                                    {{ formatPrice(getZonePrice(selectedSaleRecord.zone3_id)) }}
                                </div>
                            </div>

                            <div v-else-if="key === 'zone_outsource_id'" class="flex items-center space-x-4 pl-3 pr-3">
                                <div class="flex-1">
                                    <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                                    {{ value }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                                    {{ this.selectedSaleRecord.zone_outsource_quantity }}
                                </div>
                                <div class="flex-1">
                                    <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                                    {{ formatPrice(getZonePrice(selectedSaleRecord.zone_outsource_id)) }}
                                </div>
                            </div>

                            <template v-else>
                                <strong class="mr-2 pl-3 pr-3">{{ formatDetailLabel(key) }}:</strong> {{ value }}
                            </template>
                        </div>
                    </div>

                </div>
            </div>

            <div v-if="isEditModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
                    :class="{
                        'opacity-100': showErrorToast,
                        'opacity-0': !showErrorToast,
                    }">
                    <span class="material-symbols-outlined text-white">error</span>
                    <span>{{ toastErrorMessage }}</span>
                    <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold">แก้ไขบันทึกการขาย</span>
                        <div class="flex space-x-2">
                            <span @click="closeEditModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                        <div>
                            <label for="editCustomer" class="block font-bold text-gray-700">ลูกค้า</label>
                            <multiselect v-model="selectedSaleRecord.customer_id" :options="customers"
                                placeholder="เลือกลูกค้า" track-by="id" label="name" class="w-full" />
                        </div>

                        <div>
                            <label for="editPackageType" class="block font-bold text-gray-700">Package Type</label>
                            <multiselect v-model="selectedSaleRecord.package_type_id" :options="filteredPackageTypes"
                                placeholder="เลือก Package Type" track-by="id" label="name" class="w-full" />
                        </div>



                        <div v-if="
                            selectedSaleRecord.package_type_id &&
                            selectedSaleRecord.package_type_id.name.toLowerCase() ===
                            'additional sales' || selectedSaleRecord.package_type_id &&
                            selectedSaleRecord.package_type_id.name.toLowerCase() ===
                            'consignment'
                        ">
                            <div>
                                <label for="additional_type" class="block font-bold text-gray-700">Sales
                                    Type</label>
                                <multiselect v-model="selectedSaleRecord.additional_type_id"
                                    :options="filteredAdditionalTypes" placeholder="เลือก Sales Type" track-by="id"
                                    label="name" />
                            </div>

                            <div>
                                <label for="add_detail" class="block text-gray-700 font-bold">รายละเอียดการขาย</label>
                                <textarea id="add_detail" v-model="selectedSaleRecord.add_detail"
                                    placeholder="กรอกรายละเอียดการขาย" rows="3"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                            </div>

                            <div class="flex-1">
                                <label for="add_price" class="block font-bold text-gray-700">มูลค่าขาย</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-4 flex items-center text-gray-500">฿</span>
                                    <input v-model="selectedSaleRecord.add_price" id="add_price" type="number" step="1"
                                        placeholder="กรอกมูลค่าขาย"
                                        class="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4 overflow-y-auto flex-grow mt-4">
                            <strong class="text-custom-orange text-lg">จำนวนที่แถม</strong>
                            <div class="flex flex-wrap gap-4">
                                <!-- Free Mad -->
                                <div class="flex-1">
                                    <label for="freeMad" class="block font-bold text-gray-700">Main Dish</label>
                                    <input id="freeMad" v-model="selectedSaleRecord.free_mad" type="number" min="0"
                                        step="1" placeholder="กรอกจำนวน Main Dish"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Dessert -->
                                <div class="flex-1">
                                    <label for="freeDessert" class="block font-bold text-gray-700">Dessert</label>
                                    <input id="freeDessert" v-model="selectedSaleRecord.free_dessert" type="number"
                                        min="0" step="1" placeholder="กรอกจำนวน Dessert"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Brittles -->
                                <div class="flex-1">
                                    <label for="freeBrittles" class="block font-bold text-gray-700">Brittles</label>
                                    <input id="freeBrittles" v-model="selectedSaleRecord.free_brittles" type="number"
                                        min="0" step="1" placeholder="กรอกจำนวน Brittles"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Energy Balls -->
                                <div class="flex-1">
                                    <label for="freeEnergyBalls" class="block font-bold text-gray-700">Energy
                                        Balls</label>
                                    <input id="freeEnergyBalls" v-model="selectedSaleRecord.free_energy_balls"
                                        type="number" min="0" step="1" placeholder="กรอกจำนวน Energy Balls"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <!-- Free Dressing -->
                                <div class="flex-1">
                                    <label for="freeDressing" class="block font-bold text-gray-700">Free
                                        Dressing</label>
                                    <input id="freeDressing" v-model="selectedSaleRecord.free_dressing" type="number"
                                        min="0" step="1" placeholder="กรอกจำนวน Free Dressing"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Yoghurt -->
                                <div class="flex-1">
                                    <label for="freeYoghurt" class="block font-bold text-gray-700">Yoghurt</label>
                                    <input id="freeYoghurt" v-model="selectedSaleRecord.free_yoghurt" type="number"
                                        min="0" step="1" placeholder="กรอกจำนวน Yoghurt"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>

                                <!-- Free Granola -->
                                <div class="flex-1">
                                    <label for="freeGranola" class="block font-bold text-gray-700">Granola</label>
                                    <input id="freeGranola" v-model="selectedSaleRecord.free_granola" type="number"
                                        min="0" step="1" placeholder="กรอกจำนวน Granola"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>
                        </div>

                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editDiscount" class="block font-bold text-gray-700">Discount</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-4 flex items-center text-gray-500">฿</span>
                                    <input v-model="selectedSaleRecord.discount" id="discount" type="number" step="1"
                                        placeholder="กรอก Discount"
                                        class="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                                </div>
                            </div>

                            <div class="flex-1">
                                <label for="editExtraCharge" class="block font-bold text-gray-700">Extra Charge
                                    (%)</label>
                                <div class="relative">
                                    <input v-model="selectedSaleRecord.extra_charge" id="extraCharge" type="number"
                                        step="1" min="0" placeholder="กรอก Extra Charge (%)"
                                        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange pr-12" />
                                    <span class="absolute inset-y-0 right-4 flex items-center text-gray-500">%</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="computedEditTotalPackagePrice > 0">
                            <div class="flex-1">
                                <label class="block font-bold text-gray-700">
                                    มูลค่าแพ็กเกจรวม: {{ formatPrice(computedEditTotalPackagePrice) }}
                                </label>
                                <p class="text-gray-600">ราคาแพ็กเกจ: {{ formatPrice(selectedSaleRecord.package_price)
                                    }}</p>
                                <p class="text-gray-600">ส่วนลดเพิ่มเติม: {{ formatPrice(selectedSaleRecord.discount) }}
                                </p>
                                <p class="text-gray-600">มูลค่า Extra Charge: {{
                                    formatPrice(computedEditExtraChargePackagePrice) }}</p>
                            </div>
                        </div>

                        <div>
                            <label for="editReceiveFood" class="block font-bold text-gray-700">วิธีการรับอาหาร</label>
                            <multiselect v-model="selectedSaleRecord.receive_food_id" :options="receiveFoods"
                                placeholder="เลือกวิธีการรับอาหาร" track-by="id" label="name" />
                        </div>

                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editZone1_delivery" class="block font-bold text-gray-700">In-house Riders
                                    (ที่อยู่
                                    1)</label>
                                <multiselect v-model="selectedSaleRecord.zone1_id" :options="filteredInhouse"
                                    placeholder="เลือก In-house Riders (ที่อยู่ 1)" track-by="id" label="name" />
                            </div>

                            <div class="flex-1">
                                <label for="editZone1_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                <input v-model="selectedSaleRecord.zone1_quantity" id="zone1_quantity" type="number"
                                    step="1" placeholder="กรอกจำนวนครั้ง"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                        </div>
                        <div v-if="computedEditZone1Price > 0" class="flex-1">
                            <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 1): {{
                                formatPrice(computedEditZone1Price)
                                }}</label>
                            <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                formatPrice(getZonePrice(selectedSaleRecord.zone1_id.id)) }}
                            </p>
                        </div>

                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editZone2_delivery" class="block font-bold text-gray-700">In-house Riders
                                    (ที่อยู่
                                    2)</label>
                                <multiselect v-model="selectedSaleRecord.zone2_id" :options="filteredInhouse"
                                    placeholder="เลือก In-house Riders (ที่อยู่ 2)" track-by="id" label="name" />
                            </div>

                            <div class="flex-1">
                                <label for="editZone2_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                <input v-model="selectedSaleRecord.zone2_quantity" id="zone2_quantity" type="number"
                                    step="1" placeholder="กรอกจำนวนครั้ง"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                        </div>
                        <div v-if="computedEditZone2Price > 0" class="flex-2">
                            <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 2): {{
                                formatPrice(computedEditZone2Price)
                                }}</label>
                            <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                formatPrice(getZonePrice(selectedSaleRecord.zone2_id.id)) }}
                            </p>
                        </div>

                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editZone3_delivery" class="block font-bold text-gray-700">In-house Riders
                                    (ที่อยู่
                                    3)</label>
                                <multiselect v-model="selectedSaleRecord.zone3_id" :options="filteredInhouse"
                                    placeholder="เลือก In-house Riders (ที่อยู่ 3)" track-by="id" label="name" />
                            </div>

                            <div class="flex-1">
                                <label for="editZone3_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                <input v-model="selectedSaleRecord.zone3_quantity" id="zone3_quantity" type="number"
                                    step="1" placeholder="กรอกจำนวนครั้ง"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                        </div>
                        <div v-if="computedEditZone3Price > 0" class="flex-1">
                            <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 3): {{
                                formatPrice(computedEditZone3Price)
                                }}</label>
                            <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                formatPrice(getZonePrice(selectedSaleRecord.zone3_id.id)) }}
                            </p>
                        </div>

                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editZone_outsource_delivery" class="block font-bold text-gray-700">Outsource
                                    Riders</label>
                                <multiselect v-model="selectedSaleRecord.zone_outsource_id" :options="filteredOutsource"
                                    placeholder="เลือก Outsource Riders" track-by="id" label="name" />
                            </div>

                            <div class="flex-1">
                                <label for="editZone_outsource_quantity"
                                    class="block font-bold text-gray-700">จำนวนครั้ง</label>
                                <input v-model="selectedSaleRecord.zone_outsource_quantity" id="zone_outsource_quantity"
                                    type="number" step="1" placeholder="กรอกจำนวนครั้ง"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                        </div>
                        <div v-if="computedEditZoneOutsourcePrice > 0" class="flex-1">
                            <label class="block font-bold text-gray-700">ค่าจัดส่งรวม Outsource: {{
                                formatPrice(computedEditZoneOutsourcePrice)
                                }}</label>
                            <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                                formatPrice(getZonePrice(selectedSaleRecord.zone_outsource_id.id)) }}</p>
                        </div>


                        <div v-if="computedEditTotalDeliveryPrice > 0" class="flex-1">
                            <label class="block font-bold text-gray-700">รวมค่าจัดส่งทั้งหมด: {{
                                formatPrice(computedEditTotalDeliveryPrice) }}</label>
                            <p class="text-gray-600">ค่าจัดส่งรวม In-house Riders: {{
                                formatPrice(computedEditTotalZonePrice) }}
                            </p>
                            <p class="text-gray-600">ค่าจัดส่งรวม Outsource: {{
                                formatPrice(computedEditZoneOutsourcePrice) }}</p>
                        </div>

                        <div v-if="computedEditTotalPrice > 0" class="flex-1">
                            <label class="block font-bold text-custom-orange">มูลค่าขายรวม: {{
                                formatPrice(computedEditTotalPrice) }}</label>

                            <div>
                                <p class="text-gray-600">มูลค่าแพ็กเกจรวม: {{
                                    formatPrice(computedEditTotalPackagePrice) }}</p>
                            </div>

                            <p class="text-gray-600">รวมค่าจัดส่งทั้งหมด: {{ formatPrice(computedEditTotalDeliveryPrice)
                                }}</p>
                        </div>

                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editSellerName" class="block font-bold text-gray-700">ผู้ขาย</label>
                                <multiselect v-model="selectedSaleRecord.seller_name_id" :options="sellerNames"
                                    placeholder="เลือกผู้ขาย" track-by="id" label="name" />
                            </div>

                            <div class="flex-1">
                                <label for="editStartDate" class="block font-bold text-gray-700">วันเริ่มแพ็คเกจ</label>
                                <input v-model="selectedSaleRecord.start_date" id="startDate" type="date"
                                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                            </div>
                        </div>

                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <label for="editDeliveryRound"
                                    class="block font-bold text-gray-700">รอบการจัดส่งอาหาร</label>
                                <multiselect v-model="selectedSaleRecord.delivery_round_id" :options="deliveryRounds"
                                    placeholder="เลือกรอบการจัดส่งอาหาร" track-by="id" label="name" />
                            </div>

                            <div class="flex-1">
                                <label for="editSelectFood" class="block font-bold text-gray-700">เลือกอาหารโดย</label>
                                <multiselect v-model="selectedSaleRecord.select_food_id" :options="selectFoods"
                                    placeholder="เลือกอาหารโดย" track-by="id" label="name" />
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="editNote" class="block text-gray-700 font-bold">Note
                                รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า
                                (ถ้ามี)</label>
                            <textarea id="note" v-model="selectedSaleRecord.note"
                                placeholder="กรอก Note รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า (ถ้ามี)" rows="3"
                                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
                        </div>
                        <div class="mb-4">
              <label for="editTransaction_ref" class="block text-gray-700 font-bold">Transaction No. อื่นใน Payslip เดียวกัน (ถ้ามี)</label>
              <input id="transaction_ref" v-model="selectedSaleRecord.transaction_ref"
                placeholder="กรอก Transaction No. อื่นใน Payslip เดียวกัน (ถ้ามี)"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y" />
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
                    :class="{
                        'opacity-100': showErrorToast,
                        'opacity-0': !showErrorToast,
                    }">
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

                <button v-for="page in totalPagesArray.range" :key="page" @click="goToPage(page)" :class="[
                    'px-3 py-2 rounded-md',
                    {
                        'bg-custom-orange text-white': currentPage === page,
                        'bg-white': currentPage !== page,
                    },
                ]" class="cursor-pointer hover:bg-custom-orange hover:text-white">
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
import axios from "axios";
import Multiselect from "vue-multiselect";
import { mapActions, mapGetters } from "vuex";

export default {
    components: {
        Multiselect,
    },
    data() {
        return {
            headers: ['#', `Customer's Name`, 'Sales Type', 'ประเภทรายการ', 'รายละเอียดการขาย', 'มูลค่าขายรวม', 'สถานะการชำระเงิน', ''],
            headerWidths: ['5%', '15%', '15%', '15%', '25%', '10%', '15%', '5%'],
            saleRecords: [],

            searchQuery: "",
            filteredSaleRecords: [],

            isAddModalOpen: false,
            saleRecord: {},

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
            deliveryRounds: [],
            receiveFoods: [],
            selectFoods: [],

            packageDetails: null,
            isShowingPackageDetails: false,

            isSortDropdownOpen: false,
            sortDirection: {
                id: 1,
                name: 1,
            },
            sortColumn: "",

            isFilterDropdownOpen: false,
            selectedPackageType: [],
            //filteredSaleRecord: [],

            isDetailModalOpen: false,
            isResultModalOpen: false,

            isDeleteModalOpen: false,
            itemToDelete: null,

            moreOpenDropdownIndex: null,
            selectedSaleRecord: {},
            isCopied: false,

            isEditModalOpen: false,

            isConfirmPaymentModalOpen: false,
            selectedPaidDate: "",
            selectedPaymentTypeId: "",
            // selectedSaleRecord: null,

            currentPage: 1,
            itemsPerPage: 10,

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
        totalPages() {
      return Math.ceil(this.additionalSalesRecords.length / this.itemsPerPage);
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
            // if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer_id) {
            //     return { name: "", expiry_date: "" };
            // }
            return {
                name: this.getCustomerName(this.selectedSaleRecord.customer_id),
                add_detail: this.selectedSaleRecord.add_detail,
                // package: this.selectedSaleRecord.package.package_detail,
                // promotion_detail: this.selectedSaleRecord.package.promotion_detail,
                // receive_food: this.totalReceiveFood,
                // start_date: this.formatDate(this.selectedSaleRecord.start_date),
                sellect_by: this.getSelectFood(this.selectedSaleRecord.select_food_id),
                // delivery_date: this.selectedSaleRecord.customer.delivery_date,
                delivery: this.getDeliveryRoundName(
                    this.selectedSaleRecord.delivery_round_id
                ),
                add_price: this.formatPrice(this.selectedSaleRecord.add_price),
                extra_charge: this.formatPrice(this.selectedSaleRecord.extra_charge),
                discount: this.formatPrice(this.selectedSaleRecord.discount),
                total_delivery_price: this.totalDeliveryPrice,
                total_price: this.formatPrice(this.selectedSaleRecord.total_price),
                // expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
                note: this.selectedSaleRecord.note,
            };
        },

        filteredDetailSaleRecord() {
            if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer_id) {
                return { name: "", expiry_date: "" };
            }
            return {
                transaction: this.selectedSaleRecord.transaction || "",

                seller_name_id: this.getSellerName(
                    this.selectedSaleRecord.seller_name_id
                ),
                name: this.getCustomerName(this.selectedSaleRecord.customer_id) || "",
                additional_type_id: this.getSaleTypeName(this.selectedSaleRecord.additional_type_id),
                package_type: this.getPackageTypeName(this.selectedSaleRecord.package_type_id),
                add_detail: this.selectedSaleRecord.add_detail,
                other_promotion_detail: this.selectedSaleRecord.other_promotion_detail || "",
                discount: this.formatPrice(this.selectedSaleRecord.discount),
                extra_charge: this.formatPercent(this.selectedSaleRecord.extra_charge),
                extra_charge_price: this.formatPrice(
                    this.selectedSaleRecord.extra_charge_price
                ),
                total_package_price: this.formatPrice(
                    this.selectedSaleRecord.total_package_price
                ),
                receive_food_id: this.getReceiveFoodName(
                    this.selectedSaleRecord.receive_food_id
                ),
                zone1_id: this.getZoneName(this.selectedSaleRecord.zone1_id),
                total_zone1_price: this.formatPrice(
                    this.selectedSaleRecord.total_zone1_price
                ),
                zone2_id: this.getZoneName(this.selectedSaleRecord.zone2_id),
                total_zone2_price: this.formatPrice(
                    this.selectedSaleRecord.total_zone2_price
                ),
                zone3_id: this.getZoneName(this.selectedSaleRecord.zone3_id),
                total_zone3_price: this.formatPrice(
                    this.selectedSaleRecord.total_zone3_price
                ),
                zone_outsource_id: this.getZoneName(
                    this.selectedSaleRecord.zone_outsource_id
                ),
                total_zone_outsource_price: this.formatPrice(
                    this.selectedSaleRecord.total_zone_outsource_price
                ),
                total_delivery_zone_price: this.formatPrice(
                    this.selectedSaleRecord.total_delivery_zone_price
                ),
                total_delivery_price: this.formatPrice(
                    this.selectedSaleRecord.total_delivery_price
                ),
                total_price: this.formatPrice(this.selectedSaleRecord.total_price),
                payment_status: this.getPaymentStatusText(
                    this.selectedSaleRecord.payment_status
                ),
                paid_date: this.formatDate(this.selectedSaleRecord.paid_date),
                payment_type_id: this.getPaymentTypeName(
                    this.selectedSaleRecord.payment_type_id
                ),
                transaction_ref: this.selectedSaleRecord.transaction_ref || "",

                // start_date: this.formatDate(this.selectedSaleRecord.start_date),
                // expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
                // receive_date: this.formatDate(this.selectedSaleRecord.start_date),
                note: this.selectedSaleRecord.note || "",
                // package_detail: this.selectedSaleRecord.package?.package_detail || "",
                delivery_date: this.selectedSaleRecord.customer?.delivery_date || "",
                select_food_id: this.getSelectFood(
                    this.selectedSaleRecord.select_food_id
                ),
            };
        },

        zone1_info() {
            const zoneName = this.getZoneName(this.selectedSaleRecord.zone1_id);
            const zoneQuantity = this.selectedSaleRecord.zone1_quantity;
            return `${zoneName} (${zoneQuantity})`;
        },

        zone1Name() {
            return this.selectedSaleRecord.zone1_id
                ? this.getZoneName(this.selectedSaleRecord.zone1_id)
                : "ไม่พบข้อมูล";
        },
        zone2Name() {
            return this.selectedSaleRecord.zone2_id
                ? this.getZoneName(this.selectedSaleRecord.zone2_id)
                : "ไม่พบข้อมูล";
        },
        zone3Name() {
            return this.selectedSaleRecord.zone3_id
                ? this.getZoneName(this.selectedSaleRecord.zone3_id)
                : "ไม่พบข้อมูล";
        },
        zoneOutsourceName() {
            return this.selectedSaleRecord.zone_outsource_id
                ? this.getZoneName(this.selectedSaleRecord.zone_outsource_id)
                : "ไม่พบข้อมูล";
        },

        totalReceiveFood() {
            let foods = [];

            if (this.selectedSaleRecord.package.free_mad > 0) {
                foods.push(`${this.selectedSaleRecord.package.free_mad} x Main Dish`);
            }
            if (this.selectedSaleRecord.package.free_dessert > 0) {
                foods.push(`${this.selectedSaleRecord.package.free_dessert} x Dessert`);
            }
            if (this.selectedSaleRecord.package.free_brittles > 0) {
                foods.push(
                    `${this.selectedSaleRecord.package.free_brittles} x Brittles`
                );
            }
            if (this.selectedSaleRecord.package.free_energy_balls > 0) {
                foods.push(
                    `${this.selectedSaleRecord.package.free_energy_balls} x Energy Balls`
                );
            }
            if (this.selectedSaleRecord.package.free_dressing > 0) {
                foods.push(
                    `${this.selectedSaleRecord.package.free_dressing} x Dressing`
                );
            }
            if (this.selectedSaleRecord.package.free_yoghurt > 0) {
                foods.push(`${this.selectedSaleRecord.package.free_yoghurt} x Yoghurt`);
            }
            if (this.selectedSaleRecord.package.free_granola > 0) {
                foods.push(`${this.selectedSaleRecord.package.free_granola} x Granola`);
            }
            let foodText = foods.length > 0 ? foods.join(" + ") : "";

            return foodText;
        },

        totalDeliveryPrice() {
            let zones = [];
            if (
                this.selectedSaleRecord.zone1_id !== null &&
                this.selectedSaleRecord.zone1_quantity > 0
            ) {
                zones.push(
                    `${this.getZoneName(this.selectedSaleRecord.zone1_id)} x ${this.selectedSaleRecord.zone1_quantity
                    } ครั้ง`
                );
            }

            if (
                this.selectedSaleRecord.zone2_id !== null &&
                this.selectedSaleRecord.zone2_quantity > 0
            ) {
                zones.push(
                    `${this.getZoneName(this.selectedSaleRecord.zone2_id)} x ${this.selectedSaleRecord.zone2_quantity
                    } ครั้ง`
                );
            }

            if (
                this.selectedSaleRecord.zone3_id !== null &&
                this.selectedSaleRecord.zone3_quantity > 0
            ) {
                zones.push(
                    `${this.getZoneName(this.selectedSaleRecord.zone3_id)} x ${this.selectedSaleRecord.zone3_quantity
                    } ครั้ง`
                );
            }

            if (
                this.selectedSaleRecord.zone_outsource_id !== null &&
                this.selectedSaleRecord.zone_outsource_quantity > 0
            ) {
                zones.push(
                    `${this.getZoneName(this.selectedSaleRecord.zone_outsource_id)} x ${this.selectedSaleRecord.zone_outsource_quantity
                    } ครั้ง`
                );
            }

            let zoneText = zones.length > 0 ? `(${zones.join(" + ")})` : "";

            return this.selectedSaleRecord.total_delivery_price > 0
                ? `${this.formatPrice(
                    this.selectedSaleRecord.total_delivery_price
                )} ${zoneText}`
                : "";
        },

        additionalSalesRecords() {
            return this.saleRecords.filter((record) => {
                const packageTypeName = this.getPackageTypeName(record.package_type_id).toLowerCase();
                return packageTypeName === "additional sales" || packageTypeName === "consignment";
            })
                .filter((saleRecord) => {
                    const matchesSearch = this.getCustomerName(
                        saleRecord.customer_id
                    ).toLowerCase().includes(this.searchQuery.toLowerCase());
                    const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id);
                    return matchesSearch && matchesPackageType;
                });

        },

        filteredPackageTypes() {
            return this.packageTypes.filter(type =>
                type.name.toLowerCase().includes('additional sales') ||
                type.name.toLowerCase().includes('consignment')
            );
        },

        isConsignmentOrAdditional() {
            const packageType = this.saleRecord.package_type_id?.name?.toLowerCase();
            return ["consignment", "additional sales"].includes(packageType);
        },
        computedExtraChargePackagePrice() {
            const packagePrice = Number(this.saleRecord.package_price) || 0;
            const extraChargePercent = Number(this.saleRecord.extra_charge) || 0;
            return (packagePrice * extraChargePercent) / 100;
        },
        computedTotalPackagePrice() {
            const packagePrice = Number(this.saleRecord.package_price) || 0;
            const discount = Number(this.saleRecord.discount) || 0;
            const extraCharge = this.computedExtraChargePackagePrice;
            return packagePrice + extraCharge - discount;
        },
        computedExtraChargeAdditionalPrice() {
            const addPrice = Number(this.saleRecord.add_price) || 0;
            const extraChargePercent = Number(this.saleRecord.extra_charge) || 0;
            return (addPrice * extraChargePercent) / 100;
        },
        computedTotalAdditionalPrice() {
            const addPrice = Number(this.saleRecord.add_price) || 0;
            const discount = Number(this.saleRecord.discount) || 0;
            const extraCharge = this.computedExtraChargeAdditionalPrice;
            return addPrice + extraCharge - discount;
        },

        computedZone1Price() {
            if (!this.saleRecord.zone1_id) {
                return 0; // ถ้าไม่มีการเลือก zone ให้ส่งค่ากลับเป็น 0
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone1_id.id
            );
            if (selectedZone && this.saleRecord.zone1_quantity) {
                return selectedZone.price * this.saleRecord.zone1_quantity;
            }
            return 0;
        },
        computedZone2Price() {
            if (!this.saleRecord.zone2_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone2_id.id
            );
            if (selectedZone && this.saleRecord.zone2_quantity) {
                return selectedZone.price * this.saleRecord.zone2_quantity;
            }
            return 0;
        },
        computedZone3Price() {
            if (!this.saleRecord.zone3_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone3_id.id
            );
            if (selectedZone && this.saleRecord.zone3_quantity) {
                return selectedZone.price * this.saleRecord.zone3_quantity;
            }
            return 0;
        },
        computedTotalZonePrice() {
            return this.computedZone1Price + this.computedZone2Price + this.computedZone3Price;
        },

        computedZoneOutsourcePrice() {
            if (!this.saleRecord.zone_outsource_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone_outsource_id.id
            );
            if (selectedZone && this.saleRecord.zone_outsource_quantity) {
                return selectedZone.price * this.saleRecord.zone_outsource_quantity;
            }
            return 0;
        },

        computedTotalDeliveryPrice() {
            return this.computedTotalZonePrice + this.computedZoneOutsourcePrice;
        },

        computedTotalPrice() {
            return this.computedTotalPackagePrice + this.computedTotalAdditionalPrice + this.computedTotalDeliveryPrice;
        },


        isEditConsignmentOrAdditional() {
            const packageType = this.selectedSaleRecord.package_type_id?.name?.toLowerCase();
            return ["consignment", "additional sales"].includes(packageType);
        },
        computedEditExtraChargePackagePrice() {
            const packagePrice = Number(this.selectedSaleRecord.package_price) || 0;
            const extraChargePercent = Number(this.selectedSaleRecord.extra_charge) || 0;
            return (packagePrice * extraChargePercent) / 100;
        },
        computedEditTotalPackagePrice() {
            const packagePrice = Number(this.selectedSaleRecord.package_price) || 0;
            const discount = Number(this.selectedSaleRecord.discount) || 0;
            const extraCharge = this.computedEditExtraChargePackagePrice;
            return packagePrice + extraCharge - discount;
        },
        computedEditZone1Price() {
            if (!this.selectedSaleRecord.zone1_id) {
                return 0; // ถ้าไม่มีการเลือก zone ให้ส่งค่ากลับเป็น 0
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone1_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone1_quantity) {
                return selectedZone.price * this.selectedSaleRecord.zone1_quantity;
            }
            return 0;
        },
        computedEditZone2Price() {
            if (!this.selectedSaleRecord.zone2_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone2_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone2_quantity) {
                return selectedZone.price * this.selectedSaleRecord.zone2_quantity;
            }
            return 0;
        },
        computedEditZone3Price() {
            if (!this.selectedSaleRecord.zone3_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone3_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone3_quantity) {
                return selectedZone.price * this.selectedSaleRecord.zone3_quantity;
            }
            return 0;
        },
        computedEditTotalZonePrice() {
            return this.computedEditZone1Price + this.computedEditZone2Price + this.computedEditZone3Price;
        },
        computedEditZoneOutsourcePrice() {
            if (!this.selectedSaleRecord.zone_outsource_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone_outsource_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone_outsource_quantity) {
                return selectedZone.price * this.selectedSaleRecord.zone_outsource_quantity;
            }
            return 0;
        },
        computedEditTotalDeliveryPrice() {
            return this.computedEditTotalZonePrice + this.computedEditZoneOutsourcePrice;
        },

        computedEditTotalPrice() {
            return this.computedEditTotalPackagePrice + this.computedEditTotalDeliveryPrice;
        },
        filteredAdditionalTypes() {
            return this.additionalTypes.filter(type => !type.name.startsWith("AFF"));
        },
        filteredPrograms() {
            return this.programs.filter(program => program.name.startsWith("Happy"));
        },
        filteredInhouse() {
            return this.zoneDeliveries.filter(zoneDelivery => zoneDelivery.name.startsWith("AFF"));
        },
        filteredOutsource() {
            return this.zoneDeliveries.filter(zoneDelivery => !zoneDelivery.name.startsWith("AFF"));
        },

        ...mapGetters(["saleRecords"]),
    },
    methods: {
        ...mapActions([
            "fetchSaleRecords",
            "fetchLookupData",
            "fetchCustomerAddress",
        ]),

        resetProgramAndPackage() {
            // รีเซ็ตค่าของ program_id และ package_id เมื่อมีการเลือก promotion_type_id ใหม่หรือยกเลิก
            this.saleRecord.program_id = null;
            this.saleRecord.package_id = null;
        },
        formatDate(dateString) {
            if (!dateString) return ""; // หากยังไม่ได้เลือกวันที่

            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const date = new Date(dateString);
            const day = date.getDate(); // วันที่
            const month = months[date.getMonth()]; // ชื่อเดือนแบบย่อ
            const year = date.getFullYear(); // ปี

            return `${day} ${month} ${year}`; // รูปแบบ "28 Jan 2025"
        },
        formatPrice(price) {
            return "฿" + new Intl.NumberFormat("th-TH").format(price);
        },
        formatPercent(percent) {
            return new Intl.NumberFormat("th-TH").format(percent) + "%";
        },

        fetchCustomerAddress(selectedCustomer) {
            if (!selectedCustomer || !selectedCustomer.id) {
                this.customerAddress = "เลือกลูกค้าใหม่";
                this.saleRecord.address_1 = "";
                this.saleRecord.address_2 = "";
                this.saleRecord.address_3 = "";
                return;
            }

            const selectedCustomerId =
                selectedCustomer.id || selectedCustomer.customer_id;
            const customer = this.customers.find((c) => c.id === selectedCustomerId);

            if (customer) {
                this.customerAddress = `${customer.address_1 || ""} ${customer.address_2 || ""
                    } ${customer.address_3 || ""}`.trim();
                this.saleRecord.address_1 = customer.address_1;
                this.saleRecord.address_2 = customer.address_2;
                this.saleRecord.address_3 = customer.address_3;

                if (!this.customerAddress) {
                    this.customerAddress = "ไม่มีที่อยู่";
                }
            } else {
                this.customerAddress = "ไม่พบข้อมูลลูกค้า";
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

      // ใช้ข้อมูลที่กรองแล้วใน filteredSaleRecords1standRenew
      this.filteredSaleRecords = this.additionalSalesRecords.slice(startIndex, endIndex);
    },

    search() {
      const filtered = this.saleRecords.filter((saleRecord) => {
        const matchesSearch = this.getCustomerName(
          saleRecord.customer_id
        ).toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id);
        return matchesSearch && matchesPackageType;
      });

      this.currentPage = 1;
      this.additionalSalesRecords = filtered;
      this.updatePage();
    },
        clearSearch() {
            this.searchQuery = "";
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
                if (column === "name") {
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
            this.sortColumn = "id";
            this.sortDirection.id = 1;
            this.saleRecords.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
            this.updatePage();
        },

        toggleFiltterDropdown() {
            this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
        },
        applyFilter() {
            if (this.selectedPackageType.length > 0) {
                this.filteredSaleRecords = this.packageTypes.filter(packageType =>
                    this.selectedPackageType.includes(packageType.package_type_id)
                );
            } else {
                this.filteredSaleRecords = this.saleRecords;
            }
            this.isFilterDropdownOpen = false;
            this.updatePage();
        },
        clearFilter() {
            this.selectedPackageType = [];
            this.filteredSaleRecords = this.saleRecords;
            this.updatePage();
        },

        toggleMoreDropdown(index) {
            this.moreOpenDropdownIndex =
                this.moreOpenDropdownIndex === index ? null : index;
        },
        moreDropdownPositionClass(index) {
            if (index >= this.filteredSaleRecords.length - 2) {
                return "dropdown-up";
            }
            return "dropdown-down";
        },

        getPaymentStatusText(status) {
            return status === "paid" ? "ชำระเงินแล้ว" : "ยังไม่ได้ชำระเงิน";
        },
        getPaymentStatusClass(status) {
            return status === "paid"
                ? "text-white bg-green-500"
                : "text-white bg-red-500";
        },
        getAddPaymentStatusClass(status) {
            return status === "paid"
                ? "text-green-500 font-bold"
                : "text-red-500 font-bold";
        },

        filterPrograms() {
            if (
                this.saleRecord.promotion_type_id &&
                this.saleRecord.promotion_type_id.id
            ) {
                this.programs = this.allPrograms.filter(
                    (program) =>
                        program.promotion_type_id === this.saleRecord.promotion_type_id.id
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

            try {
                const response = await axios.post("http://127.0.0.1:3333/sale-records-hhb", {
                    customer_id: this.saleRecord.customer_id?.id || null,
                    promotion_type_id: this.saleRecord.promotion_type_id?.id || null,
                    program_id: this.saleRecord.program_id?.id || null,
                    package_id: this.saleRecord.package_id?.id || null,
                    package_type_id: this.saleRecord.package_type_id?.id || null,
                    seller_name_id: this.saleRecord.seller_name_id?.id || null,
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

                    additional_type_id: this.saleRecord.additional_type_id?.id || null,
                    add_detail: this.saleRecord.add_detail || null,
                    add_price: this.saleRecord.add_price || 0,
                    delivery_round_id: this.saleRecord.delivery_round_id?.id || null,
                    select_food_id: this.saleRecord.select_food_id?.id || null,
                    receive_food_id: this.saleRecord.receive_food_id?.id || null,
                    note: this.saleRecord.note || null,

                    free_mad: this.saleRecord.free_mad || 0,
                    free_dessert: this.saleRecord.free_dessert || 0,
                    free_brittles: this.saleRecord.free_brittles || 0,
                    free_energy_balls: this.saleRecord.free_energy_balls || 0,
                    free_dressing: this.saleRecord.free_dressing || 0,
                    free_yoghurt: this.saleRecord.free_yoghurt || 0,
                    free_granola: this.saleRecord.free_granola || 0,

                    free_credit: this.saleRecord.free_credit || 0,
                    other_promotion_detail: this.saleRecord.other_promotion_detail || null,
                    transaction_ref: this.saleRecord.transaction_ref || null,

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
                    this.showErrorToastNotification(
                        error.response.data.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล!"
                    );
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
                customer_id: "",
                promotion_type_id: "",
                program_id: "",
                package_id: "",
                package_type_id: "",
                seller_name_id: "",
                delivery: "",

                package_price: 0,
                discount: 0,
                extra_charge: 0,
                total_package_price: "",

                zone1_id: "",
                zone1_quantity: 0,

                zone2_id: "",
                zone2_quantity: 0,

                zone3_id: "",
                zone3_quantity: 0,

                zone_outsource_id: "",
                zone_outsource_quantity: 0,

                total_delivery_zone_price: "",
                total_delivery_price: "",
                payment_status: "unpaid",
                paid_date: "",
                payment_type_id: "",
                start_date: "",
                expiry_date: "",
                remaining_days: 0,

                additional_type_id: "",
                add_detail: "",
                add_price: 0,

                receive_food_id: "",
                select_food_id: "",
                delivery_round_id: "",
                note: "",

                free_mad: 0,
                free_dessert: 0,
                free_brittles: 0,
                free_energy_balls: 0,
                free_dressing: 0,
                free_yoghurt: 0,
                free_granola: 0,
                free_credit: 0,
                other_promotion_detail: "",
            };
            this.packageDetails = null;
            this.isShowingPackageDetails = false;
            this.customerAddress = null;
            this.filterPrograms();
            this.filterPackages();
        },
        openEditModal(saleRecord) {
            const formatDate = (date) => {
                if (!date) return null;
                const localDate = new Date(date);
                return localDate.toLocaleDateString("en-CA"); // en-CA ใช้ฟอร์แมต YYYY-MM-DD
            };


            this.selectedSaleRecord = {
                ...saleRecord,
                start_date: formatDate(saleRecord.start_date), // แปลงวันที่ก่อนนำไปใช้
                customer_id: this.customers.find(c => c.id === saleRecord.customer_id) || null,
                package_type_id: this.packageTypes.find(p => p.id === saleRecord.package_type_id) || null,
                promotion_type_id: this.promotionTypes.find(p => p.id === saleRecord.promotion_type_id) || null,
                program_id: this.programs.find(p => p.id === saleRecord.program_id) || null,
                package_id: this.packages.find(p => p.id === saleRecord.package_id) || null,
                receive_food_id: this.receiveFoods.find(r => r.id === saleRecord.receive_food_id) || null,
                zone1_id: this.zoneDeliveries.find(z => z.id === saleRecord.zone1_id) || null,
                zone2_id: this.zoneDeliveries.find(z => z.id === saleRecord.zone2_id) || null,
                zone3_id: this.zoneDeliveries.find(z => z.id === saleRecord.zone3_id) || null,
                zone_outsource_id: this.zoneDeliveries.find(z => z.id === saleRecord.zone_outsource_id) || null,
                seller_name_id: this.sellerNames.find(s => s.id === saleRecord.seller_name_id) || null,
                delivery_round_id: this.deliveryRounds.find(d => d.id === saleRecord.delivery_round_id) || null,
                select_food_id: this.selectFoods.find(s => s.id === saleRecord.select_food_id) || null,
                paid_date: formatDate(saleRecord.paid_date),
                payment_type_id: this.paymentTypes.find(p => p.id === saleRecord.payment_type_id) || null,
                additional_type_id: this.additionalTypes.find(s => s.id === saleRecord.additional_type_id) || null,


            };
            this.moreOpenDropdownIndex = null;
            this.isEditModalOpen = true;
        },
        async saveChanges() {
            if (!this.selectedSaleRecord.customer_id) {
                this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
                return;
            }

            try {
                const response = await axios.put(
                    `http://127.0.0.1:3333/sale-records-hhb/${this.selectedSaleRecord.id}`,
                    {
                        customer_id: this.selectedSaleRecord.customer_id?.id || null,
                        promotion_type_id: this.selectedSaleRecord.promotion_type_id?.id || null,
                        program_id: this.selectedSaleRecord.program_id?.id || null,
                        package_id: this.selectedSaleRecord.package_id?.id || null,
                        package_type_id: this.selectedSaleRecord.package_type_id?.id || null,
                        seller_name_id: this.selectedSaleRecord.seller_name_id?.id || null,
                        discount: this.selectedSaleRecord.discount || 0,
                        extra_charge: this.selectedSaleRecord.extra_charge || 0,
                        start_date: this.selectedSaleRecord.start_date || null,
                        zone1_id: this.selectedSaleRecord.zone1_id?.id || null,
                        zone1_quantity: this.selectedSaleRecord.zone1_quantity || 0,

                        zone2_id: this.selectedSaleRecord.zone2_id?.id || null,
                        zone2_quantity: this.selectedSaleRecord.zone2_quantity || 0,

                        zone3_id: this.selectedSaleRecord.zone3_id?.id || null,
                        zone3_quantity: this.selectedSaleRecord.zone3_quantity || 0,

                        zone_outsource_id: this.selectedSaleRecord.zone_outsource_id?.id || null,
                        zone_outsource_quantity: this.selectedSaleRecord.zone_outsource_quantity || 0,

                        additional_type_id: this.selectedSaleRecord.additional_type_id?.id || null,
                        add_detail: this.selectedSaleRecord.add_detail || null,
                        add_price: this.selectedSaleRecord.add_price || 0,
                        delivery_round_id: this.selectedSaleRecord.delivery_round_id?.id || null,
                        select_food_id: this.selectedSaleRecord.select_food_id?.id || null,
                        receive_food_id: this.selectedSaleRecord.receive_food_id?.id || null,
                        note: this.selectedSaleRecord.note || null,

                        free_mad: this.selectedSaleRecord.free_mad || 0,
                        free_dessert: this.selectedSaleRecord.free_dessert || 0,
                        free_brittles: this.selectedSaleRecord.free_brittles || 0,
                        free_energy_balls: this.selectedSaleRecord.free_energy_balls || 0,
                        free_dressing: this.selectedSaleRecord.free_dressing || 0,
                        free_yoghurt: this.selectedSaleRecord.free_yoghurt || 0,
                        free_granola: this.selectedSaleRecord.free_granola || 0,

                        free_credit: this.selectedSaleRecord.free_credit || 0,
                        other_promotion_detail: this.selectedSaleRecord.other_promotion_detail || null,
                        transaction_ref: this.selectedSaleRecord.transaction_ref || null,

                    }
                );

                const index = this.saleRecords.findIndex(
                    (saleRecord) => saleRecord.id === this.selectedSaleRecord.id
                );
                if (index !== -1) {
                    this.saleRecords[index] = response.data;
                }

                this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
                this.closeEditModal();
                await this.fetchSaleRecords();
            } catch (error) {
                console.error("Error saving changes:", error);
                if (error.response && error.response.data) {
                    this.showErrorToastNotification(
                        error.response.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
                    );
                } else {
                    this.showErrorToastNotification("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
                }
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedSaleRecord = {};
        },

        async showPackageDetails(packageId) {
            const selectedSaleRecord = this.packages.find(
                (pkg) => pkg.id === packageId.id
            ); // เข้าถึง id จาก Proxy
            if (selectedSaleRecord) {
                this.packageDetails = selectedSaleRecord;
                this.isShowingPackageDetails = true;
            } else {
                console.error("ไม่พบแพ็คเกจที่เลือก");
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
                const [
                    customersRes,
                    promotionTypesRes,
                    programsRes,
                    packagesRes,
                    packageTypesRes,
                    zoneDeliveryRes,
                    zoneDeliveryTypeRes,
                    sellerNamesRes,
                    paymentTypeRes,
                    additionalTypeRes,
                    deliveryRoundRes,
                    receiveFoodRes,
                    selectFoodRes,
                ] = await Promise.all([
                    axios.get("http://127.0.0.1:3333/customers-hhb"),
                    axios.get("http://127.0.0.1:3333/promotion-types"),
                    axios.get("http://127.0.0.1:3333/programs"),
                    axios.get("http://127.0.0.1:3333/packages"),
                    axios.get("http://127.0.0.1:3333/package-types"),
                    axios.get("http://127.0.0.1:3333/zone-deliveries"),
                    axios.get("http://127.0.0.1:3333/zone-delivery-types"),
                    axios.get("http://127.0.0.1:3333/seller-names"),
                    axios.get("http://127.0.0.1:3333/payment-types"),
                    axios.get("http://127.0.0.1:3333/additional-types"),
                    axios.get("http://127.0.0.1:3333/delivery-rounds"),
                    axios.get("http://127.0.0.1:3333/receive-foods"),
                    axios.get("http://127.0.0.1:3333/select-foods"),
                ]);

                this.customers = customersRes.data;
                this.promotionTypes = promotionTypesRes.data;
                this.allPrograms = programsRes.data || [];
                this.programs = this.allPrograms;
                if (this.saleRecord.promotion_type_id) {
                    this.filterPrograms();
                }

                this.allPackages = packagesRes.data.filter((packaged) => {
                    if (!packaged.start_date) {
                        packaged.displayLabel = packaged.name;
                        return true;
                    }

                    const date = new Date(packaged.start_date);
                    const currentMonth = new Date().getMonth();
                    const startMonth = date.getMonth();

                    if (startMonth === currentMonth) {
                        const thaiMonths = [
                            "มกราคม",
                            "กุมภาพันธ์",
                            "มีนาคม",
                            "เมษายน",
                            "พฤษภาคม",
                            "มิถุนายน",
                            "กรกฎาคม",
                            "สิงหาคม",
                            "กันยายน",
                            "ตุลาคม",
                            "พฤศจิกายน",
                            "ธันวาคม",
                        ];
                        const thaiMonth = thaiMonths[date.getMonth()];
                        const thaiYear = date.getFullYear();

                        packaged.displayLabel = `${packaged.name} (${thaiMonth} ${thaiYear})`;
                        return true;
                    }
                    return false;
                });
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

                this.deliveryRounds = deliveryRoundRes.data;
                this.receiveFoods = receiveFoodRes.data;
                this.selectFoods = selectFoodRes.data;

                this.updatePage;
                //console.log('Fetched payment types:', paymentTypeRes.data);
                //console.log(this.paymentTypes);
            } catch (error) {
                console.error("Error fetching lookup data:", error);
            }
        },

        async fetchSaleRecords() {
            this.isLoading = true;

            try {
                const response = await axios.get("http://127.0.0.1:3333/sale-records-hhb");
                this.saleRecords = response.data;
                this.filteredSaleRecords = response.data;
                this.saleRecords.sort((a, b) => a.id - b.id);
                this.updatePage();
            } catch (error) {
                console.error("Error fetching sale records:", error);
            } finally {
        this.isLoading = false;
      }
        },

        getCustomerName(customerId) {
            const customer = this.customers.find((c) => c.id === customerId);
            return customer ? customer.name : "ไม่พบข้อมูล";
        },
        getPromotionTypeName(promotionTypeId) {
            const promotionType = this.promotionTypes.find((c) => c.id === promotionTypeId);
            return promotionType ? promotionType.name : "ไม่พบข้อมูล";
        },
        getProgramName(programId) {
            const program = this.programs.find((p) => p.id === programId);
            if (program) {
                const promotionType = this.promotionTypes.find(
                    (pt) => pt.id === program.promotion_type_id
                );
                const promotionTypeName = promotionType
                    ? promotionType.name
                    : "ไม่มีโปรโมชั่น"; // กรณีที่ไม่มีข้อมูล PromotionType
                return `${program.name} (${promotionTypeName})`; // แสดงชื่อโปรแกรมพร้อมชื่อโปรโมชั่น
            }
            return "ไม่พบข้อมูล";
        },
        getPackageName(packageId) {
            if (this.allPackages && Array.isArray(this.allPackages)) {
                const packaged = this.allPackages.find((p) => p.id === packageId);
                if (packaged) {
                    if (!packaged.start_date) {
                        return packaged.name;
                    }

                    const date = new Date(packaged.start_date);
                    const currentMonth = new Date().getMonth();
                    const startMonth = date.getMonth();

                    if (startMonth === currentMonth) {
                        const thaiMonths = [
                            "มกราคม",
                            "กุมภาพันธ์",
                            "มีนาคม",
                            "เมษายน",
                            "พฤษภาคม",
                            "มิถุนายน",
                            "กรกฎาคม",
                            "สิงหาคม",
                            "กันยายน",
                            "ตุลาคม",
                            "พฤศจิกายน",
                            "ธันวาคม",
                        ];
                        const thaiMonth = thaiMonths[date.getMonth()];
                        const thaiYear = date.getFullYear();

                        return `${packaged.name} (${thaiMonth} ${thaiYear})`;
                    }
                    return packaged.name;
                }
                return "ไม่พบข้อมูล";
            }
            return "ข้อมูลแพ็คเกจไม่พร้อมใช้งาน";
        },
        getPackageTypeName(packageTypeId) {
            const packageType = this.packageTypes.find((c) => c.id === packageTypeId);
            return packageType ? packageType.name : "ไม่พบข้อมูล";
        },
        getPaymentTypeName(paymentTypeId) {
            const payment_type = this.paymentTypes.find((c) => c.id === paymentTypeId);
            return payment_type ? payment_type.name : null;
        },
        getZoneName(zoneDeliveryId) {
            const zoneDelivery = this.zoneDeliveries.find(
                (z) => z.id === zoneDeliveryId
            );
            return zoneDelivery ? zoneDelivery.name : null;
        },
        getSelectFood(selectFoodId) {
            const selectFood = this.selectFoods.find((z) => z.id === selectFoodId);
            return selectFood ? selectFood.name : " ";
        },
        getReceiveFoodName(receiveFoodId) {
            const receiveFood = this.receiveFoods.find((z) => z.id === receiveFoodId);
            return receiveFood ? receiveFood.name : "";
        },
        getDeliveryRoundName(deiveryRoundId) {
            const deliveryRound = this.deliveryRounds.find(
                (z) => z.id === deiveryRoundId
            );
            return deliveryRound ? deliveryRound.name : " ";
        },
        getSellerName(sellerId) {
            const seller = this.sellerNames.find((z) => z.id === sellerId);
            return seller ? seller.name : " ";
        },
        getZonePrice(zoneId) {
            // สมมติว่า zone_deliveries เป็นอาเรย์หรือออบเจกต์ที่เก็บข้อมูลทั้งหมดของ zone
            const zone = this.zoneDeliveries.find((zone) => zone.id === zoneId);
            return zone ? zone.price : 0; // ถ้าไม่พบ zone ให้คืนค่า 0
        },
        getSaleTypeName(saleTypeId) {
            const additionalType = this.additionalTypes.find((z) => z.id === saleTypeId);
            return additionalType ? additionalType.name : "";
        },

        confirmDelete(itemId) {
            this.itemToDelete = itemId;
            this.isDeleteModalOpen = true;
            this.moreOpenDropdownIndex = null;
        },
        closeDeleteModal() {
            this.isDeleteModalOpen = false;
            this.itemToDelete = null;
        },
        async deleteConfirmed() {
            try {
                await axios.delete(
                    `http://127.0.0.1:3333/sale-records-hhb/${this.itemToDelete}`
                );
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
            // this.selectedSaleRecord = null;
        },
        formatDetailLabel(key) {
            const labels = {
                //customer_id: 'รหัส',
                seller_name_id: "ผู้ขาย",
                name: "ชื่อ-สกุลลูกค้า",
                additional_type_id: "ประเภทรายการ",
                package_type: "Sales Type",
                add_detail: "รายละเอียดการขาย",
                other_promotion_detail: "รายละเอียดเพิ่มเติมที่ต้องได้รับอนุม้ติจาก Director",
                discount: "ส่วนลดเพิ่มเติมจากโปรฯ ประจำเดือน (ถ้ามี)",
                extra_charge: "Extra Charge (%)",
                extra_charge_price: "มูลค่า Extra Charge",
                total_package_price: "มูลค่าขาย",
                receive_food_id: "วิธีการรับอาหาร",

                zone1_id: "In-house Riders (ที่อยู่ 1)",
                total_zone1_price: "ค่าจัดส่งรวม (ที่อยู่ 1)",
                zone2_id: "In-house Riders (ที่อยู่ 2)",
                total_zone2_price: "ค่าจัดส่งรวม (ที่อยู่ 2)",
                zone3_id: "In-house Riders (ที่อยู่ 3)",
                total_zone3_price: "ค่าจัดส่งรวม (ที่อยู่ 3)",
                zone_outsource_id: "Outsource Riders",
                total_zone_outsource_price: "ค่าจัดส่งรวม Outsource",
                total_delivery_zone_price: "ค่าจัดส่งรวม In-house Riders",
                total_delivery_price: "รวมค่าจัดส่งทั้งหมด",

                total_price: "มูลค่าขายรวม",
                payment_status: "สถานะการชำระเงิน",
                paid_date: "วันที่ชำระเงิน",
                payment_type_id: "วิธีการชำระเงิน",
                sellect_by: "เลือกอาหารโดย",
                note: "Note รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า (ถ้ามี)",
                delivery_date: "วันที่ต้องการรับอาหาร",
                select_food_id: "วิธีการเลือกอาหาร",
                transaction_ref: "Transaction No. อื่นใน Payslip เดียวกัน (ถ้ามี)",
        transaction: "Transaction No.",
            };
            return labels[key] || key;
        },
        getLabelClass(key) {
            if (key === "total_package_price") {
                return "text-custom-orange";
            }
            return "";
        },
        getValueClass() {
            return "";
        },

        onViewResultSaleRecord(saleRecord) {
            this.selectedSaleRecord = saleRecord;
            this.isResultModalOpen = true;
            this.moreOpenDropdownIndex = null;
        },
        closeResultModal() {
            this.isResultModalOpen = false;
            // this.selectedSaleRecord = null;
        },
        formatResultLabel(key) {
            const labels = {
                name: "🏷 คุณ",
                add_detail: "▶️ Additional",
                sellect_by: "▶️ เลือกอาหารโดย",
                delivery_date: "▶️ วันที่รับอาหาร",
                delivery: "▶️ จัดส่ง",
                add_price: "▶️ ราคา Additional",
                extra_charge: "▶️ Extra Chrage",
                discount: "▶️ ส่วนลด",
                total_delivery_price: "▶️ ค่าจัดส่ง",
                total_price: "▶️ ยอดชำระ",
                note: "▶️ หมายเหตุ:",
            };
            return labels[key] || key;
        },
        copyResultModalContent() {
            let modalText = this.$refs.modalContent.innerText;
            modalText = modalText.replace(/\n\s*\n/g, "\n");

            if (navigator.clipboard) {
                navigator.clipboard
                    .writeText(modalText)
                    .then(() => {
                        this.isCopied = true;
                        setTimeout(() => {
                            this.isCopied = false;
                        }, 2000);
                    })
                    .catch((err) => {
                        console.error("ไม่สามารถคัดลอกข้อความ:", err);
                    });
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = modalText;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    this.isCopied = true;
                    setTimeout(() => {
                        this.isCopied = false;
                    }, 2000);
                } catch (err) {
                    console.error("ไม่สามารถคัดลอกข้อความ:", err);
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        },

        handleClickOutside(event) {
            if (
                this.$refs.sortDropdown &&
                !this.$refs.sortDropdown.contains(event.target)
            ) {
                this.isSortDropdownOpen = false;
            }

            if (
                this.$refs.filterDropdown &&
                !this.$refs.filterDropdown.contains(event.target)
            ) {
                this.isFilterDropdownOpen = false;
            }

            if (
                !event.target.closest(".dropdown-menu") &&
                !event.target.closest("button")
            ) {
                this.moreOpenDropdownIndex = null;
            }

            if (event.target.closest(".sort")) {
                this.moreOpenDropdownIndex = null;
            }

            if (event.target.closest(".more")) {
                this.isSortDropdownOpen = false;
            }

            if (
                this.$refs.filterDropdown &&
                !this.$refs.filterDropdown.contains(event.target) &&
                !event.target.closest(".filter")
            ) {
                this.isFilterDropdownOpen = false;
            }
        },


        calculateTotalPrice() {
            if (!this.saleRecord.package_id) {
                this.saleRecord.package_price = 0;
                this.saleRecord.total_package_price = 0;
                this.saleRecord.extra_charge_price = 0;
                return;
            }

            const selectedPackage = this.packages.find(pkg => pkg.id === this.saleRecord.package_id.id);
            if (!selectedPackage) {
                this.saleRecord.package_price = 0;
                this.saleRecord.total_package_price = 0;
                this.saleRecord.extra_charge_price = 0;
                return;
            }

            const price = parseFloat(selectedPackage.price) || 0;
            const extraChargePercent = parseFloat(this.saleRecord.extra_charge) || 0;
            const discount = parseFloat(this.saleRecord.discount) || 0;

            const extraChargePrice = (price * extraChargePercent) / 100;
            this.saleRecord.extra_charge_price = extraChargePrice;
            this.saleRecord.package_price = price;
            this.saleRecord.total_package_price = price + extraChargePrice - discount;
        },

        calculateZone1Price() {
            if (!this.saleRecord.zone1_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone1_id.id
            );
            if (selectedZone && this.saleRecord.zone1_quantity) {
                this.computedZone1Price = selectedZone.price * this.saleRecord.zone1_quantity;
            }
        },
        calculateZone2Price() {
            if (!this.saleRecord.zone2_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone2_id.id
            );
            if (selectedZone && this.saleRecord.zone2_quantity) {
                this.computedZone2Price = selectedZone.price * this.saleRecord.zone2_quantity;
            }
        },
        calculateZone3Price() {
            if (!this.saleRecord.zone3_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone3_id.id
            );
            if (selectedZone && this.saleRecord.zone3_quantity) {
                this.computedZone3Price = selectedZone.price * this.saleRecord.zone3_quantity;
            }
        },
        calculateZoneOutsourcePrice() {
            if (!this.saleRecord.zone_outsource_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.saleRecord.zone_outsource_id.id
            );
            if (selectedZone && this.saleRecord.zone_outsource_quantity) {
                this.computedZoneOutsourcePrice = selectedZone.price * this.saleRecord.zone_outsource_quantity;
            }
        },

        calculateEditTotalPrice() {
            if (!this.selectedSaleRecord.package_id) {
                this.selectedSaleRecord.package_price = 0;
                this.selectedSaleRecord.total_package_price = 0;
                this.selectedSaleRecord.extra_charge_price = 0;
                return;
            }

            const selectedPackage = this.packages.find(pkg => pkg.id === this.selectedSaleRecord.package_id?.id);
            if (!selectedPackage) {
                this.selectedSaleRecord.package_price = 0;
                this.selectedSaleRecord.total_package_price = 0;
                this.selectedSaleRecord.extra_charge_price = 0;
                return;
            }

            const price = parseFloat(selectedPackage.price) || 0;
            const extraChargePercent = parseFloat(this.selectedSaleRecord.extra_charge) || 0;
            const discount = parseFloat(this.selectedSaleRecord.discount) || 0;

            const extraChargePrice = (price * extraChargePercent) / 100;
            this.selectedSaleRecord.extra_charge_price = extraChargePrice;
            this.selectedSaleRecord.package_price = price;
            this.selectedSaleRecord.total_package_price = price + extraChargePrice - discount;
        },

        calculateEditZone1Price() {
            if (!this.selectedSaleRecord.zone1_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone1_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone1_quantity) {
                this.computedEditZone1Price = selectedZone.price * this.selectedSaleRecord.zone1_quantity;
            }
        },
        calculateEditZone2Price() {
            if (!this.selectedSaleRecord.zone2_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone2_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone2_quantity) {
                this.computedEditZone2Price = selectedZone.price * this.selectedSaleRecord.zone2_quantity;
            }
        },
        calculateEditZone3Price() {
            if (!this.selectedSaleRecord.zone3_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone3_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone3_quantity) {
                this.computedEditZone3Price = selectedZone.price * this.selectedSaleRecord.zone3_quantity;
            }
        },
        calculateEditZoneOutsourcePrice() {
            if (!this.selectedSaleRecord.zone_outsource_id) {
                return 0;
            }
            const selectedZone = this.zoneDeliveries.find(
                (zone) => zone.id === this.selectedSaleRecord.zone_outsource_id.id
            );
            if (selectedZone && this.selectedSaleRecord.zone_outsource_quantity) {
                this.computedEditZoneOutsourcePrice = selectedZone.price * this.selectedSaleRecord.zone_outsource_quantity;
            }
        },

        clearNotAdditionalForm() {
            this.saleRecord.add_detail = null;
            this.saleRecord.additional_type_id = null;
            this.saleRecord.add_price = 0;
        },
        clearAdditionalForm() {
            this.saleRecord.promotion_type_id = null;
            this.saleRecord.program_id = null;
            this.saleRecord.package_id = null;
        },

        checkPackageType() {
            if (
                this.saleRecord.package_type_id &&
                (this.saleRecord.package_type_id.name.toLowerCase() === 'additional sales' ||
                    this.saleRecord.package_type_id.name.toLowerCase() === 'consignment')
            ) {
                this.clearAdditionalForm();
            } else {
                this.clearNotAdditionalForm();
            }
        },


        openConfirmPaymentModal(saleRecord) {
            this.selectedSaleRecord = saleRecord;
            this.selectedPaidDate = saleRecord.paid_date || "";
            this.isConfirmPaymentModalOpen = true;
            this.moreOpenDropdownIndex = null;
        },
        closeConfirmPaymentModal() {
            this.isConfirmPaymentModalOpen = false;
            // this.selectedSaleRecord = null;
            this.selectedPaidDate = "";
        },
        async confirmPayment() {
            try {
                const newStatus =
                    this.selectedSaleRecord.payment_status === "paid" ? "unpaid" : "paid";

                const paidDate = newStatus === "paid" ? this.selectedPaidDate : null;
                const paymentTypeId =
                    newStatus === "paid" ? this.selectedSaleRecord.payment_type_id?.id : null;

                // ตรวจสอบกรณีที่ payment_status เป็น 'paid' และ payment_type_id หรือ selectedPaidDate เป็น null
                if (
                    newStatus === "paid" &&
                    (!this.selectedPaidDate || !paymentTypeId)
                ) {
                    this.showErrorToastNotification("กรุณาเลือกข้อมูลให้ครบ!");
                    return;
                }

                const payload = {
                    payment_status: newStatus,
                    paid_date: paidDate,
                    payment_type_id: paymentTypeId, // ถ้าเป็น 'unpaid' จะส่ง null
                };

                const response = await axios.put(
                    `http://127.0.0.1:3333/sale-records-hhb/${this.selectedSaleRecord.id}/payment-status`,
                    payload
                );
                await this.fetchSaleRecords();

                if (response.status === 200) {
                    const updatedRecord = response.data.data;
                    const index = this.saleRecords.findIndex(
                        (record) => record.id === updatedRecord.id
                    );
                    if (index !== -1) {
                        this.saleRecords[index] = updatedRecord; // อัปเดตข้อมูลในรายการ
                    }
                    this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
                } else {
                    throw new Error("Unexpected response status");
                }
            } catch (error) {
                console.error("Error updating payment status:", error);
                console.error(
                    "Error response data:",
                    error.response?.data || "No additional data"
                );
                this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
            }
            this.closeConfirmPaymentModal();
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
        "saleRecord.customer_id"(newCustomerId) {
            this.fetchCustomerAddress(newCustomerId);
        },
        "saleRecord.promotion_type_id": function () {
            this.filterPrograms();
        },
        "saleRecord.program_id": function () {
            this.filterPackages();
        },
        "saleRecord.package_id"() {
            this.calculateTotalPrice();
        },
        "saleRecord.discount"() {
            this.calculateTotalPrice();
        },
        "saleRecord.extra_charge"() {
            this.calculateTotalPrice();
        },

        'saleRecord.zone1_id'() {
            this.calculateZone1Price();
        },
        'saleRecord.zone1_quantity'() {
            this.calculateZone1Price();
        },
        'saleRecord.zone2_id'() {
            this.calculateZone2Price();
        },
        'saleRecord.zone2_quantity'() {
            this.calculateZone2Price();
        },
        'saleRecord.zone3_id'() {
            this.calculateZone3Price();
        },
        'saleRecord.zone3_quantity'() {
            this.calculateZone3Price();
        },
        'saleRecord.zone_outsource_id'() {
            this.calculateZoneOutsourcePrice();
        },
        'saleRecord.zone_outsource_quantity'() {
            this.calculateZoneOutsourcePrice();
        },
        'saleRecord.package_type_id': 'checkPackageType',



        "selectedSaleRecord.package_id"() {
            this.calculateEditTotalPrice();
        },
        "selectedSaleRecord.discount"() {
            this.calculateEditTotalPrice();
        },
        "selectedSaleRecord.extra_charge"() {
            this.calculateEditTotalPrice();
        },

        'selectedSaleRecord.zone1_id'() {
            this.calculateEditZone1Price();
        },
        'selectedSaleRecord.zone1_quantity'() {
            this.calculateEditZone1Price();
        },
        'selectedSaleRecord.zone2_id'() {
            this.calculateEditZone2Price();
        },
        'selectedSaleRecord.zone2_quantity'() {
            this.calculateEditZone2Price();
        },
        'selectedSaleRecord.zone3_id'() {
            this.calculateEditZone3Price();
        },
        'selectedSaleRecord.zone3_quantity'() {
            this.calculateEditZone3Price();
        },
        'selectedSaleRecord.zone_outsource_id'() {
            this.calculateEditZoneOutsourcePrice();
        },
        'selectedSaleRecord.zone_outsource_quantity'() {
            this.calculateEditZoneOutsourcePrice();
        },
        'selectedSaleRecord.package_type_id': 'checkEditPackageType',
        searchQuery() {
            this.updatePage();
        },
        currentPage() {
            this.updatePage();
        },
    },
    created() {
        this.filteredSaleRecords = this.saleRecords;
        this.sortData("id");
        this.fetchLookupData();
        this.fetchSaleRecords();
        this.updatePage();
    },
    mounted() {
        document.addEventListener("click", this.handleClickOutside);
        this.fetchLookupData();
        this.fetchSaleRecords();
        this.updatePage();
    },
    beforeUnmount() {
        document.removeEventListener("click", this.handleClickOutside);
    },
};
</script>

<style>
.dropdown-up {
    bottom: 100%;
    margin-bottom: 4px;
}
</style>