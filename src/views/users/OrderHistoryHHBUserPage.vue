<template>
    <div>

        <div class="flex items-center space-x-3 py-2">
            <div @click="$router.back()"
                class="flex items-center space-x-1 cursor-pointer text-custom-orange hover:text-custom-orange-hover">
                <span class="material-symbols-outlined text-2xl ">arrow_back</span>
                <span class="text  font-bold">กลับ</span>
            </div>

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

            <strong class="text-gray-700">เลือกวันที่:</strong>
            <input ref="singleDatepicker" type="text" v-model="formattedStartDate"
                class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-[150px]"
                placeholder="เลือกวันที่" />


            <!-- <strong class="text-gray-700">Start Date:</strong>
            <input ref="startDatepicker" type="text" v-model="formattedStartDate" @input="onStartDateChange"
                class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-[150px]"
                placeholder="เลือกวันที่เริ่มต้น" /> -->

            <!-- <strong class="text-gray-700">End Date:</strong>
            <input ref="endDatepicker" type="text" v-model="formattedEndDate" @input="onEndDateChange"
                class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange hover:text-custom-orange-hover w-[150px]"
                placeholder="เลือกวันที่สิ้นสุด" /> -->


        </div>

        <div class="mt-4">
            <div class="flex items-center">
                <h1 class="text-xl font-bold">ประวัติการสั่งซื้อ: </h1>

                <h1 v-if="isLoading" class="text-xl font-bold ml-2">
                    <div class="bg-gray-100 animate-pulse h-6 w-48 rounded-md"></div>
                </h1>
                <h1 v-else class="text-xl text-custom-orange font-bold ml-2">
                    {{ getCustomerName(customerId) }}
                </h1>
            </div>

            <div v-if="isLoading"
                class="mt-4 bg-white rounded-md shadow-lg p-4 border border-gray-100 overflow-y-auto h-[650px]">
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

            <div v-else>
            <div v-if="orders.length > 0"
                class="mt-4 bg-white rounded-md shadow-lg p-4 border border-gray-300 overflow-y-auto h-[650px]">
                <div v-for="order in orders" :key="order.order_date" class="border-b border-gray-200 py-4">
                    <div class="flex justify-between items-center">
                        <div class="font-semibold">{{ getMenuEngName(order.menu_id) }} ({{ getMenuThaiName(order.menu_id) }})</div>
                        <div class="text-gray-600">{{ formattedDate(order.order_date) }}</div>
                    </div>
                    <div class="mt-2 text-gray-500">
                        <div class="flex items-center">
                            <p>จำนวน:</p>
                             <strong class="ml-2 text-black">{{ order.quantity }}</strong>
                            </div>
                        <div class="flex items-center">
                            <p>สถานะ: </p>
                            <div :class="{ 'text-yellow-500 font-bold': order.status === 'pending', 'text-green-500 font-bold': order.status === 'confirm' }"
                                class="ml-2">
                                {{ getStatusText(order.status) }}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div v-if="orders.length === 0"
                class="mt-4 bg-white rounded-md shadow-lg p-4 border border-gray-300 h-[650px] flex justify-center items-center">
                <div class="flex items-center space-x-1 text-gray-500 font-bold text-center">
                    <span class="material-symbols-outlined text-3xl">history_off</span>
                    <span class="text-xl">ไม่มีประวัติการสั่งซื้อในวันนี้</span>
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
            orders: [],
            customers: [],
            menus: [],
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
        groupedOrders() {
            const groupedByDate = this.orders.reduce((acc, order) => {
                if (!acc[order.order_date]) {
                    acc[order.order_date] = [];
                }

                const existingOrder = acc[order.order_date].find(item => item.menu_id === order.menu_id);
                if (existingOrder) {
                    existingOrder.quantity += order.quantity;
                } else {
                    acc[order.order_date].push({
                        menu_id: order.menu_id,
                        quantity: order.quantity,
                        menu_name: this.getMenuThaiName(order.menu_id),
                        menu_eng_name: this.getMenuEngName(order.menu_id),
                        order_date: order.order_date,
                        status: order.status,
                        menu_type_id: order.menu_type_id,
                    });
                }

                return acc;
            }, {});

            // แปลง object เป็น array
            return Object.keys(groupedByDate).flatMap(order_date => groupedByDate[order_date]);
        },

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

        async fetchOrders(startDate, endDate) {
            this.isLoading = true;
            try {
                const response = await axios.get(`${API_URL}/orders-hhb/user/${this.customerId}`, {
                    params: { start_date: startDate, end_date: endDate },
                });
                this.orders = response.data.orders || [];
            } catch (error) {
                // console.error("เกิดข้อผิดพลาดในการดึงประวัติการสั่งซื้อ:", error);
                this.orders = []; // กรณีมีข้อผิดพลาดให้ตั้งค่าเป็นอาเรย์ว่าง
            } finally {
                this.isLoading = false;
            }
        },

        onStartDateChange(event) {
            const inputDate = new Date(event.target.value);
            if (!isNaN(inputDate)) {
                this.startDate = inputDate.toISOString();
                this.endDate = inputDate.toISOString();
            }
        },

        changeDate(offset) {
            const startDate = new Date(this.startDate);
            startDate.setDate(startDate.getDate() + offset); // เลื่อนวันตาม offset
            this.startDate = startDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

            const endDate = new Date(this.endDate);
            endDate.setDate(endDate.getDate() + offset); // เลื่อนวันตาม offset
            this.endDate = endDate.toISOString().split('T')[0]; // แปลงวันที่ใหม่เป็นรูปแบบ Y-m-d

            this.fetchOrdersData(); // เรียกฟังก์ชันหลังจากเลื่อนวันที่
        },

        setToday() {
            const today = new Date().toISOString().split('T')[0]; // ค่าของวันที่วันนี้
            this.startDate = today;  // กำหนด startDate เป็นวันนี้
            this.endDate = today;    // กำหนด endDate เป็นวันนี้
            this.fetchOrdersData();   // เรียกฟังก์ชันหลังจากตั้งค่า startDate และ endDate
        },

        fetchOrdersData() {
            if (this.startDate && this.endDate) {
                this.fetchOrders(this.startDate, this.endDate);
            }
        },
        async fetchLookupData() {
            try {
                const [
                    customersRes,
                    menuRes,
                ] = await Promise.all([
                    axios.get(`${API_URL}/customers-hhb`),
                    axios.get(`${API_URL}/menus`),
                ]);

                this.customers = customersRes.data;
                this.menus = menuRes.data;
            } catch (error) {
                console.error("Error fetching lookup data:", error);
            }
        },

        getCustomerName(customerId) {
            const customer = this.customers.find(c => c.id.toString() === customerId.toString());
            return customer ? customer.name : "ไม่พบข้อมูล";
        },
        getMenuThaiName(menuId) {
            const menu = this.menus.find((c) => c.id === menuId);
            return menu ? menu.name_thai : "ไม่พบข้อมูล";
        },
        getMenuEngName(menuId) {
            const menu = this.menus.find((c) => c.id === menuId);
            return menu ? menu.name_english : "ไม่พบข้อมูล";
        },
        getStatusText(status) {
            return status === "confirm" ? "ยืนยันการสั่งซื้อแล้ว" : "ยังไม่ได้ยืนยันการสั่งซื้อ";
        },
    },
    created() {
        this.fetchOrders(this.selectedDate);
        this.setToday();
        this.fetchLookupData();
    },
    mounted() {
        // document.addEventListener('click', this.handleClickOutside);
        this.fetchLookupData();
        this.fetchOrders(this.selectedDate);
        this.setToday();

        this.$nextTick(() => {
            this.fetchOrdersData();
            flatpickr(this.$refs.singleDatepicker, {
                // mode: "single",  // โหมดเลือกวันเดียว
                dateFormat: "Y-m-d",  // รูปแบบวันที่
                todayButton: true,
                defaultDate: new Date(),  // กำหนดวันที่เริ่มต้นเป็นวันนี้
                onChange: (selectedDates, dateStr) => {
                    this.startDate = dateStr;
                    this.endDate = dateStr;
                    this.fetchOrdersData();  // ดึงข้อมูลคำสั่งซื้อ
                }
            });
        });

    },
};
</script>