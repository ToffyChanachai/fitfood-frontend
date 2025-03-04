<template>
    <div v-if="showSuccessToast"
        class="fixed top-4 right-8 bg-green-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
        :class="{ 'opacity-100': showSuccessToast, 'opacity-0': !showSuccessToast }">
        <span class="material-symbols-outlined text-white">check_circle</span>
        <span>{{ toastSuccessMessage }}</span>
        <button @click="showSuccessToast = false" class="text-white hover:text-gray-200 focus:outline-none">
            <span class="material-symbols-outlined text-xl">close</span>
        </button>
    </div>

    <div v-if="showFailToast"
        class="fixed top-4 right-8 bg-red-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
        :class="{ 'opacity-100': showFailToast, 'opacity-0': !showFailToast }">
        <span class="material-symbols-outlined text-white">cancel</span>
        <span>{{ toastFailMessage }}</span>
        <button @click="showFailToast = false" class="text-white hover:text-gray-200 focus:outline-none">
            <span class="material-symbols-outlined text-xl">close</span>
        </button>
    </div>
    <div>

        <div class="flex space-x-4">
            <div v-if="user"
                class="w-1/5 bg-white shadow-lg p-4 rounded-md border text-center max-h-[350px] flex flex-col justify-between">
                <div class="flex flex-col items-center justify-center flex-grow">

                    <div class="w-16 h-16 rounded-full mb-4" v-if="isLoading">
                        <div class="bg-gray-100 animate-pulse w-full h-full rounded-full"></div>
                    </div>

                    <div v-else>
                        <div v-if="user.profilePicture" class="w-16 h-16 rounded-full overflow-hidden mb-4">
                            <img :src="user.profilePicture" alt="Profile Picture" class="w-full h-full object-cover" />
                        </div>
                        <div v-else
                            class="w-16 h-16 rounded-full bg-gray-300 text-white flex items-center justify-center mb-4">
                            <span class="text-xl font-bold">
                                {{ user.username ? user.username.charAt(0) : 'N/A' }}
                            </span>
                        </div>
                    </div>



                    <strong v-if="isLoading" class="text-lg">
                        <div class="bg-gray-100 animate-pulse h-6 w-32 rounded-md mb-2"></div>
                    </strong>
                    <strong v-else class="text-lg">
                        {{ user.username || 'N/A' }}
                    </strong>

                    <strong v-if="isLoading" class="text-lg">
                        <div class="bg-gray-100 animate-pulse h-6 w-32 rounded-md"></div>
                    </strong>
                    <span v-else class="text-lg">
                        <span class="text-gray-700 pb-3">{{ user.email || 'No email provided' }}</span>
                    </span>

                </div>

                <div class="mt-auto w-full">
                    <button @click="logout"
                        class="w-full border text-red-500 font-bold py-2 rounded-md mt-2 hover:bg-gray-100 transition-colors">
                        Logout
                    </button>

                    <button @click="openChangePasswordModal"
                        class="w-full border py-2 rounded-md mt-2 hover:bg-gray-100 transition-colors">
                        Change Password
                    </button>
                </div>
            </div>


            <!-- คอลัมน์ข้อมูลลูกค้า -->
            <div class="w-4/5 flex flex-col space-y-4 ">

                <div v-if="isLoading" class="text-lg">
                    <div class="bg-gray-100 animate-pulse h-64  rounded-md mb-2"></div>
                </div>

                <div v-else>
                    <div v-if="customer_aff" class="relative bg-white shadow-lg p-8 rounded-md border">
                        <button @click="onEdit(customer_aff)"
                            class="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                            <span class="material-symbols-outlined">edit_square</span>
                            <span>แก้ไข</span>
                        </button>

                        <strong class="text-xl text-custom-orange mb-2 block">Abosolute FitFood Profile</strong>
                        <p><strong>ชื่อ:</strong> {{ customer_aff.name }}</p>
                        <p><strong>Email:</strong> {{ customer_aff.email }}</p>
                        <p><strong>รหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่:</strong> {{ customer_aff.customer_id }}</p>
                        <p><strong>เพศ:</strong> {{ customer_aff.gender }}</p>
                        <p><strong>เบอร์โทรศัพท์:</strong> {{ customer_aff.tel }}</p>
                        <p><strong>Line ID:</strong> {{ customer_aff.line_id }}</p>
                        <p><strong>แพ้อาหาร:</strong>
                            {{ formatFoodAllergies(customer_aff.food_allergies) }}
                            <span v-if="customer_aff.food_allergies_detail">
                                {{ customer_aff.food_allergies_detail }}
                            </span>
                        </p>
                        <p><strong>วันที่ต้องการรับอาหาร:</strong> {{ customer_aff.delivery_date }}</p>
                        <p><strong>ผู้รับอาหาร:</strong> {{ customer_aff.recipient_mon_to_fri }}</p>
                        <p><strong>รายละเอียดอื่นๆ:</strong> {{ customer_aff.note }}</p>
                        <p><strong>ที่อยู่จัดส่ง 1:</strong> {{ customer_aff.address_1 }}</p>
                        <p><strong>ที่อยู่จัดส่ง 2:</strong> {{ customer_aff.address_2 }}</p>
                        <p><strong>ที่อยู่จัดส่ง 3:</strong> {{ customer_aff.address_3 }}</p>
                    </div>

                    <div v-else class="relative bg-white shadow-lg p-8 rounded-md border flex">
                        <strong class="text-xl text-custom-orange mr-4 block">Abosolute FitFood Profile</strong>

                        <button @click="goToRegisterAFF"
                            class="bg-custom-orange text-white px-4 py-2 rounded hover:bg-custom-orange-hover flex items-center justify-center ml-auto">
                            Register Profile
                        </button>
                    </div>


                    <!-- กล่องข้อมูลของ customer_hhb -->
                    <div v-if="customer_hhb" class="relative bg-white shadow-lg p-8 rounded-md border">
                        <button @click="onEditHHB(customer_hhb)"
                            class="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                            <span class="material-symbols-outlined">edit_square</span>
                            <span>แก้ไข</span>
                        </button>

                        <strong class="text-xl text-custom-orange mb-2 block">Happy Healthy Box Profile</strong>
                        <p><strong>ชื่อ:</strong> {{ customer_hhb.name }}</p>
                        <p><strong>Email:</strong> {{ customer_hhb.email }}</p>
                        <p><strong>เบอร์โทรศัพท์:</strong> {{ customer_hhb.tel }}</p>
                        <p><strong>Line ID:</strong> {{ customer_hhb.line_id }}</p>
                        <p><strong>ที่อยู่จัดส่ง 1:</strong> {{ customer_hhb.address_1 }}</p>
                        <p><strong>ที่อยู่จัดส่ง 2:</strong> {{ customer_hhb.address_2 }}</p>
                        <p><strong>ที่อยู่จัดส่ง 3:</strong> {{ customer_hhb.address_3 }}</p>
                        <p><strong>สถานที่ใกล้เคียงหรือจุดสังเกตอื่นๆ:</strong> {{ customer_hhb.nearby_places }}</p>
                        <p><strong>ผู้รับอาหาร:</strong> {{ customer_hhb.recipient }}</p>
                        <p><strong>รายละเอียดอื่นๆ:</strong> {{ customer_hhb.note }}</p>
                    </div>

                    <div v-else class="relative bg-white shadow-lg p-8 rounded-md border flex">
                        <strong class="text-xl text-custom-orange mr-4 block">Happy Healthy Box Profile</strong>

                        <button @click="goToRegisterHHB"
                            class="bg-custom-orange text-white px-4 py-2 rounded hover:bg-custom-orange-hover flex items-center justify-center ml-auto">
                            Register Profile
                        </button>
                    </div>
                </div>



            </div>
        </div>

        <div v-if="isEditModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">

            <div v-if="showErrorToast"
                class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
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
                    <span class="font-bold">แก้ไขข้อมูลลูกค้า</span>
                    <div class="flex space-x-2">
                        <span @click="closeEditModal"
                            class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                            close </span>
                    </div>
                </div>
                <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                    <div class="mb-4">
                        <label for="editCustomerName" class="block text-gray-700 font-medium">ชื่อ</label>
                        <input v-model="selectedCustomer.name" id="editCustomerName" type="text"
                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                    </div>

                    <div class="mb-4">
                        <label for="editCustomerEmail" class="block text-gray-700 font-medium">อีเมล</label>
                        <input v-model="selectedCustomer.email" id="editCustomerEmail" type="email"
                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                    </div>

                    <div>
                        <label for="customer_id"
                            class="block  font-medium text-gray-700">รหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา</label>
                        <input type="text" v-model="selectedCustomer.customer_id"
                            placeholder="กรอกรหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                    </div>

                    <div>
                        <label class="block  font-medium text-gray-700">เพศ</label>
                        <div class="flex space-x-4">
                            <label>
                                <input type="radio" v-model="selectedCustomer.gender" value="female"
                                    class="focus:ring-custom-orange" />
                                ผู้หญิง / Female
                            </label>
                            <label>
                                <input type="radio" v-model="selectedCustomer.gender" value="male"
                                    class="focus:ring-custom-orange" />
                                ผู้ชาย / Male
                            </label>
                        </div>
                    </div>

                    <div class="flex space-x-4">
                        <div class="w-1/2">
                            <label for="tel" class="block  font-medium text-gray-700">เบอร์โทรศัพท์</label>
                            <input type="text" v-model="selectedCustomer.tel" maxlength="10"
                                placeholder="กรอกหมายเลขโทรศัพท์"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>

                        <div class="w-1/2">
                            <label for="line_id" class="block  font-medium text-gray-700">Line ID (ถ้ามี)</label>
                            <input type="text" v-model="selectedCustomer.line_id" placeholder="กรอก line id"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>
                    </div>

                    <div>
                        <label class="block  font-medium text-gray-700">คุณแพ้อาหารชนิดใดหรือไม่?</label>
                        <div class="flex space-x-4">
                            <label>
                                <input type="radio" v-model="selectedCustomer.food_allergies" value="No"
                                    @change="selectedCustomer.food_allergies_detail = null" />

                                ไม่ / No
                            </label>
                            <label>
                                <input type="radio" v-model="selectedCustomer.food_allergies" value="Yes"
                                    class="focus:ring-custom-orange" />
                                ใช่ / Yes
                            </label>

                        </div>
                    </div>

                    <div v-if="selectedCustomer.food_allergies === 'Yes'">
                        <label for="food_allergies_detail"
                            class="block  font-medium text-gray-700">โปรดระบุประเภทอาหารที่คุณมีอาการแพ้ในบรรทัดด้านล่าง</label>
                        <textarea id="food_allergies_detail" v-model="selectedCustomer.food_allergies_detail"
                            placeholder="Enter details here"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="delivery_date"
                            class="block  font-medium text-gray-700">โปรดระบุวันที่คุณต้องการรับอาหาร</label>
                        <input type="text" v-model="selectedCustomer.delivery_date"
                            placeholder="กรอกโปรดระบุวันที่คุณต้องการรับอาหาร"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">ผู้รับอาหาร?</label>
                        <div class="flex space-x-4">
                            <label class="text-gray-700">
                                <input type="radio" v-model="selectedCustomer.recipient_mon_to_fri" value="ตัวคุณเอง"
                                    class="focus:ring-custom-orange custom-radio" />
                                ตัวคุณเอง
                            </label>
                            <label class="text-gray-700">
                                มีผู้อื่นรับแทน (โปรดระบุชื่อ พร้อมเบอร์โทรติดต่อในบรรทัดด้านล่าง)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label for="recipient_mon_to_fri" class="block  font-medium text-gray-700">โปรดระบุชื่อ
                            พร้อมเบอร์โทรติดต่อ</label>
                        <textarea id="recipient_mon_to_fri" v-model="selectedCustomer.recipient_mon_to_fri"
                            placeholder="Enter details here"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="note" class="block font-medium text-gray-700">หากมีรายละเอียดอื่นๆ ที่เราควรทราบ
                            โปรดระบุ</label>
                        <textarea id="note" v-model="selectedCustomer.note" placeholder="กรอกรายละเอียดอื่นๆ"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_1" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 1</label>
                        <textarea id="address" v-model="selectedCustomer.address_1" placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_2" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 2
                            (ถ้ามี)</label>
                        <textarea id="address_2" v-model="selectedCustomer.address_2" placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_3" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 3
                            (ถ้ามี)</label>
                        <textarea id="address_3" v-model="selectedCustomer.address_3" placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
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
                            class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-30">
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isEditHHBModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">

            <div v-if="showErrorToast"
                class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
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
                    <span class="font-bold">แก้ไขข้อมูล</span>
                    <div class="flex space-x-2">
                        <span @click="closeEditModalHHB"
                            class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                            close </span>
                    </div>
                </div>
                <div class="p-6 space-y-4 overflow-y-auto flex-grow">
                    <div class="mb-4">
                        <label for="editCustomerName" class="block text-gray-700 font-medium">Name</label>
                        <input v-model="selectedCustomerHHB.name" id="editCustomerName" type="text"
                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                    </div>

                    <div class="mb-4">
                        <label for="editCustomerEmail" class="block text-gray-700 font-medium">Email</label>
                        <input v-model="selectedCustomerHHB.email" id="editCustomerEmail" type="email"
                            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange">
                    </div>

                    <div>
                        <label for="customer_id"
                            class="block  font-medium text-gray-700">รหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา</label>
                        <input type="text" v-model="selectedCustomerHHB.customer_id"
                            placeholder="กรอกรหัสอ้างอิงที่คุณได้รับจากเจ้าหน้าที่ของเรา"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                    </div>

                    <div class="flex space-x-4">
                        <div class="w-1/2">
                            <label for="tel" class="block  font-medium text-gray-700">Phone Number</label>
                            <input type="text" v-model="selectedCustomerHHB.tel" maxlength="10"
                                placeholder="กรอกหมายเลขโทรศัพท์"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>

                        <div class="w-1/2">
                            <label for="line_id" class="block  font-medium text-gray-700">Line ID (ถ้ามี)</label>
                            <input type="text" v-model="selectedCustomerHHB.line_id" placeholder="กรอก line id"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                        </div>
                    </div>

                    <!-- <div>
                        <label class="block font-medium text-gray-700">คุณแพ้อาหารชนิดใดหรือไม่?</label>
                        <div class="flex space-x-4">
                            <label>
                                <input type="checkbox" v-model="selectedCustomerHHB.recipient" value="ตัวคุณเอง"
                                    class="focus:ring-custom-orange" />
                                ตัวคุณเอง
                            </label>
                            <label>
                                <input type="checkbox" v-model="selectedCustomerHHB.recipient" value="อื่นๆ, "
                                    class="focus:ring-custom-orange" />
                                อื่นๆ
                            </label>

                        </div>
                    </div>

                    <div v-if="selectedCustomerHHB.recipient === 'อื่นๆ, '">
                        <label for="recipient_detail"
                            class="block  font-medium text-gray-700">โปรดระบุประเภทอาหารที่คุณมีอาการแพ้ในบรรทัดด้านล่าง</label>
                        <textarea id="recipient_detail" v-model="selectedCustomerHHB.recipient_detail"
                            placeholder="Enter details here"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div> -->

                    <div>
                        <label class="block font-medium text-gray-700">ผู้รับอาหาร?</label>
                        <div class="flex space-x-4">
                            <label class="text-gray-700">
                                <input type="radio" v-model="selectedCustomerHHB.recipient" value="ตัวคุณเอง"
                                    class="focus:ring-custom-orange custom-radio" />
                                ตัวคุณเอง
                            </label>
                            <label class="text-gray-700">
                                มีผู้อื่นรับแทน (โปรดระบุชื่อ พร้อมเบอร์โทรติดต่อในบรรทัดด้านล่าง)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label for="recipient" class="block  font-medium text-gray-700">โปรดระบุชื่อ
                            พร้อมเบอร์โทรติดต่อ</label>
                        <textarea id="recipient" v-model="selectedCustomerHHB.recipient"
                            placeholder="Enter details here"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="note" class="block  font-medium text-gray-700">โปรดระบุเบอร์โทรติดต่อสำรอง
                            หรือรายละเอียดอื่น ๆ ที่เราควรทราบ (ถ้ามี)</label>
                        <textarea id="note" v-model="selectedCustomerHHB.note"
                            placeholder="ระบุเบอร์โทรติดต่อสำรอง หรือรายละเอียดอื่น ๆ ที่เราควรทราบ (ถ้ามี)"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_1" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 1</label>
                        <textarea id="address" v-model="selectedCustomerHHB.address_1"
                            placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_2" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 2
                            (ถ้ามี)</label>
                        <textarea id="address_2" v-model="selectedCustomerHHB.address_2"
                            placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="address_3" class="block  font-medium text-gray-700">ที่อยู่จัดส่ง 3
                            (ถ้ามี)</label>
                        <textarea id="address_3" v-model="selectedCustomerHHB.address_3"
                            placeholder="กรอกที่อยู่การจัดส่ง"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>

                    <div>
                        <label for="nearby_places"
                            class="block  font-medium text-gray-700">สถานที่ใกล้เคียงหรือจุดสังเกตอื่น ๆ </label>
                        <textarea id="nearby_places" v-model="selectedCustomerHHB.nearby_places"
                            placeholder="กรอกสถานที่ใกล้เคียงหรือจุดสังเกตอื่น ๆ "
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-orange"
                            rows="4"></textarea>
                    </div>


                </div>

                <!-- Footer (with buttons) -->
                <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
                    <div class="flex space-x-2">
                        <button @click="closeEditModalHHB"
                            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                            ยกเลิก
                        </button>
                        <button @click="saveChangesHHB"
                            class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-30">
                            บันทึก
                        </button>
                    </div>
                </div>
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
import { API_URL } from "@/services/api";

export default {
    data() {
        return {
            customer_aff: '',
            customer_hhb: '',

            error: null,
            isLoading: false,
            user: {},
            isModalOpen: false,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            errorMessage: '',
            successMessage: '',

            selectedCustomer: [],
            selectedCustomerHHB: [],

            isEditModalOpen: false,
            isEditHHBModalOpen: false,
            toastSuccessMessage: "",
            showSuccessToast: false,
            toastFailMessage: "",
            showFailToast: false,
            showErrorToast: false,
            toastErrorMessage: "",

        };
    },
    created() {
        this.fetchCustomerData();
        this.fetchCustomerHHBData();
        this.fetchProfile();
    },
    methods: {
        async fetchCustomerData() {
            this.isLoading = true;
            try {
                const response = await axios.get(`${API_URL}/customer/profile`);
                this.customer_aff = response.data.customer_aff;
            } catch (error) {
                this.error = 'Failed to fetch customer data';
            } finally {
                this.isLoading = false;
            }
        },
        async fetchCustomerHHBData() {
            this.isLoading = true;
            try {
                const response = await axios.get(`${API_URL}/customer-hhb/profile`);
                this.customer_hhb = response.data.customer_hhb;
            } catch (error) {
                this.error = 'Failed to fetch customer data';
            } finally {
                this.isLoading = false;
            }
        },
        async fetchProfile() {
            this.isLoading = true;
            try {
                this.user = await AuthService.getProfile();
            } catch (err) {
                this.error = err.message || 'Failed to fetch profile';
            }
            finally {
                this.isLoading = false;
            }

        },
        logout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.username = '';
            this.$router.push('/'); // เปลี่ยนเส้นทางไปหน้า Login หลังจาก logout
        },

        formatFoodAllergies(value) {
            if (value === 'Yes') {
                return 'ใช่ Yes,';
            } else if (value === 'No') {
                return 'ไม่ No';
            }
            return value; // ถ้าไม่ใช่ Yes หรือ No ให้แสดงค่าปกติ
        },

        onEdit(customer) {
            this.selectedCustomer = { ...customer }; // คัดลอกข้อมูลลูกค้า
            this.isEditModalOpen = true; // เปิด Modal
        },
        async saveChanges() {
            try {
                if (!this.selectedCustomer.name || !this.selectedCustomer.email) {
                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }

                // console.log(this.selectedCustomer.recipient_mon_to_fri);


                const response = await axios.put(`${API_URL}/customers/${this.selectedCustomer.id}`, {
                    email: this.selectedCustomer.email,
                    customer_id: this.selectedCustomer.customer_id,
                    name: this.selectedCustomer.name,
                    gender: this.selectedCustomer.gender,
                    tel: this.selectedCustomer.tel,
                    line_id: this.selectedCustomer.line_id,
                    food_allergies: this.selectedCustomer.food_allergies,
                    food_allergies_detail: this.selectedCustomer.food_allergies_detail,
                    delivery_date: this.selectedCustomer.delivery_date,
                    recipient_mon_to_fri: this.selectedCustomer.recipient_mon_to_fri,
                    note: this.selectedCustomer.note,
                    address_1: this.selectedCustomer.address_1,
                    address_2: this.selectedCustomer.address_2,
                    address_3: this.selectedCustomer.address_3,
                });

                // อัปเดตข้อมูลในตัวแปร customer_
                if (this.customer_aff.id === this.selectedCustomer.id) {
                    this.customer_aff = response.data;
                }

                this.isEditModalOpen = false; // ปิด Modal
                this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
            } catch (error) {
                console.error('Error saving changes:', error);
                this.showErrorToastNotification('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false; // ปิด Modal
            this.selectedCustomer = {}; // รีเซ็ตข้อมูลลูกค้าที่เลือก
        },

        onEditHHB(customer) {
            this.selectedCustomerHHB = { ...customer }; // คัดลอกข้อมูลลูกค้า
            this.isEditHHBModalOpen = true; // เปิด Modal
        },
        async saveChangesHHB() {
            try {
                if (!this.selectedCustomerHHB.name || !this.selectedCustomerHHB.email) {
                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }

                const response = await axios.put(`${API_URL}/customers-hhb/${this.selectedCustomerHHB.id}`, {
                    email: this.selectedCustomerHHB.email,
                    customer_id: this.selectedCustomerHHB.customer_id,
                    name: this.selectedCustomerHHB.name,
                    tel: this.selectedCustomerHHB.tel,
                    line_id: this.selectedCustomerHHB.line_id,
                    nearby_places: this.selectedCustomerHHB.nearby_places,
                    recipient: this.selectedCustomerHHB.recipient,
                    note: this.selectedCustomerHHB.note,
                    address_1: this.selectedCustomerHHB.address_1,
                    address_2: this.selectedCustomerHHB.address_2,
                    address_3: this.selectedCustomerHHB.address_3,
                });

                // อัปเดตข้อมูลในตัวแปร customer_hhb
                if (this.customer_hhb.id === this.selectedCustomerHHB.id) {
                    this.customer_hhb = response.data;
                }

                this.isEditHHBModalOpen = false; // ปิด Modal
                this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
            } catch (error) {
                console.error('Error saving changes:', error);
                this.showErrorToastNotification('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
            }
        },
        closeEditModalHHB() {
            this.isEditHHBModalOpen = false; // ปิด Modal
            this.selectedCustomerHHB = {}; // รีเซ็ตข้อมูลลูกค้าที่เลือก
        },
        goToRegisterHHB() {
            this.$router.push('/register-hhb');  // ใช้ Vue Router เพื่อไปที่หน้า /register-hbb
        },
        goToRegisterAFF() {
            this.$router.push('/register-aff');  // ใช้ Vue Router เพื่อไปที่หน้า /register-hbb
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

        // openChangePasswordModal() {
        //     this.isModalOpen = true;
        // },

        // closeChangePasswordModal() {
        //     this.isModalOpen = false;
        //     this.errorMessage = '';
        //     this.successMessage = '';
        //     this.oldPassword = '';
        //     this.newPassword = '';
        //     this.confirmPassword = '';
        // },

        // async changePassword() {
        //     if (this.newPassword !== this.confirmPassword) {
        //         this.errorMessage = 'New password and confirmation do not match.';
        //         return;
        //     }

        //     try {
        //         const response = await AuthService.changePassword(this.oldPassword, this.newPassword);
        //         this.successMessage = response.message;
        //         this.errorMessage = '';
        //         this.closeChangePasswordModal();
        //     } catch (error) {
        //         this.errorMessage = error.message || 'An error occurred.';
        //         this.successMessage = '';
        //     }
        // }
    }
};
</script>

<style scoped>
/* เพิ่มสไตล์ของ modal หรือส่วนอื่นๆ ที่ต้องการ */
</style>