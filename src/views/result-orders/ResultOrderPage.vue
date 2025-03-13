<template>
  <div class="mt-[-20px]">
    <div
      class="fixed top-4 right-8 bg-green-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
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

    <div
      class="fixed top-4 right-8 bg-red-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
      :class="{ 'opacity-100': showFailToast, 'opacity-0': !showFailToast }">
      <span class="material-symbols-outlined text-white">cancel</span>
      <span>{{ toastFailMessage }}</span>
      <button @click="showFailToast = false" class="text-white hover:text-gray-200 focus:outline-none">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <div
      class="fixed top-4 right-8 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
      :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
      <span class="material-symbols-outlined text-white">cancel</span>
      <span>{{ toastErrorMessage }}</span>
      <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <div class="flex items-center space-x-3 py-2">
      <!-- ปุ่มลูกศรย้อนกลับ -->
      <button @click="changeDate(-1)" class="flex items-center">
        <span class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover">
          chevron_backward
        </span>
      </button>

      <button @click="setToday" class="flex items-center text-custom-orange hover:underline hover:text-custom-orange">
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


    <div class="flex justify-end items-center space-x-2 relative">
      <div class="mt-4 px-4 flex items-center space-x-1 mr-auto ">
        <span class="material-symbols-outlined text-2xl text-gray-700">receipt_long</span>
        <span class="text-m text-gray-700">จำนวนรายการอาหารประจำวันของลูกค้าทั้งหมด: </span>
        <span class="text-m text-custom-orange font-bold"> {{ filteredOrdersWithoutHappy.length }} รายการ</span>
      </div>

      <div>
        <button
          v-if="selectedOrders.some(order => order.status === 'pending') && !selectedOrders.some(order => order.status === 'confirm')"
          @click="confirmMultipleOrders"
          class="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md flex items-center space-x-1 "
          :disabled="selectedOrders.length === 0">
          ยืนยันการสั่งที่เลือก ({{ selectedOrders.length }})
        </button>

        <button
          v-if="selectedOrders.some(order => order.status === 'confirm') && !selectedOrders.some(order => order.status === 'pending')"
          @click="pendingMultipleOrders"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-md flex items-center space-x-1"
          :disabled="selectedOrders.length === 0">
          ยกเลิกยืนยันการสั่งที่เลือก ({{ selectedOrders.length }})
        </button>
      </div>

      <button v-if="selectedOrder.length > 0" @click="clearFilter"
        class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
        <span class="material-symbols-outlined">close</span>
        <span class="ml-2">รีเซ็ตตัวกรอง ({{ selectedOrder.length }})</span>
      </button>

      <div class="add relative inline-block">
        <button @click="openAddModal"
          class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
          <span class="material-symbols-outlined text-white text-xl leading-none">add</span>
          <span class="text-white text-base leading-none">เพิ่ม</span>
        </button>

        <div v-if="isAddModalOpen"
          class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">


          <div
            class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
            :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }">
            <span class="material-symbols-outlined text-white">error</span>
            <span>{{ toastErrorMessage }}</span>
            <button @click="showErrorToast = false" class="text-white hover:text-gray-200 focus:outline-none">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col">

            <!-- Header -->
            <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
              <h2 class="text-xl font-bold">เพิ่มการสั่งรายการอาหาร</h2>
              <span @click="closeAddModal"
                class="material-symbols-outlined cursor-pointer hover:text-gray-200">close</span>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4 ">
              <div>
                <label for="promotionType" class="block font-bold text-gray-700">ลูกค้า</label>
                <multiselect v-model="newOrder.customer_id" :options="customers" :multiple="false" :searchable="true"
                  :close-on-select="true" placeholder="เลือกประเภทโปรแกรมเมนู" label="name" track-by="id"
                  class="z-50" />
              </div>

              <div>
                <label for="mealType" class="font-bold text-gray-700">ประเภทแพ็คเกจ</label>
                <multiselect v-model="selectedMenuType" :options="menu_types" :multiple="false" :searchable="true"
                  :close-on-select="true" placeholder="เลือกประเภทแพ็คเกจ" label="name" track-by="id" />
              </div>

              <div>
                <label for="mealType" class="font-bold text-gray-700">ประเภทอาหาร</label>
                <multiselect v-model="selectedMealType" :options="getFilteredMealType(selectedMenuType)" :multiple="false" :searchable="true"
                  :close-on-select="true" placeholder="เลือกประเภทอาหาร" label="name" track-by="id" />
              </div>

              <div>
                <label for="menu" class="block font-bold text-gray-700">รายการอาหาร</label>
                <multiselect v-model="newOrder.menu_id" :options="getFilteredMenus(selectedMealType)"
                  placeholder="เลือกรายการอาหาร" track-by="id" :custom-label="menuLabel" />
              </div>

              <div class="flex items-center space-x-4">
                <div>
                  <label for="menu" class="block font-bold text-gray-700">จำนวน</label>
                  <div class="flex items-center space-x-2">
                    <button @click="decreaseQuantity(newOrder)"
                      class="bg-custom-orange text-white px-3 py-1 rounded hover:bg-custom-orange-hover">-</button>

                    <input type="number" v-model="newOrder.quantity"
                      class="border px-4 py-2 rounded w-32 text-center input-no-spinner" />

                    <button @click="increaseQuantity(newOrder)"
                      class="bg-custom-orange text-white px-3 py-1 rounded hover:bg-custom-orange-hover">+</button>
                  </div>

                </div>

                <div class="flex-1">
                  <label for="orderDate" class="block font-bold text-gray-700">วันที่สั่งรายการอาหาร</label>
                  <input v-model="newOrder.order_date" id="orderDate" type="date"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>
              </div>


              <div>
                <label for="package_status" class="block font-bold text-gray-700">สถานะการตัดแพ็คเกจ:</label>
                <select v-model="newOrder.package_status" class="border px-2 py-1 rounded w-full">
                  <option value="calculate">ตัดแพ็คเกจ</option>
                  <option value="not_calculate">ไม่ตัดแพ็คเกจ</option>
                </select>
              </div>

            </div>

            <!-- Footer -->
            <div class="flex justify-between space-x-4 p-4 bg-white border-t rounded-b-md list-none">
              <li @click="resetNewOrder"
                class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline">
                <span>รีเซ็ตข้อมูล</span>
              </li>
              <div class="flex space-x-2">
                <button @click="closeAddModal" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                  ยกเลิก
                </button>
                <button @click="addOrder"
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
          class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-52 z-50 border border-gray-300">
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
            <li @click="sortData('user_id')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามชื่อลูกค้า</span>
              <span v-if="sortColumn === 'user_id'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["user_id"] === 1
                    ? "arrow_upward"
                    : "arrow_downward"
                }}
              </span>
            </li>
            <li @click="sortData('order_date')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามวันที่สั่งซื้อ</span>
              <span v-if="sortColumn === 'order_date'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["order_date"] === 1
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
            <div class="grid grid-cols-3 gap-4">
              <label v-for="type in filteredMenuTypes" :key="type.id" class="flex items-center space-x-2">
                <input type="checkbox" v-model="selectedOrder" :value="type.id"
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

    <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white">
          <th class="px-4 py-2 text-left align-center">
            <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
              class="w-4 h-4 accent-black focus:ring-0" />
          </th>
          <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 font-bold text-center']"
            :style="{ width: headerWidths[index], cursor: 'default', pointerEvents: 'none' }">
            {{ header }}
          </th>
        </tr>

      </thead>
      <tbody>
        <tr v-if="isLoading" class="bg-white">
          <td colspan="10" class="py-16 text-center">
            <div class="flex justify-center items-center space-x-2">
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></div>
              <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-400"></div>
            </div>
          </td>
        </tr>

        <template v-else>
          <tr v-for="(order, index) in filteredOrders" :key="index"
            class="border-b border-b-gray-200 bg-white relative">
            <td class="px-4 py-2 align-top pb-5">
              <input type="checkbox" v-model="selectedOrders" :value="order"
                class="w-4 h-4 accent-custom-orange focus:ring-0" />
            </td>
            <td class="px-4 py-2 align-top pb-5 text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

            <td
              class="px-4 py-2 align-top font-bold border-l border-r text-custom-orange pb-5 cursor-pointer hover:text-custom-orange-hover"
              v-if="shouldDisplayUserName(index, order.customer_id)" :rowspan="getRowspan(order.customer_id, index)"
              @click="selectCustomerOrders(order.customer_id)">
              {{ getCustomerName(order.customer_id) }}
            </td>

            <td class="px-4 py-2 align-top pb-5 text-center">{{ formatDate(order.order_date) }}</td>
            <td class="px-4 py-2 align-top pb-5">{{ getMenuTypeName(order.menu_type_id) }}</td>

            <td class="px-4 py-2 align-top pb-5">
              <div>{{ getMenuEngName(order.menu_id) }}</div>
              <div>({{ getMenuName(order.menu_id) }})</div>
            </td>

            <td class="px-4 py-2 align-top pb-5">
              <div v-if="isEditing && editingOrderId === order.id" class="flex items-center space-x-2">
                <button @click="decreaseQuantity(order)"
                  class="bg-custom-orange text-white px-3 py-1 rounded hover:bg-custom-orange-hover">-</button>

                <input type="number" v-model="order.quantity"
                  class="border px-2 py-1 rounded w-16 text-center input-no-spinner" />

                <button @click="increaseQuantity(order)"
                  class="bg-custom-orange text-white px-3 py-1 rounded hover:bg-custom-orange-hover">+</button>
              </div>

              <span v-else class="text-gray-700 flex flex-col items-center">
                <strong class="text-black">{{ order.quantity }}</strong>
                <span
                  :class="{ 'text-green-500': order.package_status === 'calculate', 'text-red-500': order.package_status !== 'calculate' }">
                  ({{ getPackageStatusText(order.package_status) }})
                </span>
              </span>


            </td>



            <td class="px-4 py-2 align-top font-bold pb-5">
              <button @click="openConfirmSatatusModal(order)"
                class="px-4 py-1 rounded-full font-bold focus:outline-none hover:text-gray-200"
                :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </button>

              <div v-if="isConfirmStatusModalOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-10 z-50">

                <div class="bg-white rounded-md w-1/3 max-w-lg">
                  <!-- Header -->
                  <div :class="{
                    'bg-green-500':
                      selectedOrder.status === 'pending',
                    'bg-red-500': selectedOrder.status === 'confirm',
                  }" class="flex justify-between items-center text-white px-4 py-2 rounded-t-md">
                    <span class="font-bold">
                      {{
                        selectedOrder.status === "paid"
                          ? "เปลี่ยนสถานะเป็นยังไม่ได้ยืนยันการสั่ง"
                          : "ยืนยันการสั่ง"
                      }}
                    </span>
                    <button @click="closeConfirmStatusModal" class="text-white hover:text-gray-200">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <!-- Content -->
                  <div class="p-6 space-y-4">
                    <p class="text-gray-700">
                      {{
                        selectedOrder.status === "confirm"
                          ? 'คุณต้องการเปลี่ยนสถานะเป็น "ยังไม่ได้ยืนยันการสั่ง" หรือไม่?'
                          : "ยืนยันการสั่ง?"
                      }}
                    </p>

                  </div>

                  <!-- Footer -->
                  <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md">
                    <button @click="closeConfirmStatusModal"
                      class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                      ยกเลิก
                    </button>
                    <button @click="confirmStatus" :class="{
                      'bg-green-500 hover:bg-green-600':
                        selectedOrder.status === 'pending',
                      'bg-red-500 hover:bg-red-600':
                        selectedOrder.status === 'confirm',
                    }" class="text-white px-4 py-2 rounded">
                      ยืนยัน
                    </button>
                  </div>
                </div>
              </div>
            </td>

            <td class="px-4 py-2 text-right pb-5 relative">
              <div class="flex justify-end space-x-2">
                <button v-if="!isEditing || editingOrderId !== order.id" @click="startEditing(order)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                  <span class="material-symbols-outlined">edit_square</span>
                  <span>แก้ไข</span>
                </button>

                <button v-if="isEditing && editingOrderId === order.id" @click="saveUpdatedQuantity(order)"
                  class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-1">
                  <span class="material-symbols-outlined">check</span>
                  <span>บันทึก</span>
                </button>

                <button v-if="isEditing && editingOrderId === order.id" @click="cancelEditing"
                  class="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 flex items-center space-x-1">
                  <span class="material-symbols-outlined">close</span>
                  <span>ยกเลิก</span>
                </button>

                <button @click="confirmDelete(order.id)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1">
                  <span class="material-symbols-outlined">delete</span>
                  <span>ลบ</span>
                </button>
              </div>
            </td>


          </tr>

          <tr v-if="filteredOrders.length === 0">
            <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">ไม่พบข้อมูล </td>
          </tr>

        </template>
      </tbody>

      <div v-if="isDeleteModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-md w-1/3">
          <div class="flex justify-between items-center bg-red-500 text-white px-4 py-2 rounded-t">
            <h2 class="text-lg font-bold">ยืนยันการลบ</h2>
            <span @click="closeDeleteModal" class="material-symbols-outlined cursor-pointer hover:text-gray-200">
              close
            </span>
          </div>
          <div class="p-4">
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
          </div>
          <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
            <button @click="closeDeleteModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              ยกเลิก
            </button>
            <button @click="deleteConfirmed" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
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
    </div>

  </div>


</template>

<script>
import axios from 'axios';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Multiselect from "vue-multiselect";
import { API_URL } from "@/services/api";


export default {
  components: {
    Multiselect
  },
  data() {
    return {
      headers: ['#', `Customer's Name`, 'วันที่สั่งซื้อ', 'Packge Type', 'รายการอาหาร', 'จำนวน', 'สถานะ', ''],
      headerWidths: ['5%', '20%', '15%', '15%', '20%', '10%', '15%', '5%'],
      // sortDateDirection: 'asc', // กำหนดทิศทางการเรียงลำดับ (asc หรือ desc)
      sortIcon: 'arrow_downward',

      orders: [],
      searchQuery: "",

      selectedMealType: "",
      selectedMenuType: "",
      // filteredOrders: [],
      selectedDate: "",
      customers: [],
      menus: [],
      menu_types: [],
      meal_types: [],

      selectedOrder: [],
      selectedOrders: [],

      isConfirmStatusModalOpen: false,
      isAllSelected: false,

      currentPage: 1,
      itemsPerPage: 10,

      startDate: '', // วันที่เริ่มต้น
      endDate: '',

      toastSuccessMessage: "",
      showSuccessToast: false,
      toastFailMessage: "",
      showFailToast: false,
      showErrorToast: false,
      toastErrorMessage: "",

      isFilterDropdownOpen: false,
      isSortDropdownOpen: false,
      sortDirection: {
        id: 1,
        name: 1
      },
      sortColumn: '',
      isLoading: false,

      isEditing: false,
      editingOrderId: null,
      isDeleteModalOpen: false,
      itemToDelete: null,

      isAddModalOpen: false,
      newOrder: {
        menu_id: "",
        quantity: 0,
        order_date: "",
        customer_id: "",
        package_status: "calculate",
      },

    };
  },
  // components: {
  //     Multiselect
  // },
  computed: {
    filteredMenuTypes() {
      return this.menu_types.filter(type => !type.name.startsWith('Happy'));
    },
    filteredOrdersWithoutHappy() {
      return this.orders.filter(order => {
        const menuTypeName = this.getMenuTypeName(order.menu_type_id) || ''; // ป้องกัน undefined
        return !menuTypeName.startsWith("Happy");
      });
    },

    filteredOrders() {
      const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : ''; // ป้องกัน undefined
      return this.filteredOrdersWithoutHappy.filter(order => {
        const customerName = this.getCustomerName(order.user_id) || ''; // ป้องกัน undefined
        const matchesSearch = searchQuery === '' || customerName.toLowerCase().includes(searchQuery);
        const matchesPromotionType = !Array.isArray(this.selectedOrder) || this.selectedOrder.length === 0 || this.selectedOrder.includes(order.menu_type_id);
        return matchesSearch && matchesPromotionType;
      }).slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    },

    totalPages() {
      const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : ''; // ป้องกัน undefined
      return Math.ceil(
        this.filteredOrdersWithoutHappy.filter(order => {
          const customerName = this.getCustomerName(order.user_id) || ''; // ป้องกัน undefined
          const matchesSearch = searchQuery === '' || customerName.toLowerCase().includes(searchQuery);
          const matchesPromotionType = !Array.isArray(this.selectedOrder) || this.selectedOrder.length === 0 || this.selectedOrder.includes(order.menu_type_id);
          return matchesSearch && matchesPromotionType;
        }).length / this.itemsPerPage
      );
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
    menuLabel() {
      return (menu) => `${menu.name_thai} (${menu.name_english || null})`;
    },

  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
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

    // sortDateColumn(header) {
    //   if (header === 'Transaction Date') {
    //     // สลับทิศทางการเรียงลำดับเมื่อคลิก
    //     this.sortDateDirection = this.sortDateDirection === 'asc' ? 'desc' : 'asc';

    //     // กำหนดไอคอนให้เหมาะสมกับทิศทางการเรียงลำดับ
    //     this.sortIcon = this.sortDateDirection === 'asc' ? 'arrow_downward' : 'arrow_upward';

    //     // เรียงลำดับข้อมูลตามวันที่ชำระเงิน
    //     this.filteredOrders.sort((a, b) => {
    //       const dateA = new Date(a.paid_date);
    //       const dateB = new Date(b.paid_date);

    //       return this.sortDateDirection === 'asc'
    //         ? dateA - dateB
    //         : dateB - dateA;
    //     });
    //   }
    // },

    async fetchOrders(startDate, endDate) {
      this.isLoading = true;

      try {
        const response = await axios.get(`${API_URL}/orders/date-range`, {
          params: { start_date: startDate, end_date: endDate }, // ส่งค่าพารามิเตอร์ start_date และ end_date
        });

        this.orders = response.data.orders;
        this.filteredOrders = this.orders;

        this.orders.sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);

          if (dateA.getTime() === dateB.getTime()) {
            return a.id - b.id;
          }

          return dateA - dateB;
        });



      } catch (error) {
        // console.error('Error fetching orders data:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchLookupData() {
      try {
        const [customersRes, menuRes, menuTypeRes, mealTypeRes] = await Promise.all([
          axios.get(`${API_URL}/customers`),
          axios.get(`${API_URL}/menus`),
          axios.get(`${API_URL}/menu-types`),
          axios.get(`${API_URL}/meal-types`),
        ]);
        this.customers = customersRes.data;
        this.menus = menuRes.data;
        this.menu_types = menuTypeRes.data;
        this.meal_types = mealTypeRes.data;

      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },

    search() {
      this.currentPage = 1;
    },
    clearSearch() {
      this.searchQuery = "";
      this.currentPage = 1;
    },

    getCustomerName(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.name : null;
    },
    getFilteredMealType(selectedMenuType) {
      if (selectedMenuType) {
        return this.meal_types.filter(
          (menu) => menu.menu_type_id === selectedMenuType.id
        );
      }
      return this.meal_types.filter((menu) => {
        const mealType = this.meal_types.find(
          (item) => item.id === menu.menu_type_id
        );
        return mealType && mealType.menuType.id === 1;
      });
    },
    getFilteredMenus(selectedMealType) {
      if (selectedMealType) {
        return this.menus.filter(
          (menu) => menu.meal_type_id === selectedMealType.id
        );
      }
      return this.menus.filter((menu) => {
        const mealType = this.meal_types.find(
          (item) => item.id === menu.meal_type_id
        );
        return mealType && mealType.menuType.id === 1;
      });
    },
    getMenuName(menuId) {
      const menu = this.menus.find((c) => c.id === menuId);
      return menu ? menu.name_thai : null;
    },
    getMenuEngName(menuId) {
      const menu = this.menus.find((c) => c.id === menuId);
      return menu ? menu.name_english : null;
    },
    getMenuTypeName(menuId) {
      const menu = this.menu_types.find((c) => c.id === menuId);
      return menu ? menu.name : null;
    },
    getStatusText(status) {
      return status === "confirm" ? "ยืนยันการสั่งแล้ว" : "ยังไม่ได้ยืนยันการสั่ง";
    },
    getStatusClass(status) {
      return status === "confirm"
        ? "text-white bg-green-500"
        : "text-white bg-red-500";
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

    shouldDisplayUserName(index, customerId) {
      return index === 0 || this.filteredOrders[index - 1].customer_id !== customerId;
    },
    getRowspan(customerId, index) {
      let count = 0;
      for (let i = index; i < this.filteredOrders.length; i++) {
        if (this.filteredOrders[i].customer_id === customerId) {
          count++;
        } else {
          break;
        }
      }
      return count;
    },

    shouldDisplayOrderDate(index, orderDate) {
      return index === 0 || this.filteredOrders[index - 1].order_date !== orderDate;
    },
    getOrderDateRowspan(orderDate, index) {
      let count = 0;
      for (let i = index; i < this.filteredOrders.length; i++) {
        if (this.filteredOrders[i].order_date === orderDate) {
          count++;
        } else {
          break;
        }
      }
      return count;
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

    openConfirmSatatusModal(saleRecord) {
      this.selectedOrder = saleRecord;
      this.isConfirmStatusModalOpen = true;
    },
    closeConfirmStatusModal() {
      this.isConfirmStatusModalOpen = false;
      // this.selectedOrder = null;
      this.selectedPaidDate = "";
    },
    async confirmStatus() {
      try {
        const newStatus = this.selectedOrder.status === "confirm" ? "pending" : "confirm";

        const payload = {
          status: newStatus,
        };

        // ส่งคำขอ PUT ไปยังเซิร์ฟเวอร์
        const response = await axios.put(
          `${API_URL}/order/${this.selectedOrder.id}/status`, // URL ที่จะอัปเดตสถานะคำสั่งซื้อ
          payload // ส่งข้อมูลสถานะใหม่
        );
        await this.fetchOrders(); // ดึงข้อมูลคำสั่งซื้อทั้งหมดใหม่

        if (response.status === 200) {
          const updatedOrder = response.data.data;

          // ค้นหาคำสั่งซื้อที่มี ID ตรงกับคำสั่งที่อัปเดต
          const index = this.orders.findIndex(
            (record) => record.id === updatedOrder.id
          );

          if (index !== -1) {
            this.orders[index] = updatedOrder;
          }

          this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        // แสดงข้อผิดพลาดหากมีการเกิดข้อผิดพลาดในระหว่างการอัปเดต
        console.error(
          "Error response data:",
          error.response?.data || "No additional data"
        );
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
      }

      // ปิด modal หลังจากอัปเดตสถานะเสร็จ
      this.closeConfirmStatusModal();
    },

    async confirmMultipleOrders() {
      if (this.selectedOrders.length === 0) return;
      const orderIds = this.selectedOrders.map(order => order.id);
      // console.log("Selected Orders:", this.selectedOrders);

      try {
        const response = await fetch(`${API_URL}/order/update-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_ids: orderIds,
            status: "confirm",
          }),
        });
        await response.json();

        if (response.ok) {
          this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
          this.selectedOrders = [];
          await this.fetchOrders(this.startDate, this.endDate);
        } else {
          this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
        }
      } catch (error) {
        console.error("Error:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการเชื่อมต่อ!");
      }
    },
    async pendingMultipleOrders() {
      if (this.selectedOrders.length === 0) return;
      const orderIds = this.selectedOrders.map(order => order.id);

      try {
        const response = await fetch(`${API_URL}/order/update-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_ids: orderIds,
            status: "pending",
          }),
        });
        await response.json();

        if (response.ok) {
          this.showSuccessToastNotification("อัปเดตสถานะสำเร็จ!");
          this.selectedOrders = [];
          await this.fetchOrders(this.startDate, this.endDate);
        } else {
          this.showErrorToastNotification("เกิดข้อผิดพลาดในการอัปเดตสถานะ!");
        }
      } catch (error) {
        console.error("Error:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการเชื่อมต่อ!");
      }
    },

    selectCustomerOrders(customerId) {
      const customerOrders = this.filteredOrdersWithoutHappy.filter(order => order.customer_id === customerId);
      const isSelected = customerOrders.every(order => this.selectedOrders.includes(order));

      if (isSelected) {
        this.selectedOrders = this.selectedOrders.filter(order => !customerOrders.includes(order));
      } else {
        this.selectedOrders = [...this.selectedOrders, ...customerOrders];
      }
    },

    selectOrder(order) {
      if (!this.selectedOrders.includes(order)) {
        this.selectedOrders.push(order);
      } else {
        this.selectedOrders = this.selectedOrders.filter(item => item.id !== order.id);
      }
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedOrders = [...this.filteredOrdersWithoutHappy];  // เลือกคำสั่งซื้อทั้งหมด
      } else {
        this.selectedOrders = [];  // ยกเลิกการเลือกทั้งหมด
      }
      this.isAllSelected = event.target.checked;
    },

    toggleFiltterDropdown() {
      this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    },
    applyFilter() {
      if (this.selectedOrder.length > 0) {
        this.filteredOrders = this.menu_types.filter(packageType =>
          this.selectedOrder.includes(packageType.menu_type_id)
        );
      } else {
        this.filteredOrders = this.orders;
      }
      this.isFilterDropdownOpen = false;
    },
    clearFilter() {
      this.selectedOrder = [];
      this.filteredOrders = this.orders;
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

      this.orders.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        if (aValue < bValue) return -this.sortDirection[column];
        if (aValue > bValue) return this.sortDirection[column];
        return 0;
      });

      this.currentPage = 1;
    },
    clearSort() {
      this.sortColumn = 'id';
      this.sortDirection.id = 1;
      this.orders.sort((a, b) => {
        const dateA = new Date(a.order_date);
        const dateB = new Date(b.order_date);
        return dateA - dateB; // เรียงจากน้อยไปหามาก
      });
      this.currentPage = 1;
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

    startEditing(Order) {
      this.isEditing = true;
      this.editingOrderId = Order.id;
    },

    saveUpdatedQuantity(Order) {
      this.updateQuantity(Order);
      this.isEditing = false;
      this.editingOrderId = null;
    },

    cancelEditing() {
      this.fetchOrders(this.startDate, this.endDate);
      this.isEditing = false;
      this.editingOrderId = null;
    },

    increaseQuantity(order) {
      order.quantity += 1;
    },
    decreaseQuantity(order) {
      if (order.quantity > 0) {
        order.quantity -= 1;
      }
    },

    async updateQuantity(Order) {
      try {
        await axios.put(`${API_URL}/orders/${Order.id}`, {
          quantity: Order.quantity || 0,
        });

        await this.fetchOrders();
        this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการแก้ไข!");
      }
    },

    confirmDelete(itemId) {
      this.itemToDelete = itemId;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.itemToDelete = null;
    },
    async deleteConfirmed() {
      try {
        await axios.delete(`${API_URL}/orders/${this.itemToDelete}`);
        this.orders = this.orders.filter(
          (item) => item.id !== this.itemToDelete
        );
        this.closeDeleteModal();
        await this.fetchOrders();
        this.showFailToastNotification("ลบข้อมูลสำเร็จ!");
      } catch (error) {
        // console.error("Error deleting item:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการลบข้อมูล!");
      }
    },

    getPackageStatusText(status) {
      return status === "calculate" ? "ตัดแพ็คเกจ" : "ไม่ตัดแพ็คเกจ";
    },

    openAddModal() {
      this.isAddModalOpen = true;
    },
    closeAddModal() {
      this.isAddModalOpen = false;
      this.resetNewOrder();
    },
    resetNewOrder() {
      this.newOrder = {
        menu_id: null,
        quantity: 0,
        order_date: "",
        customer_id: null,
        package_status: "calculate",
      };
      this.selectedMealType = null;
      this.selectedMenuType = null;
    },
    async addOrder() {
      if (!this.newOrder.customer_id || !this.newOrder.menu_id) {
        this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบ!");
        return;
      }
      if (!this.newOrder.order_date) {
        this.showErrorToastNotification("กรุณาเลือกวันที่สั่งรายการอาหาร!");
        return;
      }
      try {
        const response = await axios.post(`${API_URL}/orders-add`, {
          menu_id: this.newOrder.menu_id.id,
          quantity: this.newOrder.quantity,
          order_date: this.newOrder.order_date,
          customer_id: this.newOrder.customer_id.id,
          package_status: this.newOrder.package_status
        });
        this.orders.push(response.data);
        this.closeAddModal();
        await this.fetchOrders(this.startDate, this.endDate);
        this.showSuccessToastNotification("เพิ่มข้อมูลสำเร็จ!");
      } catch (error) {
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
      }
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
  created() {
    this.filteredOrders = this.orders;
    this.sortData('id');
    this.fetchLookupData();
    this.fetchOrders(this.selectedDate);
    // this.updatePage();
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.fetchLookupData();
    this.fetchOrders(this.selectedDate);
    this.setToday();

    this.$nextTick(() => {
      flatpickr(this.$refs.startDatepicker, {
        dateFormat: "Y-m-d",
        todayButton: true,
        defaultDate: new Date(),
        onChange: (selectedDates, dateStr) => {
          this.startDate = dateStr;
          this.fetchOrdersData();
        }
      });

      flatpickr(this.$refs.endDatepicker, {
        dateFormat: "Y-m-d",
        todayButton: true,
        defaultDate: new Date(),
        onChange: (selectedDates, dateStr) => {
          this.endDate = dateStr;
          this.fetchOrdersData();
        }
      });
    });


  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  watch: {
    // คอยติดตามการเปลี่ยนแปลงของ selectedOrders
    selectedOrders() {
      this.isAllSelected = this.selectedOrders.length === this.filteredOrders.length;
    },
  }
};
</script>

<style scoped>
.input-no-spinner::-webkit-outer-spin-button,
.input-no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.spinner-border {
  border-top-color: #FFB539;
  /* เปลี่ยนสีของเส้นด้านบน */
}
</style>