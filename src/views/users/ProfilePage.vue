<template>
    <div>
        <h2>Your Profile</h2>
        <div v-if="error" class="text-red-500">{{ error }}</div>
        <div v-if="loading" class="text-gray-500">Loading...</div>

        <div class="flex space-x-8">
            <div v-if="user" class="w-1/4 bg-white shadow-lg p-4 rounded-md text-center">
                <div v-if="user.profilePicture" class="w-16 h-16 rounded-full overflow-hidden mb-4 mx-auto">
                    <img :src="user.profilePicture" alt="Profile Picture" class="w-full h-full object-cover" />
                </div>
                <div v-else
                    class="w-16 h-16 rounded-full bg-gray-300 text-white flex items-center justify-center mb-4 mx-auto">
                    <span class="text-xl font-bold">
                        {{ user.firstname && user.lastname ? user.firstname.charAt(0) + user.lastname.charAt(0) : 'N/A'
                        }}
                    </span>
                </div>
                <strong class="text-lg">{{ user.firstname || 'N/A' }} {{ user.lastname || 'N/A' }}</strong>
                <p class="text-gray-700 pb-3">{{ user.email || 'No email provided' }}</p>

                <button @click="logout"
                    class="w-full border text-red-500 font-bold py-2 rounded-md mt-2 hover:bg-gray-100 transition-colors">
                    Logout
                </button>

                <!-- ปุ่มสำหรับเปิด modal เปลี่ยนรหัสผ่าน -->
                <button @click="openChangePasswordModal"
                    class="w-full border py-2 rounded-md mt-2 hover:bg-gray-100 transition-colors">
                    Change Password
                </button>
            </div>

            <div v-if="customer_aff" class="profile-info flex space-x-8">
                <div class="w-3/4 bg-white shadow-lg p-4 rounded-md">
                    <p><strong>Name:</strong> {{ customer_aff.name }}</p>
                    <p><strong>Email:</strong> {{ customer_aff.email }}</p>
                    <p><strong>Gender:</strong> {{ customer_aff.gender }}</p>
                    <p><strong>Phone Number:</strong> {{ customer_aff.tel }}</p>
                    <p><strong>Line ID:</strong> {{ customer_aff.line_id }}</p>
                    <p><strong>Food Allergies:</strong> {{ customer_aff.food_allergies }}</p>
                    <p><strong>Delivery Date:</strong> {{ customer_aff.delivery_date }}</p>
                    <p><strong>Address 1:</strong> {{ customer_aff.address_1 }}</p>
                    <p><strong>Address 2:</strong> {{ customer_aff.address_2 }}</p>
                    <p><strong>Address 3:</strong> {{ customer_aff.address_3 }}</p>
                </div>
            </div>
        </div>

        <div v-if="customer_hhb" class="profile-info flex space-x-8">
            <div class="w-3/4 bg-white shadow-lg p-4 rounded-md">
                <p><strong>Name:</strong> {{ customer_hhb.name }}</p>
                <p><strong>Email:</strong> {{ customer_hhb.email }}</p>
                <p><strong>Phone Number:</strong> {{ customer_hhb.tel }}</p>
                <p><strong>Line ID:</strong> {{ customer_hhb.line_id }}</p>
                <p><strong>Address 1:</strong> {{ customer_hhb.address_1 }}</p>
                <p><strong>Address 2:</strong> {{ customer_hhb.address_2 }}</p>
                <p><strong>Address 3:</strong> {{ customer_hhb.address_3 }}</p>
            </div>
        </div>

        <!-- Modal สำหรับการเปลี่ยนรหัสผ่าน -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-md shadow-lg w-96">
                <h3 class="text-lg font-semibold mb-4">Change Password</h3>
                <form @submit.prevent="changePassword">
                    <div class="mb-4">
                        <label for="oldPassword" class="block text-sm font-medium text-gray-700">Old Password</label>
                        <input v-model="oldPassword" type="password" id="oldPassword"
                            class="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div class="mb-4">
                        <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                        <input v-model="newPassword" type="password" id="newPassword"
                            class="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div class="mb-4">
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New
                            Password</label>
                        <input v-model="confirmPassword" type="password" id="confirmPassword"
                            class="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
                    <div v-if="successMessage" class="text-green-500 mb-4">{{ successMessage }}</div>
                    <div class="flex space-x-4">
                        <button type="submit"
                            class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                            Save
                        </button>
                        <button type="button" @click="closeChangePasswordModal"
                            class="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import AuthService from '@/services/auth';

export default {
    data() {
        return {
            customer_aff: '',
            customer_hhb: '',

            error: null,
            loading: false,
            user: {},
            isModalOpen: false,  // เปิด/ปิด modal
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            errorMessage: '',
            successMessage: ''
        };
    },
    created() {
        this.fetchCustomerData();
        this.fetchCustomerHHBData();
        this.fetchProfile();
    },
    methods: {
        async fetchCustomerData() {
            this.loading = true;
            try {
                const response = await axios.get('http://127.0.0.1:3333/customer/profile');
                this.customer_aff = response.data.customer_aff;
            } catch (error) {
                this.error = 'Failed to fetch customer data';
            } finally {
                this.loading = false;
            }
        },
        async fetchCustomerHHBData() {
            this.loading = true;
            try {
                const response = await axios.get('http://127.0.0.1:3333/customer-hhb/profile');
                this.customer_hhb = response.data.customer_hhb;
            } catch (error) {
                this.error = 'Failed to fetch customer data';
            } finally {
                this.loading = false;
            }
        },


        async fetchProfile() {
            try {
                this.user = await AuthService.getProfile();
            } catch (err) {
                this.error = err.message || 'Failed to fetch profile';
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.username = '';
            this.$router.push('/'); // เปลี่ยนเส้นทางไปหน้า Login หลังจาก logout
        },

        // เปิด Modal สำหรับการเปลี่ยนรหัสผ่าน
        openChangePasswordModal() {
            this.isModalOpen = true;
        },

        // ปิด Modal
        closeChangePasswordModal() {
            this.isModalOpen = false;
            this.errorMessage = '';
            this.successMessage = '';
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
        },

        async changePassword() {
            if (this.newPassword !== this.confirmPassword) {
                this.errorMessage = 'New password and confirmation do not match.';
                return;
            }

            try {
                const response = await AuthService.changePassword(this.oldPassword, this.newPassword);
                this.successMessage = response.message;
                this.errorMessage = '';
                this.closeChangePasswordModal();
            } catch (error) {
                this.errorMessage = error.message || 'An error occurred.';
                this.successMessage = '';
            }
        }
    }
};
</script>

<style scoped>
/* เพิ่มสไตล์ของ modal หรือส่วนอื่นๆ ที่ต้องการ */
</style>