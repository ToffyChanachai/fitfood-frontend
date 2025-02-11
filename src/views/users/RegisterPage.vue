<template>
    <div
        class="flex items-center justify-center min-h-screen fixed inset-0 bg-gradient-to-r from-custom-orange to-custom-orange-hover">
        <div class="flex flex-col items-center">
            <!-- Modal โลโก้ -->
            <div class="w-full max-w-md bg-white px-4 py-3 rounded-t-lg shadow-lg flex justify-center items-center">
                <img src="@/assets/fitfood_logo.png" alt="Logo" class="w-12 h-12">
                <div class="leading-none ml-2">
                    <p class="text-lg font-bold">ABSOLUTE</p>
                    <p class="text-lg font-bold text-custom-orange -mt-3">FITFOOD</p>
                </div>
            </div>

            <!-- Modal Form -->
            <div class="bg-white bg-opacity-60 backdrop-blur-md w-full max-w-md p-8 rounded-b-lg shadow-lg border">
                <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Register</h2>

                <p v-if="success" class="mb-4 text-green-500 text-center font-bold">{{ success }}</p>
                <p v-if="!success && error" class="mb-4 text-red-500 text-center font-bold">{{ error }}</p>

                <form @submit.prevent="register" class="space-y-4">
                    <!-- Username -->
                    <input type="text" v-model="username" placeholder="Username" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />

                    <!-- Email -->
                    <input type="email" v-model="email" placeholder="Email" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />

                    <div class="flex space-x-4">
                        <!-- First Name -->
                        <input type="text" v-model="firstname" placeholder="First Name" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        <!-- Last Name -->
                        <input type="text" v-model="lastname" placeholder="Last Name" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                    </div>

                    <!-- Password -->
                    <input type="password" v-model="password" placeholder="Password" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />

                    <!-- Confirm Password -->
                    <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />

                    <button type="submit"
                        class="w-full bg-custom-orange text-white py-2 rounded-md hover:bg-custom-orange-hover transition">
                        Register
                    </button>
                </form>

                <!-- ลิงก์ไปหน้า Login -->
                <p class="text-center text-gray-600 mt-4">
                    Already have an account?
                    <router-link to="/login" class="text-custom-orange hover:underline font-bold">Login</router-link>
                </p>
            </div>
        </div>
    </div>
</template>


<script>
import AuthService from '@/services/auth'; // อิมพอร์ต Service สำหรับสมัครสมาชิก

export default {
    data() {
        return {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: null,
            success: null
        };
    },
    methods: {
        async register() {
            // ตรวจสอบว่า Password และ Confirm Password ตรงกันหรือไม่
            if (this.password !== this.confirmPassword) {
                this.error = "Passwords do not match!";
                return;
            }

            try {
                // เรียกใช้ AuthService เพื่อลงทะเบียน
                await AuthService.register(this.firstname, this.lastname, this.username, this.email, this.password);

                this.success = 'Registration successful! Please login to continue.';

                this.firstname = '';
      this.lastname = '';
      this.username = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';

                // this.$router.push('/login');
            } catch (err) {
                // หากเกิดข้อผิดพลาด แสดงข้อความ error
                this.error = 'Email or Username already exists';
            }
        }
    }
};
</script>
