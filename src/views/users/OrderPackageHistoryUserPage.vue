<template>
    <div>
        <div class="flex items-center space-x-3 py-2 flex-wrap sm:flex-nowrap">
            <!-- ปุ่มย้อนกลับ (ซ่อนบนมือถือ) -->
            <div @click="$router.back()"
                class="hidden sm:flex items-center space-x-1 cursor-pointer text-custom-orange hover:text-custom-orange-hover">
                <span class="material-symbols-outlined text-2xl">arrow_back</span>
                <span class="text font-bold">กลับ</span>
            </div>

            <!-- ปุ่มลูกศรย้อนกลับ -->
            <button @click="changeDate(-1)" class="hidden sm:flex items-center">
                <span class="material-symbols-outlined sm:text-3xl text-xl text-custom-orange hover:text-custom-orange-hover">
                    chevron_left
                </span>
            </button>

            <button @click="setToday"
                class="hidden sm:flex items-center text-custom-orange hover:underline hover:text-custom-orange">
                <span class="mr-2 font-bold text-sm sm:text-base">วันนี้</span>
            </button>

            <button @click="changeDate(1)" class="hidden sm:flex items-center">
                <span class="material-symbols-outlined sm:text-3xl text-xl text-custom-orange hover:text-custom-orange-hover">
                    chevron_right
                </span>
            </button>

            <div
                class="flex flex-wrap sm:flex-nowrap items-center space-x-2 space-y-2 sm:space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
                <!-- Start Date -->
                <div class="flex items-center space-x-2 w-full sm:w-auto">
                    <strong class="text-gray-700 text-sm sm:text-base whitespace-nowrap">Start Date:</strong>
                    <input ref="startDatepicker" type="text" v-model="formattedStartDate" @input="onStartDateChange"
                        class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-full sm:w-[150px] flex-grow"
                        placeholder="เลือกวันที่เริ่มต้น" />
                </div>

                <!-- End Date -->
                <div class="flex items-center space-x-2 w-full sm:w-auto flex-nowrap">
                    <strong class="text-gray-700 text-sm sm:text-base whitespace-nowrap">End Date:</strong>
                    <input ref="endDatepicker" type="text" v-model="formattedEndDate" @input="onEndDateChange"
                        class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-full sm:w-[150px] flex-grow"
                        placeholder="เลือกวันที่สิ้นสุด" />
                </div>


            </div>
        </div>


        <!-- ส่วนประวัติการสั่งซื้อแพ็คเกจ -->
        <div class="mt-4">
            <div class="flex items-center">
                <h1 class="text-sm sm:text-xl font-bold">ประวัติการสั่งซื้อแพ็คเกจ: </h1>

                <h1 v-if="isLoading" class="text-sm sm:text-xl font-bold ml-2">
                    <div class="bg-gray-100 animate-pulse h-6 w-48 rounded-md"></div>
                </h1>
                <h1 v-else class="text-sm sm:text-xl text-custom-orange font-bold ml-2">
                    {{ getCustomerName(customerId) }}
                </h1>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading"
                class="mt-4 bg-white rounded-md shadow-lg p-4 border border-gray-100 overflow-y-auto h-[550px] sm:h-[650px]">
                <div v-for="n in 5" :key="n" class="border-b border-gray-200 py-4 animate-pulse">
                    <div class="flex justify-between items-center">
                        <div class="bg-gray-100 h-6 w-1/4 rounded-md"></div>
                        <div class="bg-gray-100 h-6 w-1/6 rounded-md"></div>
                    </div>
                    <div class="mt-2 text-gray-500">
                        <div class="flex items-center">
                            <div class="bg-gray-100 h-6 w-20 rounded-md"></div>
                        </div>
                        <div class="flex items-center mt-2">
                            <div class="bg-gray-100 h-6 w-24 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- เมื่อโหลดข้อมูลเสร็จ -->
            <div v-else>
                <!-- หากมีประวัติการสั่งซื้อแพ็คเกจ -->
                <div v-if="saleRecords.length > 0"
                    class="mt-4 bg-white rounded-md shadow-lg p-4 border border-gray-300 overflow-y-auto h-[550px] sm:h-[650px]">
                    <div v-for="saleRecord in saleRecords" :key="saleRecord.start_package_date"
                        class="border-b border-gray-200 py-4 text-[10px] sm:text-base">
                        <div class="sm:flex justify-between items-center">
                            <div class="font-bold">{{ getPackageName(saleRecord.package_id) }}</div>

                            <!-- วันที่ -->
                            <div class="text-gray-500">วันเริ่มแพ็กเกจ: {{ formattedDate(saleRecord.start_package_date) }}</div>
                        </div>
                        <div class="mt-2 text-gray-500 space-y-2">
                            <div class="flex items-center">
                                <p>Program:</p>
                                <strong class="ml-2 font-medium text-black">{{ getProgramName(saleRecord.program_id)
                                }}</strong>
                            </div>

                            <div class="flex items-center">
                                <p>ราคารวมทั้งหมด:</p>
                                <strong class="ml-2 font-medium text-black">{{ formatPrice(saleRecord.total_price) }}</strong>

                                <p class="ml-4">ราคาแพ็กเกจ:</p>
                                <strong class="ml-2 font-medium text-black">{{ formatPrice(saleRecord.total_package_price) }}</strong>

                                <p class="ml-4">ราคาค่าจัดส่ง:</p>
                                <strong class="ml-2 font-medium text-black">{{ formatPrice(saleRecord.total_delivery_price) }}</strong>
                            </div>

                            <div class="flex items-center">
                                <p>สถานะการชำระเงิน: </p>
                                <div :class="{ 'text-red-500 font-medium': saleRecord.payment_status === 'unpaid', 'text-green-500 font-medium': saleRecord.payment_status === 'paid' }"
                                    class="ml-2">
                                    {{ getStatusText(saleRecord.payment_status) }}
                                </div>
                                <p class="ml-4">วันที่ชำระเงิน: </p>
                                <span class="ml-2 font-medium text-black">{{ formattedDate(saleRecord.paid_date) || '-' }}</span>
                            </div>

                            <div class="flex items-center">
                                <p>วันหมดอายุแพ็กเกจ: </p>
                                <span class="ml-2 font-medium text-black">{{ formattedDate(saleRecord.expiry_date)
                                }}</span>
                                <p class="ml-4">วันคงเหลือของแพ็กเกจ: </p>
                                <span v-if="saleRecord.remaining_days < 0" class="text-red-500 ml-2 font-medium">
                                    หมดอายุ
                                </span>
                                <span v-else class="ml-2 font-medium text-black"> {{ saleRecord.remaining_days }} วัน
                                </span>
                            </div>

                            <div class="flex items-center">
                                <p>Total boxes: </p>
                                <span class="ml-2 font-medium text-black">{{ saleRecord.total_boxes_show
                                }} กล่อง</span>
                                <p class="ml-4">Total boxes (เหลือ): </p>
                                <span v-if="saleRecord.total_boxes <= 0" class="text-red-500 font-medium ml-2">
                                    {{ saleRecord.total_boxes }} กล่อง
                                </span>
                                <span v-else class="ml-2 font-medium text-black"> {{ saleRecord.total_boxes }} กล่อง</span>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- หากไม่มีประวัติการสั่งซื้อแพ็คเกจ -->
                <div v-if="saleRecords.length === 0"
                    class="mt-4 bg-white rounded-md shadow-lg p-4 border border-gray-300 h-[550px] sm:h-[650px] flex justify-center items-center">
                    <div class="flex items-center space-x-1 text-gray-500 font-bold text-center">
                        <span class="material-symbols-outlined text-3xl">history_off</span>
                        <span class="text-sm sm:text-xl">ไม่มีประวัติการสั่งซื้อแพ็คเกจ</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { API_URL } from "@/services/api";


export default {
    data() {
        return {
            customerId: this.$route.params.customerId, // ดึง customer_id จาก URL
            saleRecords: [],
            customers: [],
            packages: [],
            programs: [],
            isLoading: false,
            startDate: '', // วันที่เริ่มต้น
            endDate: '',
            selectedDate: "",

        };
    },
    computed: {

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
        // groupedsaleRecords() {
        //     const groupedByDate = this.saleRecords.reduce((acc, order) => {
        //         if (!acc[order.start_date]) {
        //             acc[order.start_date] = [];
        //         }

        //         const existingOrder = acc[order.start_date].find(item => item.menu_id === order.menu_id);
        //         if (existingOrder) {
        //             existingOrder.quantity += order.quantity;
        //         } else {
        //             acc[order.start_date].push({
        //                 menu_id: order.menu_id,
        //                 quantity: order.quantity,
        //                 menu_name: this.getMenuThaiName(order.menu_id),
        //                 menu_eng_name: this.getMenuEngName(order.menu_id),
        //                 start_date: order.start_date,
        //                 status: order.status,
        //                 menu_type_id: order.menu_type_id,
        //             });
        //         }

        //         return acc;
        //     }, {});

        //     // แปลง object เป็น array
        //     return Object.keys(groupedByDate).flatMap(order_date => groupedByDate[order_date]);
        // },

    },
    methods: {
        formattedDate(dateStr) {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(date);
        },
        formatPrice(price) {
      return "฿" + new Intl.NumberFormat("th-TH").format(price);
    },

        async fetchSaleRecords(startDate, endDate) {
            this.isLoading = true;
            try {
                const response = await axios.get(`${API_URL}/sale-records/user/${this.customerId}`, {
                    params: { start_date: startDate, end_date: endDate },
                });
                this.saleRecords = response.data.saleRecords;
                this.saleRecords.sort((a, b) => {
                    const dateA = new Date(a.start_package_date);
                    const dateB = new Date(b.start_package_date);
                    return dateA - dateB;
                });
            } catch (error) {
                this.saleRecords = [];
            } finally {
                this.isLoading = false;
            }
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

        changeDate(offset) {
            const startDate = new Date(this.startDate);
            startDate.setDate(startDate.getDate() + offset); // เลื่อนวันตาม offset
            this.startDate = startDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

            const endDate = new Date(this.endDate);
            endDate.setDate(endDate.getDate() + offset); // เลื่อนวันตาม offset
            this.endDate = endDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

            this.fetchSaleRecordsData(); // เรียกฟังก์ชันหลังจากเลื่อนวันที่
        },

        setToday() {
            const today = new Date().toISOString().split('T')[0]; // ค่าของวันที่วันนี้
            this.startDate = today;  // กำหนด startDate เป็นวันนี้
            this.endDate = today;    // กำหนด endDate เป็นวันนี้
            this.fetchSaleRecordsData();   // เรียกฟังก์ชันหลังจากตั้งค่า startDate และ endDate
        },

        fetchSaleRecordsData() {
            if (this.startDate && this.endDate) {
                this.fetchSaleRecords(this.startDate, this.endDate);
            }
        },
        async fetchLookupData() {
            this.isLoading = true;

            try {
                const [
                    customersRes,
                    packageRes,
                    programRes,
                ] = await Promise.all([
                    axios.get(`${API_URL}/customers`),
                    axios.get(`${API_URL}/packages`),
                    axios.get(`${API_URL}/programs`),
                ]);

                this.customers = customersRes.data;
                this.packages = packageRes.data;
                this.programs = programRes.data;

            } catch (error) {
                console.error("Error fetching lookup data:", error);
            } finally {
                this.isLoading = false;
            }
        },

        getCustomerName(customerId) {
            // แปลง customerId และ id ให้อยู่ในรูปแบบเดียวกัน
            const customer = this.customers.find(c => c.id.toString() === customerId.toString());
            return customer ? customer.name : "ไม่พบข้อมูล";
        },
        getPackageName(packageId) {
            const packaged = this.packages.find((c) => c.id === packageId);
            return packaged ? packaged.package_detail : "ไม่พบข้อมูล";
        },
        getProgramName(programId) {
            const program = this.programs.find((c) => c.id === programId);
            return program ? program.name : "ไม่พบข้อมูล";
        },
        getStatusText(status) {
            return status === "paid" ? "ชำระเงินแล้ว" : "ยังไม่ได้ชำระเงิน";
        },
    },
    created() {
        this.fetchSaleRecords(this.startDate, this.endDate);
        this.setToday();
        this.fetchLookupData();
    },
    mounted() {
        // document.addEventListener('click', this.handleClickOutside);
        this.fetchLookupData();
        this.fetchSaleRecords(this.startDate, this.endDate);
        this.setToday();

        this.$nextTick(() => {
            flatpickr(this.$refs.startDatepicker, {
                dateFormat: "Y-m-d", // รูปแบบวันที่
                todayButton: true,
                defaultDate: new Date(),
                onChange: (selectedDates, dateStr) => {
                    this.startDate = dateStr; // กำหนดค่า startDate
                    this.fetchSaleRecordsData(); // เรียกฟังก์ชันเมื่อเลือกวันที่
                }
            });

            // ใช้ flatpickr กับวันที่สิ้นสุด
            flatpickr(this.$refs.endDatepicker, {
                dateFormat: "Y-m-d",
                todayButton: true,
                defaultDate: new Date(),
                onChange: (selectedDates, dateStr) => {
                    this.endDate = dateStr; // กำหนดค่า endDate
                    this.fetchSaleRecordsData(); // เรียกฟังก์ชันเมื่อเลือกวันที่
                }
            });
        });

    },
};
</script>