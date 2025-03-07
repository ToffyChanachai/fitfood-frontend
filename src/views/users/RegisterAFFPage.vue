<template>
   <div class="flex items-center justify-center min-h-screen p-4">
    <div class="bg-gray-100 bg-opacity-50 backdrop-blur-md w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 rounded-lg shadow-lg border">
        <h2 class="text-2xl font-bold text-center mb-4 text-gray-700">ลงทะเบียนข้อมูลลูกค้า</h2>

        <div class="space-y-4">
            <!-- First Name & Last Name -->
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div class="w-full sm:w-1/2">
                    <label class="font-medium text-gray-700">First Name</label>
                    <input type="text" v-model="firstname"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange" />
                </div>
                <div class="w-full sm:w-1/2">
                    <label class="font-medium text-gray-700">Last Name</label>
                    <input type="text" v-model="lastname"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange" />
                </div>
            </div>

            <!-- Email -->
            <div>
                <label class="font-medium text-gray-700">Email</label>
                <input type="email" v-model="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange" />
            </div>

            <!-- Phone Number & Line ID -->
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div class="w-full sm:w-1/2">
                    <label class="font-medium text-gray-700">Phone Number</label>
                    <input type="text" v-model="tel" maxlength="10"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange" />
                </div>
                <div class="w-full sm:w-1/2">
                    <label class="font-medium text-gray-700">Line ID (ถ้ามี)</label>
                    <input type="text" v-model="line_id"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange" />
                </div>
            </div>

            <!-- Gender -->
            <div>
                <label class="font-medium text-gray-700">Gender</label>
                <div class="flex space-x-4 text-gray-700">
                    <label>
                        <input type="radio" v-model="gender" value="female" class="focus:ring-custom-orange" />
                        ผู้หญิง / Female
                    </label>
                    <label>
                        <input type="radio" v-model="gender" value="male" class="focus:ring-custom-orange" />
                        ผู้ชาย / Male
                    </label>
                </div>
            </div>

            <!-- Food Allergies -->
            <div>
                <label class="font-medium text-gray-700">คุณแพ้อาหารชนิดใดหรือไม่?</label>
                <div class="flex space-x-4 text-gray-700">
                    <label>
                        <input type="radio" v-model="food_allergies" value="ไม่ No" class="focus:ring-custom-orange" />
                        ไม่ / No
                    </label>
                    <label>
                        <input type="radio" v-model="food_allergies" value="ใช่ Yes, " class="focus:ring-custom-orange" />
                        ใช่ / Yes
                    </label>
                </div>
            </div>

            <div v-if="food_allergies === 'ใช่ Yes, '">
                <label class="font-medium text-gray-700">โปรดระบุประเภทอาหารที่แพ้</label>
                <textarea v-model="food_allergies_detail"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange"
                    rows="4"></textarea>
            </div>

            <!-- Delivery Date -->
            <div>
                <label class="font-medium text-gray-700">วันที่ต้องการรับอาหาร</label>
                <input type="text" v-model="delivery_date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange" />
            </div>

            <!-- Recipient -->
            <div>
                <label class="font-medium text-gray-700">ผู้รับอาหาร?</label>
                <div class="flex space-x-4">
                    <label class="text-gray-700">
                        <input type="radio" v-model="recipient_mon_to_fri" value="ตัวคุณเอง" class="focus:ring-custom-orange" />
                        ตัวคุณเอง
                    </label>
                    <label class="text-gray-700">
                        มีผู้อื่นรับแทน (โปรดระบุชื่อ + เบอร์โทร)
                    </label>
                </div>
            </div>

            <div>
                <textarea v-model="recipient_mon_to_fri"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange"
                    rows="4"></textarea>
            </div>

            <!-- Address -->
            <div>
                <label class="font-medium text-gray-700">ที่อยู่จัดส่ง</label>
                <textarea v-model="address_1"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-orange"
                    rows="4"></textarea>
            </div>

            <!-- Button -->
            <button @click="addCustomer"
                class="mt-4 px-4 py-2 text-sm rounded bg-custom-orange text-white hover:bg-custom-orange-hover w-full">
                ยืนยัน
            </button>
        </div>
    </div>
</div>


</template>

<script>
import axios from 'axios';
import { API_URL } from "@/services/api";


export default {
    data() {
        return {
            firstname: '',
            lastname: '',
            email: '',
            line_id: '',
            address_1: '',
            address_2: '',
            address_3: '',
            gender: '',
            tel: '',
            food_allergies: '',
            food_allergies_detail: '',
            delivery_date: '',
            recipient_mon_to_fri: '',
            note: '',
            customer_id: '',
            error: null,
            success: null
        };
    },
    created() {
        this.fetchUserData(); // ดึงข้อมูล firstname, lastname และ email เมื่อ component โหลด
    },
    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get(`${API_URL}/profile`); // สร้าง API ที่ backend เพื่อดึงข้อมูลผู้ใช้
                this.firstname = response.data.firstname; // รับข้อมูล firstname
                this.lastname = response.data.lastname;   // รับข้อมูล lastname
                this.email = response.data.email;          // รับข้อมูล email
            } catch (err) {
                this.error = err.response.data.message || 'Failed to fetch user data';
            }
        },
        async addCustomer() {
            try {
                // ส่งข้อมูล address และ gender ไปยัง backend
                const response = await axios.post(`${API_URL}/customer`, {
                    address_1: this.address_1,
                    address_2: this.address_2,
                    address_3: this.address_3,
                    gender: this.gender,
                    customer_id: this.customer_id,
                    name: `${this.firstname} ${this.lastname}`,
                    email: this.email,
                    line_id: this.line_id,
                    tel: this.tel,
                    food_allergies: this.food_allergies + this.food_allergies_detail,
                    delivery_date: this.delivery_date,
                    recipient_mon_to_fri: this.recipient_mon_to_fri,
                    note: this.note,
                });

                this.success = response.data.message;
                this.address = ''; // ล้างค่าในฟอร์ม
            } catch (err) {
                this.error = err.response.data.message || 'Failed to add address';
            }
        },
        // validatePhoneNumber() {
        //     const phonePattern = /^0[0-9]{9}$/; // รูปแบบเบอร์โทรของไทย เช่น 0891234567
        //     if (!phonePattern.test(this.tel)) {
        //         this.phoneError = 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง';
        //     } else {
        //         this.phoneError = null;
        //     }
        // },
    }
};
</script>

<style scoped>
/* ใส่สไตล์เพิ่มเติมถ้าจำเป็น */
</style>