<template>
    <div class="mt-[-20px]">
        <div class="flex items-center space-x-3 py-2">
            <!-- ปุ่มลูกศรย้อนกลับ -->
            <button @click="changeDate(-1)" class="flex items-center">
                <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
                    chevron_backward
                </span>
            </button>

            <button @click="setToday"
                class="flex items-center text-custom-orange hover:underline hover:text-custom-orange">
                <span class="mr-2 font-bold">วันนี้</span>
            </button>

            <button @click="changeDate(1)" class="flex items-center">
                <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
                    chevron_forward
                </span>
            </button>

            <strong class="text-gray-700">Start Date:</strong>
            <input ref="startDatepicker" type="text" v-model="formattedStartDate" @input="onStartDateChange"
                class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-[150px]"
                placeholder="เลือกวันที่เริ่มต้น" />

            <strong class="text-gray-700">End Date:</strong>
            <input ref="endDatepicker" type="text" v-model="formattedEndDate" @input="onEndDateChange"
                class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-[150px]"
                placeholder="เลือกวันที่สิ้นสุด" />


        </div>

        <div class="flex space-x-5">
            <!-- First Box (Original Box) -->
            <div class="bg-white shadow rounded-lg p-4 h-48 flex flex-col items-center justify-center space-y-5">
                <!-- Icon Section -->
                <div class="bg-gray-100 text-gray-600 shadow p-3 rounded-md">
                    <span class="material-symbols-outlined text-3xl">
                        payments
                    </span>
                </div>

                <!-- Text Section -->
                <div class="text-center">
                    <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(totalSales) }}</p>
                    <p class="text-sm text-gray-600">ยอดขายทั้งหมด</p>
                </div>
            </div>

            <!-- Second Box (New Box) -->
            <div class="bg-white shadow rounded-lg p-4 h-48 flex flex-col items-center justify-center space-y-5">
                <!-- Icon Section -->
                <div class="bg-gray-100 text-gray-600 shadow p-3 rounded-md">
                    <span class="material-symbols-outlined text-3xl">
                        payments
                    </span>
                </div>

                <!-- Text Section -->
                <div class="text-center">
                    <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(totalSalesBeforeVAT) }}</p>
                    <p class="text-sm text-gray-600">ยอดขายทั้งหมดก่อน VAT</p>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-4 h-48 flex flex-col items-center justify-center space-y-5">
                <!-- Icon Section -->
                <div class="bg-gray-100 text-gray-600 shadow p-3 rounded-md">
                    <span class="material-symbols-outlined text-3xl">
                        package_2
                    </span>
                </div>

                <!-- Text Section -->
                <div class="text-center">
                    <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(totalPackageBeforeVAT) }}</p>
                    <p class="text-sm text-gray-600">ยอดขายสินค้าก่อน VAT</p>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-4 h-48 flex flex-col items-center justify-center space-y-5">
                <!-- Icon Section -->
                <div class="bg-gray-100 text-gray-600 shadow p-3 rounded-md">
                    <span class="material-symbols-outlined text-3xl">
                        local_shipping
                    </span>
                </div>

                <!-- Text Section -->
                <div class="text-center">
                    <p class="text-3xl font-bold text-custom-orange">{{ formatPrice(totalDeliveryBeforeVAT) }}</p>
                    <p class="text-sm text-gray-600">ยอดขายค่าส่งก่อน VAT</p>
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center space-x-2 relative">
            <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
                <span class="material-symbols-outlined text-2xl text-gray-700">calendar_month</span>
                <span class="text-m text-gray-700">จำนวนการยอดขายประจำวันทั้งหมด: </span>
                <span class="text-m text-custom-orange font-bold"> {{ dailySales.length }} รายการ</span>
            </div>


            <!-- <button v-if="selectedSeller" @click="clearSelectedSeller"
                class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-gray-600 ">
                <span class="material-symbols-outlined text-xl leading-none"> close </span>
                <span class="text-base leading-none"> รีเซ็ต </span>

            </button>
            <div>
                <multiselect v-model="selectedSeller" :options="sellers" :placeholder="'เลือกยอดขายแพ็กเกจของเซลล์'"
                    track-by="id" label="name" @select="filterSalesBySeller">
                </multiselect>
            </div>

            <button @click="togglePaymentTableVisibility"
                class="bg-custom-orange text-white p-2 rounded-md hover:bg-custom-orange-hover">
                แสดงข้อมูลยอดขายตามประเภทการชำระเงิน
            </button> -->
        </div>

        <!-- <div v-if="selectedSeller && groupedsalesBySellerAndPackageType">
            <table class="min-w-full table-fixed border-collapse mt-4">
                <thead>
                    <tr class="bg-custom-orange text-white">
                        <th class="px-4 py-2 text-left font-bold">ผู้ขาย</th>
                        <th class="px-4 py-2 text-left font-bold">ประเภทแพ็คเกจ</th>
                        <th class="px-4 py-2 text-left font-bold">ยอดขายรวม</th>
                        <th class="px-4 py-2 text-left font-bold">ยอดขายรวมก่อน VAT</th>
                    </tr>
                </thead>
                <tbody>
                    <template
                        v-if="groupedsalesBySellerAndPackageType && Object.keys(groupedsalesBySellerAndPackageType).length > 0">
                        <template v-for="(sales, seller) in groupedsalesBySellerAndPackageType" :key="seller">
                            <tr v-for="(sale, index) in sales" :key="`${sale.package_type_id}-${index}`"
                                class="customers-data bg-white relative">
                                <td v-if="index === 0" :rowspan="sales.length"
                                    class="px-4 py-2 align-top font-bold text-custom-orange">
                                    {{ getSellerName(seller) }}
                                </td>
                                <td class="px-4 py-2 align-top font-bold">{{ getPackageTypeName(sale.package_type_id) }}
                                </td>
                                <td class="px-4 py-2 align-top">{{ formatPrice(sale.total_sales) }}</td>
                                <td class="px-4 py-2 align-top">{{ formatPrice(sale.pre_vat) }}</td>
                            </tr>
                        </template>


</template>

<tr v-else>
    <td colspan="4" class="py-10 bg-white text-center text-gray-500 font-bold">
        ไม่พบข้อมูล
    </td>
</tr>

<tr class="bg-white font-bold">
    <td colspan="2" class="px-4 py-2 text-right text-custom-orange">รวมทั้งหมด</td>
    <td class="px-4 py-2">{{ formatPrice(totalSalesSum) }}</td>
    <td class="px-4 py-2">{{ formatPrice(totalPreVatSum) }}</td>
</tr>

</tbody>
</table>
</div> -->

        <div class="flex space-x-4">

            <table class="w-full min-w-1/2 table-auto rounded-2xl overflow-hidden mt-4">
                <thead>
                    <tr class="bg-purple-500 text-white">
                        <th class="px-4 py-2 text-left font-bold">ผู้ขาย</th>
                        <th class="px-4 py-2 text-left font-bold">Package Type</th>
                        <th class="px-4 py-2 text-left font-bold">ยอดขายรวม</th>
                        <th class="px-4 py-2 text-left font-bold">ยอดขายรวมก่อน VAT</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="filteredSalesBySellerAddit.length === 0">
                        <tr>
                            <td colspan="4" class=" bg-white text-center text-gray-500 font-bold">
                                ไม่มีข้อมูลยอดขาย
                            </td>
                        </tr>
                    </template>

                    <template v-for="(groupedSale, index) in filteredSalesBySellerAddit" :key="index">
                        <tr v-for="(sale, saleIndex) in groupedSale.sales" :key="saleIndex"
                            class=" bg-white relative border-b border-b-gray-200">
                            <td v-if="saleIndex === 0" class="px-4 py-2 align-top font-bold">
                                {{ getSellerName(groupedSale.sellerId) }}
                            </td>
                            <td v-else class="px-4 py-2 align-top"></td>
                            <td class="px-4 py-2 align-top pb-5">{{ getPackageTypeName(sale.package_type_id) }}</td>
                            <td class="px-4 py-2 align-top">{{ formatPrice(sale.total_sales) }}</td>
                            <td class="px-4 py-2 align-top">{{ formatPrice(sale.pre_vat) }}</td>
                        </tr>

                        <!-- แสดงยอดขายรวมทั้งหมด -->
                        <tr class="bg-purple-100" style="height: 50px;">
                            <td colspan="4" class="px-4 py-2 text-right">
                                <span class="font-bold mr-2">ยอดขายรวมทั้งหมด:</span>
                                {{ formatPrice(groupedSale.totalSales) }}
                                <span class="ml-4">|</span>
                                <span class="font-bold ml-4 mr-2">ยอดขายรวมทั้งหมดก่อน VAT:</span>
                                {{ formatPrice(groupedSale.totalPreVat) }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>


            <table class="w-full min-w-1/2 table-auto rounded-2xl overflow-hidden mt-4">
                <thead>
                    <tr class="bg-green-500 text-white">
                        <th class="px-4 py-2 text-left font-bold">วิธีการชำระเงิน</th>
                        <th class="px-4 py-2 text-left font-bold">ยอดขายรวม</th>
                        <th class="px-4 py-2 text-left font-bold">ยอดขายรวมก่อน VAT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(sale, index) in salesByPaymentType" :key="index"
                        class=" bg-white relative border-b border-b-gray-200">
                        <td class="px-4 py-2 align-top font-bold pb-5">{{ getPaymentTypeName(sale.payment_type_id) }}
                        </td>
                        <td class="px-4 py-2 align-top">
                            {{ formatPrice(sale.total_sales) }}
                        </td>
                        <td class="px-4 py-2 align-top">
                            {{ formatPrice(sale.pre_vat) }}
                        </td>
                    </tr>
                    <tr v-if="salesByPaymentType.length === 0">
                        <td colspan="3" class="py-10 bg-white text-center text-gray-500 font-bold">
                            ไม่มีข้อมูลยอดขายตามประเภทการชำระเงิน
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <table class="min-w-full table-auto rounded-2xl overflow-hidden mt-4">
            <thead>
                <tr class="bg-pink-500 text-white">
                    <th class="px-4 py-2 text-left font-bold">ผู้ขาย</th>
                    <th class="px-4 py-2 text-left font-bold">Package Type</th>
                    <th class="px-4 py-2 text-left font-bold">ยอดขายรวม</th>
                    <th class="px-4 py-2 text-left font-bold">ยอดขายรวมก่อน VAT</th>
                </tr>
            </thead>
            <tbody>
                <!-- ตรวจสอบว่า filteredSalesBySeller มีข้อมูลหรือไม่ -->
                <template v-if="filteredSalesBySeller.length === 0">
                    <tr>
                        <td colspan="4" class="py-10 bg-white text-center text-gray-500 font-bold">
                            ไม่มีข้อมูลยอดขาย
                        </td>
                    </tr>
                </template>

                <template v-for="(groupedSale, index) in filteredSalesBySeller" :key="index">
                    <tr v-for="(sale, index) in groupedSale.sales" :key="index"
                        class="border-b border-b-gray-200 bg-white relative">
                        <td v-if="index === 0" class="px-4 py-2 align-top font-bold pb-5">
                            {{ getSellerName(groupedSale.sellerId) }}
                        </td>
                        <td v-else class="px-4 py-2 align-top"></td>
                        <td class="px-4 py-2 align-top  pb-5">{{ getPackageTypeName(sale.package_type_id) }}</td>
                        <td class="px-4 py-2 align-top">{{ formatPrice(sale.total_sales) }}</td>
                        <td class="px-4 py-2 align-top">{{ formatPrice(sale.pre_vat) }}</td>
                    </tr>

                    <tr v-if="groupedSale.sales.length > 0" class="bg-pink-100">
                        <td colspan="4" class="px-4 py-2 text-right">
                            <span class="font-bold mr-2">ยอดขายรวมทั้งหมด:</span>
                            {{ formatPrice(groupedSale.totalSales) }}
                            <span class="font-bold ml-14 mr-2">ยอดขายรวมทั้งหมดก่อน VAT:</span>
                            {{ formatPrice(groupedSale.totalPreVat) }}
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>

        <table class="min-w-full table-auto rounded-2xl overflow-hidden mt-4">
            <thead>
                <tr class="bg-custom-orange text-white">
                    <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
                        :style="{ width: headerWidths[index], cursor: 'pointer' }" @click="sortColumn(header)"
                        class="items-center hover:text-gray-200">
                        <span>{{ header }}</span>
                        <span v-if="header === 'Transaction Date'" class="ml-2 items-center">
                            <span class="material-symbols-outlined text-sm">{{ sortIcon }}</span>
                        </span>
                    </th>
                </tr>

            </thead>
            <tbody>
                <tr v-for="(sale, index) in filteredDailySales" :key="index" class="border-b border-b-gray-200 bg-white relative">
                    <td class="px-4 py-2 align-top pb-5">{{ formatDate(sale.paid_date) }}</td>
                    <td class="px-4 py-2 align-top font-bold text-custom-orange">{{ getCustomerName(sale.customer_id) }}
                    </td>
                    <td class="px-4 py-2 align-top">{{ getPackageTypeName(sale.package_type_id) }}</td>
                    <td class="px-4 py-2 align-top">{{ getPromotionTypeName(sale.promotion_type_id) }}</td>
                    <td class="px-4 py-2 align-top">{{ getPackageName(sale.package_id) ||
                        getAdditionalTypeName(sale.additional_type_id) }}</td>
                    <td class="px-4 py-2 align-top">{{ getPromotionDetail(sale.package_id) || sale.add_detail }}
                    </td>
                    <td class="px-4 py-2 align-top">{{ formatPrice(sale.total_price) }}</td>
                    <td class="px-4 py-2 align-top">{{ getPaymentTypeName(sale.payment_type_id) }}</td>
                    <td class="px-4 py-2 align-top">{{ getSellerName(sale.seller_name_id) }}</td>
                    <td class="px-4 py-2 align-top text-right list-none">
                        <li @click="onViewDetails(sale)"
                            class="px-2 py-1 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                            <span>รายละเอียด</span>
                        </li>
                    </td>
                </tr>

                <tr v-if="filteredDailySales.length === 0">
                    <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">ไม่พบข้อมูล</td>
                </tr>
            </tbody>

            <div v-if="isDetailModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">
                    <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
                        <span class="font-bold"><h2>รายละเอียดยอดขายประจำวัน</h2></span>
                        <div class="flex space-x-2">
                            <span @click="closeDetailModal"
                                class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                                close
                            </span>
                        </div>
                    </div>

                    <div class="pb-2 pt-2">
                        <div v-for="(value, key, index) in filteredDetail" :key="key"
                            :class="index % 2 === 0 ? 'bg-white rounded-none' : 'bg-gray-100 rounded-none'"
                            class="p-2 rounded-md">
                            <p class="pl-3 pr-3"><strong class="mr-2">{{ formatLabel(key) }}:</strong> {{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>


        </table>



        <!-- <div class="rounded-b-2xl flex justify-center items-center space-x-2 bg-white px-2 py-1">
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
        </div> -->

    </div>


</template>

<script>
import axios from 'axios';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
//import Multiselect from 'vue-multiselect';

export default {
    data() {
        return {
            headers: ['Transaction Date', `Customer's Name`, 'Package Type', 'Sales Category', 'Package/Purchase Details', 'Details', 'ยอดขายรวม', 'วิธีการชำระเงิน', 'Sales Rep', ' '],
            headerWidths: ['10%', '12%', '10%', '10%', '13%', '12%', '8%', '10%', '7%', '8%'],
            sortDirection: 'asc', // กำหนดทิศทางการเรียงลำดับ (asc หรือ desc)
            sortIcon: 'arrow_downward',

            filteredDailySales: [],
            selectedDate: "",
            dailySales: [],
            totalSales: 0,
            totalSalesBeforeVAT: 0,
            totalPackageBeforeVAT: 0,
            totalDeliveryBeforeVAT: 0,
            salesByPaymentType: [],

            customers: [],
            packages: [],
            promotion_types: [],
            seller_names: [],
            payment_types: [],
            package_types: [],
            selectedPackageTypeId: "",
            additional_types: [],

            isPaymentTableVisible: false,

            selectedSeller: "",  // สำหรับเก็บผู้ขายที่เลือก
            // isSellerDropdownOpen: false,
            salesBySellerAndPackageType: [],
            sellers: [], // List of seller_name_id
            groupedsalesBySellerAndPackageType: null,

            // currentPage: 1,
            // itemsPerPage: 10,

            startDate: '', // วันที่เริ่มต้น
            endDate: '',

            isDetailModalOpen: false,
            selectedDailySaleDetail: {},
        };
    },
    // components: {
    //     Multiselect
    // },
    computed: {
        // totalPages() {
        //     return Math.ceil(
        //         this.dailySales.length / this.itemsPerPage
        //     );
        // },
        // totalPagesArray() {
        //     const maxVisiblePages = 5;
        //     const halfVisible = Math.floor(maxVisiblePages / 2);

        //     let start = this.currentPage - halfVisible;
        //     let end = this.currentPage + halfVisible;

        //     if (start < 1) {
        //         start = 1;
        //         end = Math.min(maxVisiblePages, this.totalPages);
        //     }

        //     if (end > this.totalPages) {
        //         end = this.totalPages;
        //         start = Math.max(1, this.totalPages - maxVisiblePages + 1);
        //     }

        //     return {
        //         start,
        //         end,
        //         range: Array.from({ length: end - start + 1 }, (_, i) => start + i),
        //     };
        // },
        // formattedDate() {
        //     if (this.startDate && this.endDate) {
        //         return `${this.formatDate(this.startDate)} ถึง ${this.formatDate(this.endDate)}`;
        //     }
        //     return 'กรุณาเลือกวันที่';
        // },
        totalSalesSum() {
            if (!this.groupedsalesBySellerAndPackageType) return 0;
            return Object.values(this.groupedsalesBySellerAndPackageType)
                .flat()
                .reduce((sum, sale) => {
                    const totalSales = parseFloat(sale.total_sales) || 0; // แปลงเป็นตัวเลข หรือค่าเริ่มต้น 0
                    return sum + totalSales;
                }, 0);
        },
        totalPreVatSum() {
            if (!this.groupedsalesBySellerAndPackageType) return 0;
            return Object.values(this.groupedsalesBySellerAndPackageType)
                .flat()
                .reduce((sum, sale) => {
                    const preVat = parseFloat(sale.pre_vat) || 0; // แปลงเป็นตัวเลข หรือค่าเริ่มต้น 0
                    return sum + preVat;
                }, 0);
        },
        filteredSalesBySellerAddit() {
            return Object.keys(this.salesBySellerAndPackageType).map(sellerId => {
                const filteredSales = this.salesBySellerAndPackageType[sellerId].sales.filter(sale => {
                    const packageTypeName = this.getPackageTypeName(sale.package_type_id).toLowerCase();
                    return packageTypeName === 'additional sales' || packageTypeName === 'consignment';
                });

                return {
                    sellerId,
                    sales: filteredSales,
                    totalSales: filteredSales.reduce((total, sale) => total + parseFloat(sale.total_sales), 0),
                    totalPreVat: filteredSales.reduce((total, sale) => total + parseFloat(sale.pre_vat), 0)
                };
            }).filter(group => group.sales.length > 0); // เอาเฉพาะผู้ขายที่มียอดขาย
        },
        filteredSalesBySeller() {
            return Object.keys(this.salesBySellerAndPackageType).map(sellerId => {
                const filteredSales = this.salesBySellerAndPackageType[sellerId].sales.filter(sale => {
                    const packageTypeName = this.getPackageTypeName(sale.package_type_id).toLowerCase();
                    return packageTypeName !== 'additional sales' && packageTypeName !== 'consignment';  // เพิ่มเงื่อนไขกรอง 'consignment' ด้วย
                });

                return {
                    sellerId,
                    sales: filteredSales,
                    totalSales: filteredSales.reduce((total, sale) => total + parseFloat(sale.total_sales), 0),
                    totalPreVat: filteredSales.reduce((total, sale) => total + parseFloat(sale.pre_vat), 0)
                };
            }).filter(group => group.sales.length > 0); // เอาเฉพาะผู้ขายที่มียอดขาย
        },
        formattedStartDate() {
            if (!this.startDate) return ""; // หากยังไม่ได้เลือกวันที่
            return new Intl.DateTimeFormat("en-UK", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(this.startDate));
        },
        formattedEndDate() {
            if (!this.endDate) return ""; // หากยังไม่ได้เลือกวันที่
            return new Intl.DateTimeFormat("en-UK", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(this.endDate));
        },

        filteredDetail() {
            return {
                paid_date: this.formatDate(this.selectedDailySaleDetail.paid_date),
                customer_id: this.getCustomerName(this.selectedDailySaleDetail.customer_id),
                package_type_id: this.getPackageTypeName(this.selectedDailySaleDetail.package_type_id),
                package_id: this.getPackageName(this.selectedDailySaleDetail.package_id) || this.getAdditionalTypeName(this.selectedDailySaleDetail.additional_type_id),
                promotion_type_id: this.getPromotionTypeName(this.selectedDailySaleDetail.promotion_type_id),
                package_price: this.formatPrice(this.getPackagePrice(this.selectedDailySaleDetail.package_id)),
                package_detail: this.getPromotionDetail(this.selectedDailySaleDetail.package_id) || this.selectedDailySaleDetail.add_detail,
                discount: this.formatPrice(this.selectedDailySaleDetail.discount),
                extra_charge: this.formatPercent(this.selectedDailySaleDetail.extra_charge),
                extra_charge_price: this.formatPrice(this.selectedDailySaleDetail.extra_charge_price),
                total_package_price: this.formatPrice(this.selectedDailySaleDetail.total_package_price),
                total_delivery_price: this.formatPrice(this.selectedDailySaleDetail.total_delivery_price),
                total_price: this.formatPrice(this.selectedDailySaleDetail.total_price),
                payment_type_id: this.getPaymentTypeName(this.selectedDailySaleDetail.payment_type_id),
                seller_name_id: this.getSellerName(this.selectedDailySaleDetail.seller_name_id),

            };
        },


    },
    methods: {
        // goToPage(page) {
        //     if (page < 1 || page > this.totalPages) return;
        //     this.currentPage = page;
        //     // this.updatePage();
        // },
        // updatePage() {
        //     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        //     const endIndex = startIndex + this.itemsPerPage;

        //     this.filteredPackage = this.packages.filter((packaged) => {
        //         const matchesSearch = packaged.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        //             packaged.id.toString().includes(this.searchQuery);
        //         const matchesProgram = this.selectedProgram.length === 0 || this.selectedProgram.includes(packaged.program_id);
        //         return matchesSearch && matchesProgram;
        //     }).slice(startIndex, endIndex);
        // },

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
            return '฿' + new Intl.NumberFormat('th-TH', {
                minimumFractionDigits: 2,  // ตั้งค่าจำนวนตำแหน่งทศนิยมขั้นต่ำ
                maximumFractionDigits: 2   // ตั้งค่าจำนวนตำแหน่งทศนิยมสูงสุด
            }).format(price);
        },
        formatPercent(percent) {
            return new Intl.NumberFormat("th-TH").format(percent) + "%";
        },

        togglePaymentTableVisibility() {
            this.isPaymentTableVisible = !this.isPaymentTableVisible; // Toggle visibility
        },

        onStartDateChange(event) {
            const inputDate = new Date(event.target.value);
            if (!isNaN(inputDate)) {
                this.startDate = inputDate.toISOString(); // เก็บวันที่ในรูปแบบ ISO
            }
        },
        onEndDateChange(event) {
            const inputDate = new Date(event.target.value);
            if (!isNaN(inputDate)) {
                this.endDate = inputDate.toISOString(); // เก็บวันที่ในรูปแบบ ISO
            }
        },

        sortColumn(header) {
            if (header === 'Transaction Date') {
                // สลับทิศทางการเรียงลำดับเมื่อคลิก
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

                // กำหนดไอคอนให้เหมาะสมกับทิศทางการเรียงลำดับ
                this.sortIcon = this.sortDirection === 'asc' ? 'arrow_downward' : 'arrow_upward';

                // เรียงลำดับข้อมูลตามวันที่ชำระเงิน
                this.filteredDailySales.sort((a, b) => {
                    const dateA = new Date(a.paid_date);
                    const dateB = new Date(b.paid_date);

                    return this.sortDirection === 'asc'
                        ? dateA - dateB
                        : dateB - dateA;
                });
            }
        },

        async fetchDailySales(startDate, endDate) {
            try {
                const response = await axios.get('http://127.0.0.1:3333/sales/daily', {
                    params: { startDate, endDate },
                });

                // ดึงข้อมูลจาก API มาแสดงผล
                this.dailySales = response.data.data.dailySales;
                this.filteredDailySales = this.dailySales;
                this.totalSales = response.data.data.totalSales;
                this.totalSalesBeforeVAT = response.data.data.totalSalesBeforeVAT;
                this.totalPackageBeforeVAT = response.data.data.totalPackageBeforeVAT;
                this.totalDeliveryBeforeVAT = response.data.data.totalDeliveryBeforeVAT;
                this.salesByPaymentType = response.data.data.salesByPaymentType;
                this.salesBySellerAndPackageType = response.data.data.salesBySellerAndPackageType;

                // จัดการรายชื่อผู้ขายสำหรับการกรอง
                this.sellers = this.seller_names.map((seller) => ({
                    id: seller.id,
                    name: seller.name,
                }));

                this.filteredDailySales = this.dailySales.sort((a, b) => {
                    const dateA = new Date(a.paid_date);
                    const dateB = new Date(b.paid_date);
                    return dateA - dateB; // เรียงจากน้อยไปหามาก
                });
                this.filterSalesBySeller();

            } catch (error) {
                console.error('Error fetching sales data in range:', error);
            }
        },


        selectSeller(sellerId) {
            this.selectedSeller = sellerId;
            this.filterSalesBySeller();  // กรองยอดขายตามผู้ขายที่เลือก
        },
        filterSalesBySeller() {
            let filteredSales = this.salesBySellerAndPackageType;

            if (this.selectedSeller && this.selectedSeller.id) {
                filteredSales = this.salesBySellerAndPackageType.filter(
                    (sale) => sale.seller_name_id === this.selectedSeller.id
                );
            }
            this.groupedsalesBySellerAndPackageType = this.groupBySeller(filteredSales);
        },
        groupBySeller(data) {
            return data.reduce((acc, sale) => {
                if (!acc[sale.seller_name_id]) {
                    acc[sale.seller_name_id] = [];
                }
                acc[sale.seller_name_id].push(sale);
                return acc;
            }, {});
        },
        clearSelectedSeller() {
            this.selectedSeller = null;  // หรือ "" ขึ้นอยู่กับการตั้งค่า default ของคุณ
        },


        async fetchLookupData() {
            try {
                const [customersRes, promotionTypesRes, programsRes, packagesRes, packageTypesRes, zoneDeliveryRes, sellerNamesRes, paymentTypeRes, AdditionalTypeRes] = await Promise.all([
                    axios.get("http://127.0.0.1:3333/customers"),
                    axios.get("http://127.0.0.1:3333/promotion-types"),
                    axios.get("http://127.0.0.1:3333/programs"),
                    axios.get("http://127.0.0.1:3333/packages"),
                    axios.get("http://127.0.0.1:3333/package-types"),
                    axios.get("http://127.0.0.1:3333/zone-deliveries"),
                    axios.get("http://127.0.0.1:3333/seller-names"),
                    axios.get("http://127.0.0.1:3333/payment-types"),
                    axios.get("http://127.0.0.1:3333/additional-types"),
                ]);
                this.customers = customersRes.data;
                this.promotion_types = promotionTypesRes.data;
                this.allPrograms = programsRes.data || [];
                // this.programs = this.allPrograms;
                // if (this.saleRecord.promotion_type_id) {
                //     this.filterPrograms();
                // }
                // this.allPackages = packagesRes.data || [];
                this.packages = packagesRes.data;
                this.package_types = packageTypesRes.data;
                this.zoneDeliveries = zoneDeliveryRes.data;
                this.seller_names = sellerNamesRes.data;
                this.payment_types = paymentTypeRes.data.data;
                this.additional_types = AdditionalTypeRes.data;
await this.fetchDailySales();

            } catch (error) {
                console.error("Error fetching lookup data:", error);
            }
        },
        getCustomerName(customerId) {
            const customer = this.customers.find((c) => c.id === customerId);
            return customer ? customer.name : null;
        },
        getPackageName(packageId) {
            const packaged = this.packages.find((p) => p.id === packageId);
            return packaged ? packaged.name : null;
        },
        getPromotionTypeName(promotionTypeId) {
            const promotion_type = this.promotion_types.find((p) => p.id === promotionTypeId);
            return promotion_type ? promotion_type.name : null;
        },
        getPaymentTypeName(paymentTypeId) {
            const payment_type = this.payment_types.find((p) => p.id === paymentTypeId);
            return payment_type ? payment_type.name : null;
        },
        getSellerName(sellerNameId) {
            const seller = this.seller_names.find((s) => s.id === parseInt(sellerNameId));  // เพิ่ม parseInt เพื่อให้ตรวจสอบเป็นตัวเลข
            if (seller) {
                return seller.name;
            }
            return null;
        },
        getPackageTypeName(packageTypeId) {
            const package_type = this.package_types.find((p) => p.id === packageTypeId);
            return package_type ? package_type.name : null;
        },
        getPromotionDetail(packageId) {
            const packaged = this.packages.find(p => p.id === packageId);
            return packaged ? packaged.promotion_detail : null;
        },
        getPackagePrice(packageId) {
            const packaged = this.packages.find((p) => p.id === packageId);
            return packaged ? packaged.price : "-";
        },
        getAdditionalTypeName(additionalTypeId) {
            const additional_type = this.additional_types.find((s) => s.id === additionalTypeId);
            return additional_type ? additional_type.name : null;
        },


        changeDate(offset) {
            const startDate = new Date(this.startDate);
            startDate.setDate(startDate.getDate() + offset); // เลื่อนวันตาม offset
            this.startDate = startDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

            const endDate = new Date(this.endDate);
            endDate.setDate(endDate.getDate() + offset); // เลื่อนวันตาม offset
            this.endDate = endDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

            this.fetchSalesData(); // เรียกฟังก์ชันหลังจากเลื่อนวันที่
        },

        setToday() {
            const today = new Date().toISOString().split('T')[0]; // ค่าของวันที่วันนี้
            this.startDate = today;  // กำหนด startDate เป็นวันนี้
            this.endDate = today;    // กำหนด endDate เป็นวันนี้
            this.fetchSalesData();   // เรียกฟังก์ชันหลังจากตั้งค่า startDate และ endDate
        },

        fetchSalesData() {
            // ตรวจสอบว่าทั้ง startDate และ endDate ถูกกำหนดก่อนเรียก API
            if (this.startDate && this.endDate) {
                this.fetchDailySales(this.startDate, this.endDate);
            }
        },

        onViewDetails(dailySale) {
            this.selectedDailySaleDetail = { ...dailySale };
            this.isDetailModalOpen = true;
        },
        closeDetailModal() {
            this.isDetailModalOpen = false;
            this.selectedDailySaleDetail = {};
        },

        formatLabel(key) {
            const labels = {
                paid_date: 'Transaction Date',
                customer_id: `Customer's Name`,
                package_type_id: 'Package Type',
                package_id: 'Package/Purchase Details',
                promotion_type_id: 'Sales Category',
                package_price: 'Package Price',
                package_detail: 'Details',
                discount: 'Additional Discount',
                extra_charge: '% Extra Charge',
                extra_charge_price: 'Extra Charge Value',
                total_package_price: 'Purchase Value',
                total_delivery_price: 'ค่าจัดส่งรวม',
                total_price: 'ยอดขายรวม',
                payment_type_id: 'วิธีการชำระเงิน',
                seller_name_id: 'Sales Rep',
            };
            return labels[key] || key;
        },


    },
    created() {
        this.filteredDailySales = this.dailySales;
        this.fetchLookupData();
        this.fetchDailySales(this.selectedDate);
    },
    mounted() {
        // document.addEventListener('click', this.handleClickOutside);
        this.fetchLookupData();
        this.fetchDailySales(this.selectedDate);
        this.setToday();

        this.$nextTick(() => {
            flatpickr(this.$refs.startDatepicker, {
                dateFormat: "Y-m-d", // รูปแบบวันที่
                todayButton: true,
                defaultDate: new Date(),
                onChange: (selectedDates, dateStr) => {
                    this.startDate = dateStr; // กำหนดค่า startDate
                    this.fetchSalesData(); // เรียกฟังก์ชันเมื่อเลือกวันที่
                }
            });

            // ใช้ flatpickr กับวันที่สิ้นสุด
            flatpickr(this.$refs.endDatepicker, {
                dateFormat: "Y-m-d",
                todayButton: true,
                defaultDate: new Date(),
                onChange: (selectedDates, dateStr) => {
                    this.endDate = dateStr; // กำหนดค่า endDate
                    this.fetchSalesData(); // เรียกฟังก์ชันเมื่อเลือกวันที่
                }
            });
        });

    },
    // beforeUnmount() {
    //     document.removeEventListener('click', this.handleClickOutside);
    // },
};
</script>

<style scoped>

.dropdown-up {
    bottom: 100%;
    margin-bottom: 4px;
}
</style>