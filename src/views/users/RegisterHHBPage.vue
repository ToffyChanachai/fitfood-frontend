<template>
   <div class="flex items-center justify-center inset-0 p-4">
    <div class="flex flex-col items-center w-full">

        <div class="bg-gray-100 bg-opacity-50 backdrop-blur-md w-full h-auto max-h-[700px] sm:max-h-[750px] p-4 sm:p-8 rounded-lg shadow-lg border flex flex-col mt-2">

            <h2 class="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-700">ลงทะเบียนข้อมูลลูกค้า</h2>

            <p v-if="error" class="text-red-500 text-center mb-4 font-bold text-sm sm:text-base">{{ error }}</p>
            <p v-if="success" class="text-green-500 text-center mb-4 font-bold text-sm sm:text-base">{{ success }}</p>

            <div class="p-4 sm:p-6 space-y-4 overflow-y-auto flex-grow">

                <!-- Full Name -->
                <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div class="w-full sm:w-1/2">
                        <label for="firstname" class="block font-medium text-gray-700 text-sm sm:text-base">First Name</label>
                        <input type="text" v-model="firstname"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base" />
                    </div>
                    <div class="w-full sm:w-1/2">
                        <label for="lastname" class="block font-medium text-gray-700 text-sm sm:text-base">Last Name</label>
                        <input type="text" v-model="lastname"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base" />
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block font-medium text-gray-700 text-sm sm:text-base">Email</label>
                    <input type="email" v-model="email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base" />
                </div>

                <div>
                    <label for="customer_id" class="block font-medium text-gray-700 text-sm sm:text-base">รหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา</label>
                    <input type="text" v-model="customer_id"
                        placeholder="กรอกรหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base" />
                </div>

                <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div class="w-full sm:w-1/2">
                        <label for="tel" class="block font-medium text-gray-700 text-sm sm:text-base">Phone Number</label>
                        <input type="text" v-model="tel" maxlength="10" placeholder="กรอกหมายเลขโทรศัพท์"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base" />
                    </div>

                    <div class="w-full sm:w-1/2">
                        <label for="line_id" class="block font-medium text-gray-700 text-sm sm:text-base">Line ID (ถ้ามี)</label>
                        <input type="text" v-model="line_id" placeholder="กรอก line id"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base" />
                    </div>
                </div>

                <div>
                        <label class="block font-medium text-gray-700 text-sm sm:text-base">ผู้รับอาหาร?</label>
                        <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                            <label class="text-gray-700">
                                <input type="radio" v-model="recipient" value="ตัวคุณเอง"
                                    class="focus:ring-custom-orange custom-radio" />
                                <span class="text-sm sm:text-base"> ตัวคุณเอง</span>
                            </label>
                            <label class="text-gray-700">
                                <span class="text-sm sm:text-base">มีผู้อื่นรับแทน (โปรดระบุชื่อ
                                    พร้อมเบอร์โทรติดต่อในบรรทัดด้านล่าง)</span>
                            </label>
                        </div>
                    </div>

                <div>
                    <label for="recipient" class="block font-medium text-gray-700 text-sm sm:text-base">โปรดระบุชื่อ พร้อมเบอร์โทรติดต่อ</label>
                    <textarea id="recipient" v-model="recipient" placeholder="Enter details here"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base"
                        rows="4"></textarea>
                </div>

                <div>
                    <label for="note" class="block font-medium text-gray-700 text-sm sm:text-base">โปรดระบุเบอร์โทรติดต่อสำรอง หรือรายละเอียดอื่น ๆ ที่เราควรทราบ (ถ้ามี)</label>
                    <textarea id="note" v-model="note" placeholder="ระบุเบอร์โทรติดต่อสำรอง หรือรายละเอียดอื่น ๆ ที่เราควรทราบ (ถ้ามี)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base"
                        rows="4"></textarea>
                </div>

                <div>
                    <label for="address_1" class="block font-medium text-gray-700 text-sm sm:text-base">ที่อยู่จัดส่ง 1</label>
                    <textarea id="address" v-model="address_1" placeholder="กรอกที่อยู่การจัดส่ง"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base"
                        rows="4"></textarea>
                </div>

                <div>
                    <label for="address_2" class="block font-medium text-gray-700 text-sm sm:text-base">ที่อยู่จัดส่ง 2 (ถ้ามี)</label>
                    <textarea id="address_2" v-model="address_2" placeholder="กรอกที่อยู่การจัดส่ง"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base"
                        rows="4"></textarea>
                </div>

                <div>
                    <label for="address_3" class="block font-medium text-gray-700 text-sm sm:text-base">ที่อยู่จัดส่ง 3 (ถ้ามี)</label>
                    <textarea id="address_3" v-model="address_3" placeholder="กรอกที่อยู่การจัดส่ง"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base"
                        rows="4"></textarea>
                </div>

                <div>
                    <label for="nearby_places" class="block font-medium text-gray-700 text-sm sm:text-base">สถานที่ใกล้เคียงหรือจุดสังเกตอื่น ๆ</label>
                    <textarea id="nearby_places" v-model="nearby_places" placeholder="กรอกสถานที่ใกล้เคียงหรือจุดสังเกตอื่น ๆ"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange text-sm sm:text-base"
                        rows="4"></textarea>
                </div>
            </div>
            <button @click="addCustomer"
                class="mt-4 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-700 w-full text-sm sm:text-base">
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
            nearby_places: '',
            tel: '',
            recipient: [],
            recipient_detail: '',
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
                const response = await axios.post(`${API_URL}/customer-hhb`, {
                    address_1: this.address_1,
                    address_2: this.address_2,
                    address_3: this.address_3,
                    nearby_places: this.nearby_places,
                    customer_id: this.customer_id,
                    name: `${this.firstname} ${this.lastname}`,
                    email: this.email,
                    line_id: this.line_id,
                    tel: this.tel,
                    recipient: this.recipient,
                    note: this.note,
                });

                // ถ้าสำเร็จ
                this.success = response.data.message;
                this.$router.push('/');
            } catch (err) {
                // ถ้ามีข้อผิดพลาด
                this.error = err.response.data.message || 'Failed to Register';
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