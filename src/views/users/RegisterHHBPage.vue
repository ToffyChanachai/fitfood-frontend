<template>
    <div class="flex items-center justify-center inset-0">
        <div class="flex flex-col items-center ">

            <div
                class="bg-gray-100 bg-opacity-50 backdrop-blur-md w-full h-auto max-h-[750px] p-8 rounded-lg shadow-lg border flex flex-col mt-4">
                <h2 class="text-2xl font-bold text-center mb-6 text-gray-700">ลงทะเบียนข้อมูลลูกค้า</h2>

                <!-- Error and Success Messages -->
                <p v-if="error" class="text-red-500 text-center mb-4">{{ error }}</p>
                <p v-if="success" class="text-green-500 text-center mb-4">{{ success }}</p>

                <div class="p-6 space-y-4 overflow-y-auto flex-grow">

                    <!-- Full Name -->
                    <div class="flex space-x-4">
                        <div class="w-1/2">
                            <label for="firstname" class="block  font-medium text-gray-700">First
                                Name</label>
                            <input type="text" v-model="firstname"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>
                        <div class="w-1/2">
                            <label for="lastname" class="block  font-medium text-gray-700">Last Name</label>
                            <input type="text" v-model="lastname"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block  font-medium text-gray-700">Email</label>
                        <input type="email" v-model="email"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                    </div>

                    <div>
                        <label for="customer_id"
                            class="block  font-medium text-gray-700">รหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา</label>
                        <input type="text" v-model="customer_id"
                            placeholder="กรอกรหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                    </div>

                    <div class="flex space-x-4">
                        <div class="w-1/2">
                            <label for="tel" class="block  font-medium text-gray-700">Phone Number</label>
                            <input type="text" v-model="tel" maxlength="10" placeholder="กรอกหมายเลขโทรศัพท์"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>

                        <div class="w-1/2">
                            <label for="line_id" class="block  font-medium text-gray-700">Line ID (ถ้ามี)</label>
                            <input type="text" v-model="line_id" placeholder="กรอก line id"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">ผู้รับอาหาร?</label>
                        <div class="flex space-x-4">
                            <label class="text-gray-700">
                                <input type="radio" v-model="recipient" value="ตัวคุณเอง"
                                    class="focus:ring-custom-orange custom-radio" />
                                ตัวคุณเอง
                            </label>
                            <label class="text-gray-700">
                                มีผู้อื่นรับแทน (โปรดระบุชื่อ พร้อมเบอร์โทรติดต่อในบรรทัดด้านล่าง)
                            </label>
                        </div>
                    </div>

                    <label for="recipient" class="block  font-medium text-gray-700">โปรดระบุชื่อ
                        พร้อมเบอร์โทรติดต่อ</label>
                    <textarea id="recipient" v-model="recipient" placeholder="Enter details here"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                        rows="4"></textarea>

                    <div>
                        <label for="note" class="block  font-medium text-gray-700">โปรดระบุเบอร์โทรติดต่อสำรอง
                            หรือรายละเอียดอื่น ๆ ที่เราควรทราบ (ถ้ามี)</label>
                        <textarea id="note" v-model="note"
                            placeholder="ระบุเบอร์โทรติดต่อสำรอง หรือรายละเอียดอื่น ๆ ที่เราควรทราบ (ถ้ามี)"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_1" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 1</label>
                        <textarea id="address" v-model="address_1" placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_2" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 2
                            (ถ้ามี)</label>
                        <textarea id="address_2" v-model="address_2" placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_3" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 3
                            (ถ้ามี)</label>
                        <textarea id="address_3" v-model="address_3" placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="nearby_places"
                            class="block  font-medium text-gray-700">สถานที่ใกล้เคียงหรือจุดสังเกตอื่น ๆ </label>
                        <textarea id="nearby_places" v-model="nearby_places"
                            placeholder="กรอกสถานที่ใกล้เคียงหรือจุดสังเกตอื่น ๆ "
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>
                </div>
                <button @click="addCustomer"
                    class="mt-4 px-4 py-2 rounded bg-custom-orange text-white hover:bg-custom-orange-hover w-full">
                    ยืนยัน
                </button>
            </div>


        </div>
    </div>

</template>

<script>
import axios from 'axios';

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
                const response = await axios.get('http://127.0.0.1:3333/profile'); // สร้าง API ที่ backend เพื่อดึงข้อมูลผู้ใช้
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
                const response = await axios.post('http://127.0.0.1:3333/customer-hhb', {
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
                // this.address = ''; // ล้างค่าในฟอร์ม
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