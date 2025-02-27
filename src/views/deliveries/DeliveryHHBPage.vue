<template>
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

  <div class="mt-[-20px]">
    <div class="flex space-x-2 items-center relative">
      <div class="mt-4 px-4 flex items-center space-x-1 mr-auto">
        <span class="material-symbols-outlined text-2xl text-gray-700">delivery_truck_speed</span>
        <span class="text-m text-gray-700">จำนวนการจัดส่งอาหารทั้งหมด: </span>
        <span class="text-m text-custom-orange font-bold">
          {{ filteredSaleRecordsPaid.length }} รายการ</span>
      </div>

      <button v-if="selectedPackageType.length > 0" @click="clearFilter"
        class="px-2 py-2 rounded-md flex items-center space-x-1 text-gray-400 hover:text-custom-orange">
        <span class="material-symbols-outlined">close</span>
        <span class="ml-2">
          รีเซ็ตตัวกรอง
          <template v-if="selectedPackageType.length > 0">
            ({{ selectedPackageType.length }})
          </template>
        </span>
      </button>

      <button @click="handlePrint"
        class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
        <span class="material-symbols-outlined text-white text-xl leading-none">print</span>
        <span class="text-white text-base leading-none">Print</span>
      </button>

      <div class="sort relative inline-block" ref="sortDropdown">
        <button @click="toggleSortDropdown"
          class="bg-custom-orange text-white px-2 py-2 rounded-md flex items-center space-x-1 hover:bg-custom-orange-hover">
          <span class="material-symbols-outlined text-white text-xl leading-none">sort</span>
          <span class="text-white text-base leading-none">จัดเรียง</span>
          <span :class="{ 'rotate-180': isSortDropdownOpen }"
            class="material-symbols-outlined text-white text-xl leading-none items-right ml-auto duration-300">arrow_drop_down</span>
        </button>

        <div v-if="isSortDropdownOpen"
          class="absolute left-0 top-full mt-1 bg-white text-black text-left shadow-lg rounded-md w-48 z-50 border border-gray-300">
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
            <li @click="sortData('name')"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
              <span>จัดเรียงตามชื่อลูกค้า</span>
              <span v-if="sortColumn === 'name'" class="material-symbols-outlined text-sm">
                {{
                  sortDirection["name"] === 1
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

      <!-- <div class="filter relative inline-block" ref="filterDropdown">
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
              <label v-for="type in filteredPackageTypes" :key="type.id" class="flex items-center space-x-2">
                <input type="checkbox" v-model="selectedPackageType" :value="type.id"
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
      </div> -->

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
        <tr class="bg-custom-orange text-white text-sm">
          <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
            :style="{ width: headerWidths[index] }">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="filteredSaleRecordsPaid.length > 0">
          <tr v-for="(saleRecord, index) in filteredSaleRecords" :key="index"
            class="bg-white relative border-b border-b-gray-200">
            <td class="px-4 py-2 align-top pb-5">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="px-4 py-2 align-top pb-5 font-bold text-custom-orange">{{ getCustomerName(saleRecord.customer_id)
            }}</td>
            <td class="px-4 py-2 align-top pb-5">
              <div class="flex items-center">
                <span class="material-symbols-outlined mr-1 text-xl">phone</span>{{
                  getCustomerTel(saleRecord.customer_id) }}
              </div>
            </td>

            <td class="px-4 py-2 align-top pb-5">
              <textarea v-if="isEditing && editingSaleRecordId === saleRecord.id" v-model="saleRecord.delivery_round"
                class="border px-2 py-1 rounded w-full h-24"></textarea>
              <span v-else>{{ saleRecord.delivery_round }}</span>
            </td>
            <td class="px-4 py-2 align-top pb-5">
              <textarea v-if="isEditing && editingSaleRecordId === saleRecord.id" v-model="saleRecord.deliver"
                class="border px-2 py-1 rounded w-full h-24"></textarea>
              <span v-else>{{ saleRecord.deliver }}</span>
            </td>
            <td class="px-4 py-2 align-top pb-5">
              <textarea v-if="isEditing && editingSaleRecordId === saleRecord.id" v-model="saleRecord.delivery_zone"
                class="border px-2 py-1 rounded w-full h-24"></textarea>
              <span v-else>{{ saleRecord.delivery_zone }}</span>
            </td>


            <td class="px-4 py-2 align-top pb-5"> {{ getCustomerAddress1(saleRecord.customer_id) }}</td>
            <td class="px-4 py-2 align-top pb-5"> {{ getCustomerAddress2(saleRecord.customer_id) }}</td>
            <td class="px-4 py-2 align-top pb-5"> {{ getCustomerAddress3(saleRecord.customer_id) }}</td>


            <td class="px-4 py-2 text-right pb-5 relative" ref="moreDropdown">
              <div class="flex justify-end space-x-2">
                <button v-if="!isEditing || editingSaleRecordId !== saleRecord.id" @click="startEditing(saleRecord)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
                  <span class="material-symbols-outlined">edit_square</span>
                  <span>แก้ไข</span>
                </button>

                <button v-if="isEditing && editingSaleRecordId === saleRecord.id"
                  @click="saveUpdatedDelivery(saleRecord)"
                  class="bg-custom-orange text-white px-2 py-1 rounded hover:bg-custom-orange-hover flex items-center space-x-1">
                  <span class="material-symbols-outlined">check</span>
                  <span>บันทึก</span>
                </button>

                <button v-if="isEditing && editingSaleRecordId === saleRecord.id" @click="cancelEditing"
                  class="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 flex items-center space-x-1">
                  <span class="material-symbols-outlined">close</span>
                  <span>ยกเลิก</span>
                </button>
              </div>
            </td>
          </tr>
        </template>

        <template v-if="filteredSaleRecordsPaid.length < 6 && filteredSaleRecordsPaid.length > 0">
          <tr v-for="emptyIndex in (6 - filteredSaleRecordsPaid.length)" :key="'empty-' + emptyIndex"
            class="bg-white">
            <td colspan="10" class="py-16"></td>
          </tr>
        </template>

        <template v-if="filteredSaleRecordsPaid.length === 0">
          <tr>
            <td colspan="10" class="py-10 bg-white text-center text-gray-500 font-bold">
              ไม่พบข้อมูล
            </td>
          </tr>
        </template>
      </tbody>

      <div v-if="isDetailModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div class="bg-white rounded-md shadow-lg w-1/2 max-w-6xl h-auto max-h-[800px] flex flex-col">
          <div class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md">
            <span class="font-bold">รายละเอียดบันทึกการขาย</span>
            <div class="flex space-x-2">
              <span @click="closeDetailModal" class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                close
              </span>
            </div>
          </div>

          <div class="pb-2 pt-2 overflow-y-auto flex-grow" ref="modalContent">
            <div v-for="(value, key, index) in filteredDetailSaleRecord" :key="key" :class="[
              'p-2 rounded-md',
              index % 2 === 0 ? 'bg-white rounded-none' : 'bg-gray-100 rounded-none'  // สลับสีบรรทัด
            ]">
              <div v-if="key === 'zone1_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone1_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone1_id)) }}
                </div>
              </div>

              <div v-else-if="key === 'zone2_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone2_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone2_id)) }}
                </div>
              </div>

              <div v-else-if="key === 'zone3_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone3_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone3_id)) }}
                </div>
              </div>

              <div v-else-if="key === 'zone_outsource_id'" class="flex items-center space-x-4 pl-3 pr-3">
                <div class="flex-1">
                  <strong class="mr-2">{{ formatDetailLabel(key) }}:</strong>
                  {{ value }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">จำนวนครั้ง:</strong>
                  {{ this.selectedSaleRecord.zone_outsource_quantity }}
                </div>
                <div class="flex-1">
                  <strong class="font-bold mr-2">ค่าจัดส่ง/ครั้ง:</strong>
                  {{ formatPrice(getZonePrice(selectedSaleRecord.zone_outsource_id)) }}
                </div>
              </div>

              <template v-else>
                <strong class="mr-2 pl-3 pr-3">{{ formatDetailLabel(key) }}:</strong> {{ value }}
              </template>
            </div>
          </div>

        </div>
      </div>

      <div v-if="isEditModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div
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
            <span class="font-bold">แก้ไขบันทึกการขาย</span>
            <div class="flex space-x-2">
              <span @click="closeEditModal" class="material-symbols-outlined cursor-pointer hover:text-gray-200">
                close
              </span>
            </div>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto flex-grow">
            <div>
              <label for="editCustomer" class="block font-bold text-gray-700">ลูกค้า</label>
              <multiselect v-model="selectedSaleRecord.customer_id" :options="customers" placeholder="เลือกลูกค้า"
                track-by="id" label="name" class="w-full" />
            </div>

            <div>
              <label for="editPackageType" class="block font-bold text-gray-700">Package Type</label>
              <multiselect v-model="selectedSaleRecord.package_type_id" :options="filteredPackageTypes"
                placeholder="เลือก Package Type" track-by="id" label="name" class="w-full" />
            </div>



            <div>
              <label for="promotion_type" class="block font-bold text-gray-700">Promotion Type</label>
              <multiselect v-model="selectedSaleRecord.promotion_type_id" :options="promotionTypes"
                placeholder="เลือก Promotion Type" track-by="id" label="name" />
            </div>

            <div>
              <label for="program" class="block font-bold text-gray-700">Program</label>
              <multiselect v-model="selectedSaleRecord.program_id" :options="filteredPrograms"
                placeholder="เลือก Program" track-by="id" label="name" :disabled="!selectedSaleRecord.promotion_type_id ||
                  !selectedSaleRecord.promotion_type_id.id" />
            </div>

            <div>
              <label for="package" class="block font-bold text-gray-700">Package</label>
              <multiselect v-model="selectedSaleRecord.package_id" :options="packages" placeholder="เลือก Package"
                track-by="id" label="displayLabel" :disabled="!selectedSaleRecord.program_id || !selectedSaleRecord.program_id.id
                  " />

              <button v-if="selectedSaleRecord.package_id && selectedSaleRecord.package_id.id"
                @click.prevent="togglePackageDetails(selectedSaleRecord.package_id)"
                class="mt-2 cursor-pointer text-custom-orange text-left hover:underline">
                {{
                  isShowingPackageDetails
                    ? "ปิดรายละเอียด"
                    : "ดูรายละเอียดแพ็คเกจ"
                }}
              </button>

              <div v-if="packageDetails" class="mt-4 p-4 border border-custom-orange rounded-md">
                <h3 class="font-bold">รายละเอียดแพ็คเกจ</h3>
                <p>
                  <strong>Package:</strong> {{ packageDetails.name }}
                </p>
                <p><strong>ราคา:</strong> {{ formatPrice(packageDetails.price) }}</p>
                <p>
                  <strong>Package Details for Purchase Summary:</strong>
                  {{ packageDetails.package_detail }}
                </p>
                <p>
                  <strong>Package Validity:</strong>
                  {{ packageDetails.package_validity }} วัน
                </p>
                <p>
                  <strong>Total Days:</strong>
                  {{ packageDetails.total_days }} วัน
                </p>
                <p>
                  <strong># of Boxes/Day:</strong>
                  {{ packageDetails.boxes_per_day }} กล่อง
                </p>
                <p>
                  <strong>Total Boxes:</strong>
                  {{ packageDetails.total_boxes }} กล่อง
                </p>
                <p>
                  <strong>รายละเอียดโปรโมชัน:</strong>
                  {{ packageDetails.promotion_detail }}
                </p>


                <div class="flex flex-wrap">
                  <div class="md:w-1/2 lg:w-1/4">

                    <p>
                      <strong>M or A or D:</strong>
                      {{ packageDetails.free_mad }}
                    </p>
                  </div>
                  <div class="md:w-1/2 lg:w-1/4">
                    <p>
                      <strong>Dessert:</strong>
                      {{ packageDetails.free_dessert }}
                    </p>
                  </div>
                  <div class="md:w-1/2 lg:w-1/4">

                    <p>
                      <strong>Brittles:</strong>
                      {{ packageDetails.free_brittles }}
                    </p>
                  </div>
                  <div class="md:w-1/2 lg:w-1/4">
                    <p>
                      <strong>Energy Balls:</strong>
                      {{ packageDetails.free_energy_balls }}
                    </p>
                  </div>
                  <div class="md:w-1/2 lg:w-1/4">
                    <p>
                      <strong>Dressing:</strong>
                      {{ packageDetails.free_dressing }}
                    </p>
                  </div>
                  <div class="md:w-1/2 lg:w-1/4">
                    <p>
                      <strong>Yoghurt:</strong>
                      {{ packageDetails.free_yoghurt }}
                    </p>
                  </div>
                  <div class="md:w-1/2 lg:w-1/4">
                    <p>
                      <strong>Granola:</strong>
                      {{ packageDetails.free_granola }}
                    </p>
                  </div>
                  <div class="md:w-1/2 lg:w-1/4">
                    <p>
                      <strong>เครดิตที่แถม (บาท):</strong>
                      {{ packageDetails.free_credit }}
                    </p>
                  </div>
                </div>


              </div>
            </div>

            <div>
              <label for="other_promotion_detail" class="block text-gray-700 font-bold">รายละเอียดโปรโมชันเพิ่มเติม
                (นอกเหนือจากโปรฯ รายเดือนที่ต้องได้รับอนุมัติ)</label>
              <textarea id="other_promotion_detail" v-model="selectedSaleRecord.other_promotion_detail"
                placeholder="กรอกรายละเอียดโปรโมชันเพิ่มเติม" rows="3"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
            </div>

            <div class="space-y-4 overflow-y-auto flex-grow mt-4">
              <strong class="text-custom-orange text-lg">จำนวนที่แถม</strong>
              <div class="flex flex-wrap gap-4">
                <!-- Free Mad -->
                <div class="flex-1">
                  <label for="freeMad" class="block font-bold text-gray-700">Main Dish</label>
                  <input id="freeMad" v-model="selectedSaleRecord.free_mad" type="number" min="0" step="1"
                    placeholder="กรอกจำนวน Main Dish"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>

                <!-- Free Dessert -->
                <div class="flex-1">
                  <label for="freeDessert" class="block font-bold text-gray-700">Dessert</label>
                  <input id="freeDessert" v-model="selectedSaleRecord.free_dessert" type="number" min="0" step="1"
                    placeholder="กรอกจำนวน Dessert"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>

                <!-- Free Brittles -->
                <div class="flex-1">
                  <label for="freeBrittles" class="block font-bold text-gray-700">Brittles</label>
                  <input id="freeBrittles" v-model="selectedSaleRecord.free_brittles" type="number" min="0" step="1"
                    placeholder="กรอกจำนวน Brittles"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>

                <!-- Free Energy Balls -->
                <div class="flex-1">
                  <label for="freeEnergyBalls" class="block font-bold text-gray-700">Energy
                    Balls</label>
                  <input id="freeEnergyBalls" v-model="selectedSaleRecord.free_energy_balls" type="number" min="0"
                    step="1" placeholder="กรอกจำนวน Energy Balls"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>
              </div>

              <div class="flex flex-wrap gap-4">
                <!-- Free Dressing -->
                <div class="flex-1">
                  <label for="freeDressing" class="block font-bold text-gray-700">Free
                    Dressing</label>
                  <input id="freeDressing" v-model="selectedSaleRecord.free_dressing" type="number" min="0" step="1"
                    placeholder="กรอกจำนวน Free Dressing"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>

                <!-- Free Yoghurt -->
                <div class="flex-1">
                  <label for="freeYoghurt" class="block font-bold text-gray-700">Yoghurt</label>
                  <input id="freeYoghurt" v-model="selectedSaleRecord.free_yoghurt" type="number" min="0" step="1"
                    placeholder="กรอกจำนวน Yoghurt"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>

                <!-- Free Granola -->
                <div class="flex-1">
                  <label for="freeGranola" class="block font-bold text-gray-700">Granola</label>
                  <input id="freeGranola" v-model="selectedSaleRecord.free_granola" type="number" min="0" step="1"
                    placeholder="กรอกจำนวน Granola"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>

                <div class="flex-1">
                  <label for="freeCredit" class="block font-bold text-gray-700">เครดิตที่แถม (บาท)</label>
                  <input id="freeCredit" v-model="selectedSaleRecord.free_credit" type="number" min="0" step="1"
                    placeholder="กรอกเครดิตที่แถม (บาท)"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>
              </div>
            </div>

            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="editDiscount" class="block font-bold text-gray-700">Discount</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-4 flex items-center text-gray-500">฿</span>
                  <input v-model="selectedSaleRecord.discount" id="discount" type="number" step="1"
                    placeholder="กรอก Discount"
                    class="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
                </div>
              </div>

              <div class="flex-1">
                <label for="editExtraCharge" class="block font-bold text-gray-700">Extra Charge (%)</label>
                <div class="relative">
                  <input v-model="selectedSaleRecord.extra_charge" id="extraCharge" type="number" step="1" min="0"
                    placeholder="กรอก Extra Charge (%)"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange pr-12" />
                  <span class="absolute inset-y-0 right-4 flex items-center text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div v-if="computedEditTotalPackagePrice > 0">
              <div class="flex-1">
                <label class="block font-bold text-gray-700">
                  มูลค่าแพ็กเกจรวม: {{ formatPrice(computedEditTotalPackagePrice) }}
                </label>
                <p class="text-gray-600">ราคาแพ็กเกจ: {{ formatPrice(selectedSaleRecord.package_price) }}</p>
                <p class="text-gray-600">ส่วนลดเพิ่มเติม: {{ formatPrice(selectedSaleRecord.discount) }}</p>
                <p class="text-gray-600">มูลค่า Extra Charge: {{ formatPrice(computedEditExtraChargePackagePrice) }}</p>
              </div>
            </div>

            <div>
              <label for="editReceiveFood" class="block font-bold text-gray-700">วิธีการรับอาหาร</label>
              <multiselect v-model="selectedSaleRecord.receive_food_id" :options="receiveFoods"
                placeholder="เลือกวิธีการรับอาหาร" track-by="id" label="name" />
            </div>

            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="editZone1_delivery" class="block font-bold text-gray-700">In-house Riders (ที่อยู่
                  1)</label>
                <multiselect v-model="selectedSaleRecord.zone1_id" :options="filteredInhouse"
                  placeholder="เลือก In-house Riders (ที่อยู่ 1)" track-by="id" label="name" />
              </div>

              <div class="flex-1">
                <label for="editZone1_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                <input v-model="selectedSaleRecord.zone1_quantity" id="zone1_quantity" type="number" step="1"
                  placeholder="กรอกจำนวนครั้ง"
                  class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
              </div>
            </div>
            <div v-if="computedEditZone1Price > 0" class="flex-1">
              <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 1): {{
                formatPrice(computedEditZone1Price)
              }}</label>
              <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{ formatPrice(getZonePrice(selectedSaleRecord.zone1_id.id)) }}
              </p>
            </div>

            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="editZone2_delivery" class="block font-bold text-gray-700">In-house Riders (ที่อยู่
                  2)</label>
                <multiselect v-model="selectedSaleRecord.zone2_id" :options="filteredInhouse"
                  placeholder="เลือก In-house Riders (ที่อยู่ 2)" track-by="id" label="name" />
              </div>

              <div class="flex-1">
                <label for="editZone2_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                <input v-model="selectedSaleRecord.zone2_quantity" id="zone2_quantity" type="number" step="1"
                  placeholder="กรอกจำนวนครั้ง"
                  class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
              </div>
            </div>
            <div v-if="computedEditZone2Price > 0" class="flex-2">
              <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 2): {{
                formatPrice(computedEditZone2Price)
              }}</label>
              <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{ formatPrice(getZonePrice(selectedSaleRecord.zone2_id.id)) }}
              </p>
            </div>

            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="editZone3_delivery" class="block font-bold text-gray-700">In-house Riders (ที่อยู่
                  3)</label>
                <multiselect v-model="selectedSaleRecord.zone3_id" :options="filteredInhouse"
                  placeholder="เลือก In-house Riders (ที่อยู่ 3)" track-by="id" label="name" />
              </div>

              <div class="flex-1">
                <label for="editZone3_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                <input v-model="selectedSaleRecord.zone3_quantity" id="zone3_quantity" type="number" step="1"
                  placeholder="กรอกจำนวนครั้ง"
                  class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
              </div>
            </div>
            <div v-if="computedEditZone3Price > 0" class="flex-1">
              <label class="block font-bold text-gray-700">ค่าจัดส่งรวม (ที่อยู่ 3): {{
                formatPrice(computedEditZone3Price)
              }}</label>
              <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{ formatPrice(getZonePrice(selectedSaleRecord.zone3_id.id)) }}
              </p>
            </div>

            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="editZone_outsource_delivery" class="block font-bold text-gray-700">Outsource Riders</label>
                <multiselect v-model="selectedSaleRecord.zone_outsource_id" :options="filteredOutsource"
                  placeholder="เลือก Outsource Riders" track-by="id" label="name" />
              </div>

              <div class="flex-1">
                <label for="editZone_outsource_quantity" class="block font-bold text-gray-700">จำนวนครั้ง</label>
                <input v-model="selectedSaleRecord.zone_outsource_quantity" id="zone_outsource_quantity" type="number"
                  step="1" placeholder="กรอกจำนวนครั้ง"
                  class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
              </div>
            </div>
            <div v-if="computedEditZoneOutsourcePrice > 0" class="flex-1">
              <label class="block font-bold text-gray-700">ค่าจัดส่งรวม Outsource: {{
                formatPrice(computedEditZoneOutsourcePrice)
              }}</label>
              <p class="text-gray-600">ค่าจัดส่ง/ครั้ง: {{
                formatPrice(getZonePrice(selectedSaleRecord.zone_outsource_id.id)) }}</p>
            </div>


            <div v-if="computedEditTotalDeliveryPrice > 0" class="flex-1">
              <label class="block font-bold text-gray-700">รวมค่าจัดส่งทั้งหมด: {{
                formatPrice(computedEditTotalDeliveryPrice) }}</label>
              <p class="text-gray-600">ค่าจัดส่งรวม In-house Riders: {{ formatPrice(computedEditTotalZonePrice) }}</p>
              <p class="text-gray-600">ค่าจัดส่งรวม Outsource: {{
                formatPrice(computedEditZoneOutsourcePrice) }}</p>
            </div>

            <div v-if="computedEditTotalPrice > 0" class="flex-1">
              <label class="block font-bold text-custom-orange">มูลค่าขายรวม: {{
                formatPrice(computedEditTotalPrice) }}</label>

              <div>
                <p class="text-gray-600">มูลค่าแพ็กเกจรวม: {{
                  formatPrice(computedEditTotalPackagePrice) }}</p>
              </div>

              <p class="text-gray-600">รวมค่าจัดส่งทั้งหมด: {{ formatPrice(computedEditTotalDeliveryPrice) }}</p>
            </div>

            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="editSellerName" class="block font-bold text-gray-700">ผู้ขาย</label>
                <multiselect v-model="selectedSaleRecord.seller_name_id" :options="sellerNames"
                  placeholder="เลือกผู้ขาย" track-by="id" label="name" />
              </div>

              <div class="flex-1">
                <label for="editStartDate" class="block font-bold text-gray-700">วันเริ่มแพ็คเกจ</label>
                <input v-model="selectedSaleRecord.start_date" id="startDate" type="date"
                  class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange" />
              </div>
            </div>

            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="editDeliveryRound" class="block font-bold text-gray-700">รอบการจัดส่งอาหาร</label>
                <multiselect v-model="selectedSaleRecord.delivery_round_id" :options="deliveryRounds"
                  placeholder="เลือกรอบการจัดส่งอาหาร" track-by="id" label="name" />
              </div>

              <div class="flex-1">
                <label for="editSelectFood" class="block font-bold text-gray-700">เลือกอาหารโดย</label>
                <multiselect v-model="selectedSaleRecord.select_food_id" :options="selectFoods"
                  placeholder="เลือกอาหารโดย" track-by="id" label="name" />
              </div>
            </div>

            <div class="mb-4">
              <label for="editNote" class="block text-gray-700 font-bold">Note รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า
                (ถ้ามี)</label>
              <textarea id="note" v-model="selectedSaleRecord.note"
                placeholder="กรอก Note รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า (ถ้ามี)" rows="3"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-custom-orange resize-y"></textarea>
            </div>
          </div>


          <!-- Footer (with buttons) -->
          <div class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none">
            <div class="flex space-x-2">
              <button @click="closeEditModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                ยกเลิก
              </button>
              <button @click="saveChanges"
                class="px-4 py-2 rounded bg-custom-orange text-white hover:bg-custom-orange-hover">
                บันทึก
              </button>
            </div>
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

        <button v-for="page in totalPagesArray.range" :key="page" @click="goToPage(page)" :class="[
          'px-3 py-2 rounded-md',
          {
            'bg-custom-orange text-white': currentPage === page,
            'bg-white': currentPage !== page,
          },
        ]" class="cursor-pointer hover:bg-custom-orange hover:text-white">
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

    <div ref="componentRef" class="hidden-print p-4 relative">
      <div class="relative flex justify-between items-center ">
        <div class="flex flex-col">
          <strong class="text-xl">Delivery Report</strong>
          <span class="text-sm">Date : {{ formattedDate }}</span>
        </div>


        <div class="flex items-center space-x-4">
          <img src="@/assets/logo_fitfood_full.png" alt="Logo" class="w-48 h-18" />
        </div>
      </div>

    <table class="report-content min-w-full table-auto mt-4 p-4">
      <thead>
        <tr class="bg-gray-100 text-black text-[12px]">
          <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 20%;">ชื่อ</th>
          <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 5%;">โทรศัพท์</th>
          <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 12%;">รอบการจัดส่ง</th>
          <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 12%;">ผู้จัดส่ง</th>
          <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 12%;">โซนการจัดส่ง</th>
          <th class="px-6 py-3 text-left font-bold border-b border-b-black" style="width: 30%;">ที่อยู่</th>
        </tr>
      </thead>


      <tbody>
        <tr v-for="(saleRecord, index) in filteredSaleRecordsPaid" :key="index"
          class="bg-white border-b border-gray-300 hover:bg-gray-100">

          <td class="px-6 py-4 text-[12px]  text-black border-b border-b-gray-300">{{
            getCustomerName(saleRecord.customer_id) }}</td>
          <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">
            <div class="flex items-center">
              {{ getCustomerTel(saleRecord.customer_id) }}
            </div>
          </td>

          <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ saleRecord.delivery_round }}</td>
          <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ saleRecord.deliver }}</td>
          <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">{{ saleRecord.delivery_zone }}</td>

          <td class="px-6 py-4 text-[12px] border-b border-b-gray-300">
            <ul class="list-disc pl-4"
              v-if="getCustomerAddress1(saleRecord.customer_id) || getCustomerAddress2(saleRecord.customer_id) || getCustomerAddress3(saleRecord.customer_id)">
              <li v-if="getCustomerAddress1(saleRecord.customer_id)">{{ getCustomerAddress1(saleRecord.customer_id) }}
              </li>
              <li v-if="getCustomerAddress2(saleRecord.customer_id)">{{ getCustomerAddress2(saleRecord.customer_id) }}
              </li>
              <li v-if="getCustomerAddress3(saleRecord.customer_id)">{{ getCustomerAddress3(saleRecord.customer_id) }}
              </li>
            </ul>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import { mapActions, mapGetters } from "vuex";
import { useVueToPrint } from "vue-to-print";
import { ref } from "vue";


export default {
  setup() {
    const componentRef = ref();
    const { handlePrint } = useVueToPrint({
      content: componentRef,
      documentTitle: "Delivery Report",
    });

    return { componentRef, handlePrint };
  },
  components: {
    Multiselect,
  },
  data() {
    return {
      headers: [
        "#",
        `ชื่อ/นามสกุล (ไทย)`,
        "โทร",
        "รอบ",
        "ผู้ส่ง",
        "โซนจัดส่งตามที่อยู่ตาม Routing",
        "ที่อยู่ 1",
        "ที่อยู่ 2",
        "ที่อยู่ 3",
        "",
      ],
      headerWidths: ["5%", "10%", "5%", "10%", "10%", "10%", "12%", "12%", "12%", "5%"],
      saleRecords: [],

      searchQuery: "",
      filteredSaleRecords: [],
      selectedAddressType: {},
      saleRecord: [],
      customers: [],
      customerAddress: null,

      promotionTypes: [],
      programs: [],
      packages: [],
      packageTypes: [],
      zoneDeliveries: [],
      zoneDeliveryTypes: [],
      selectedZoneDeliveryType: "",
      sellerNames: [],
      paymentTypes: [],
      additionalTypes: [],
      deliveryRounds: [],
      receiveFoods: [],
      selectFoods: [],

      packageDetails: null,
      isShowingPackageDetails: false,

      isSortDropdownOpen: false,
      sortDirection: {
        id: 1,
        name: 1,
      },
      sortColumn: "",

      isFilterDropdownOpen: false,
      selectedPackageType: [],
      //filteredSaleRecord: [],

      isDetailModalOpen: false,
      isResultModalOpen: false,

      isDeleteModalOpen: false,
      itemToDelete: null,

      moreOpenDropdownIndex: null,

      selectedSaleRecord: [],
      isCopied: false,

      isEditModalOpen: false,

      isConfirmPaymentModalOpen: false,
      selectedPaidDate: "",
      selectedPaymentTypeId: "",
      // selectedSaleRecord: null,

      currentPage: 1,
      itemsPerPage: 10,

      toastSuccessMessage: "",
      showSuccessToast: false,
      toastFailMessage: "",
      showFailToast: false,
      showErrorToast: false,
      toastErrorMessage: "",

      isEditing: false,
      editingSaleRecordId: null,
    };
  },
  computed: {
    totalPages() {
      // ใช้ข้อมูลที่กรองแล้วใน filteredSaleRecordsPaid
      return Math.ceil(this.filteredSaleRecordsPaid.length / this.itemsPerPage);
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
    filteredResultSaleRecord() {
      if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer) {
        return { name: "", expiry_date: "" };
      }
      return {
        name: this.selectedSaleRecord.customer.name,
        package: this.selectedSaleRecord.package.package_detail,
        promotion_detail: this.selectedSaleRecord.package.promotion_detail,
        receive_food: this.totalReceiveFood,
        start_date: this.formatDate(this.selectedSaleRecord.start_date),
        sellect_by: this.getSelectFood(this.selectedSaleRecord.select_food_id),
        delivery_date: this.selectedSaleRecord.customer.delivery_date,
        delivery: this.getDeliveryRoundName(
          this.selectedSaleRecord.delivery_round_id
        ),
        package_price: this.formatPrice(this.selectedSaleRecord.package.price),
        extra_charge: this.formatPrice(this.selectedSaleRecord.extra_charge),
        discount: this.formatPrice(this.selectedSaleRecord.discount),
        total_delivery_price: this.totalDeliveryPrice,
        total_price: this.formatPrice(this.selectedSaleRecord.total_price),
        expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
        note: this.selectedSaleRecord.note,
      };
    },

    filteredDetailSaleRecord() {
      if (!this.selectedSaleRecord || !this.selectedSaleRecord.customer) {
        return { name: "", expiry_date: "" };
      }
      return {
        seller_name_id: this.getSellerName(
          this.selectedSaleRecord.seller_name_id
        ),
        name: this.selectedSaleRecord.customer?.name || "",
        package_type: this.getPackageTypeName(
          this.selectedSaleRecord.package_type_id
        ),
        // promotion_type: this.selectedSaleRecord.promotionType?.name || "",
        promotion_type: this.getPromotionTypeName(this.selectedSaleRecord.promotion_type_id) || "",
        program: this.getProgramName(this.selectedSaleRecord.program_id),
        package: this.selectedSaleRecord.package?.name || "",
        package_price: this.formatPrice(this.selectedSaleRecord.package?.price),
        promotion_detail: this.selectedSaleRecord.package?.promotion_detail || "",
        other_promotion_detail: this.selectedSaleRecord.other_promotion_detail || "",

        free_mad: this.selectedSaleRecord.free_mad,
        free_dessert: this.selectedSaleRecord.free_dessert,
        free_brittles: this.selectedSaleRecord.free_brittles,
        free_energy_balls: this.selectedSaleRecord.free_energy_balls,
        free_dressing: this.selectedSaleRecord.free_dressing,
        free_yoghurt: this.selectedSaleRecord.free_yoghurt,
        free_granola: this.selectedSaleRecord.free_granola,
        free_credit: this.selectedSaleRecord.free_credit,

        discount: this.formatPrice(this.selectedSaleRecord.discount),
        extra_charge: this.formatPercent(this.selectedSaleRecord.extra_charge),
        extra_charge_price: this.formatPrice(
          this.selectedSaleRecord.extra_charge_price
        ),
        total_package_price: this.formatPrice(
          this.selectedSaleRecord.total_package_price
        ),
        receive_food_id: this.getReceiveFoodName(
          this.selectedSaleRecord.receive_food_id
        ),
        zone1_id: this.getZoneName(this.selectedSaleRecord.zone1_id),
        total_zone1_price: this.formatPrice(
          this.selectedSaleRecord.total_zone1_price
        ),
        zone2_id: this.getZoneName(this.selectedSaleRecord.zone2_id),
        total_zone2_price: this.formatPrice(
          this.selectedSaleRecord.total_zone2_price
        ),
        zone3_id: this.getZoneName(this.selectedSaleRecord.zone3_id),
        total_zone3_price: this.formatPrice(
          this.selectedSaleRecord.total_zone3_price
        ),
        zone_outsource_id: this.getZoneName(
          this.selectedSaleRecord.zone_outsource_id
        ),
        total_zone_outsource_price: this.formatPrice(
          this.selectedSaleRecord.total_zone_outsource_price
        ),
        total_delivery_zone_price: this.formatPrice(
          this.selectedSaleRecord.total_delivery_zone_price
        ),
        total_delivery_price: this.formatPrice(
          this.selectedSaleRecord.total_delivery_price
        ),
        total_price: this.formatPrice(this.selectedSaleRecord.total_price),
        payment_status: this.getPaymentStatusText(
          this.selectedSaleRecord.payment_status
        ),
        paid_date: this.formatDate(this.selectedSaleRecord.paid_date),
        payment_type_id: this.getPaymentTypeName(
          this.selectedSaleRecord.payment_type_id
        ),
        start_date: this.formatDate(this.selectedSaleRecord.start_date),
        expiry_date: this.formatDate(this.selectedSaleRecord.expiry_date),
        receive_date: this.formatDate(this.selectedSaleRecord.start_date),
        note: this.selectedSaleRecord.note || "",
        package_detail: this.selectedSaleRecord.package?.package_detail || "",

        mad: this.selectedSaleRecord.mad,
        dessert: this.selectedSaleRecord.dessert,
        brittles: this.selectedSaleRecord.brittles,
        energy_balls: this.selectedSaleRecord.energy_balls,
        dressing: this.selectedSaleRecord.dressing,
        yoghurt: this.selectedSaleRecord.yoghurt,
        granola: this.selectedSaleRecord.granola,
        credit: this.selectedSaleRecord.credit,

        delivery_date: this.selectedSaleRecord.customer?.delivery_date || "",
        select_food_id: this.getSelectFood(
          this.selectedSaleRecord.select_food_id
        ),
      };
    },

    formattedDate() {
      return new Date().toLocaleDateString("en-UK", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
    },

    zone1_info() {
      const zoneName = this.getZoneName(this.selectedSaleRecord.zone1_id);
      const zoneQuantity = this.selectedSaleRecord.zone1_quantity;
      return `${zoneName} (${zoneQuantity})`;
    },

    zone1Name() {
      return this.selectedSaleRecord.zone1_id
        ? this.getZoneName(this.selectedSaleRecord.zone1_id)
        : "ไม่พบข้อมูล";
    },
    zone2Name() {
      return this.selectedSaleRecord.zone2_id
        ? this.getZoneName(this.selectedSaleRecord.zone2_id)
        : "ไม่พบข้อมูล";
    },
    zone3Name() {
      return this.selectedSaleRecord.zone3_id
        ? this.getZoneName(this.selectedSaleRecord.zone3_id)
        : "ไม่พบข้อมูล";
    },
    zoneOutsourceName() {
      return this.selectedSaleRecord.zone_outsource_id
        ? this.getZoneName(this.selectedSaleRecord.zone_outsource_id)
        : "ไม่พบข้อมูล";
    },


    filteredSaleRecordsPaid() {
  return this.saleRecords
    .filter((record) => record.payment_status === "paid") // กรองเฉพาะที่มี payment_status เป็น "paid"
    .filter((saleRecord) => {
      const matchesSearch = this.getCustomerName(saleRecord.customer_id)
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase()); // กรองตามชื่อ
      const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id); // กรองตาม package_type (ถ้าต้องการกรอง)
      const validRemainingDays = saleRecord.remaining_days > 0; // ตรวจสอบ remaining_days
      const validTotalBoxes = saleRecord.total_boxes > 0; // ตรวจสอบ total_boxes
      return matchesSearch && matchesPackageType && validRemainingDays && validTotalBoxes; // กรองรวมทั้งสามเงื่อนไข
    });
},

    filteredPackageTypes() {
      return this.packageTypes.filter(type =>
        !type.name.toLowerCase().includes('additional sales') &&
        !type.name.toLowerCase().includes('consignment')
      );
    },

    // isConsignmentOrAdditional() {
    //   const packageType = this.saleRecord.package_type_id?.name?.toLowerCase();
    //   return ["consignment", "additional sales"].includes(packageType);
    // },


    filteredAdditionalTypes() {
      return this.additionalTypes.filter(type => type.name.startsWith("AFF"));
    },
    filteredPrograms() {
      return this.programs.filter(program => !program.name.startsWith("Happy"));
    },
    filteredInhouse() {
      return this.zoneDeliveries.filter(zoneDelivery => zoneDelivery.name.startsWith("AFF"));
    },
    filteredOutsource() {
      return this.zoneDeliveries.filter(zoneDelivery => !zoneDelivery.name.startsWith("AFF"));
    },

    ...mapGetters(["saleRecords"]),
  },
  methods: {
    ...mapActions([
      "fetchSaleRecords",
      "fetchLookupData",
      "fetchCustomerAddress",
    ]),

    resetProgramAndPackage() {
      this.saleRecord.program_id = null;
      this.saleRecord.package_id = null;
    },
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
      return "฿" + new Intl.NumberFormat("th-TH").format(price);
    },
    formatPercent(percent) {
      return new Intl.NumberFormat("th-TH").format(percent) + "%";
    },

    fetchCustomerAddress(selectedCustomer) {
      if (!selectedCustomer || !selectedCustomer.id) {
        this.customerAddress = "เลือกลูกค้าใหม่";
        this.saleRecord.address_1 = "";
        this.saleRecord.address_2 = "";
        this.saleRecord.address_3 = "";
        return;
      }

      const selectedCustomerId =
        selectedCustomer.id || selectedCustomer.customer_id;
      const customer = this.customers.find((c) => c.id === selectedCustomerId);

      if (customer) {
        this.customerAddress = `${customer.address_1 || ""} ${customer.address_2 || ""
          } ${customer.address_3 || ""}`.trim();
        this.saleRecord.address_1 = customer.address_1;
        this.saleRecord.address_2 = customer.address_2;
        this.saleRecord.address_3 = customer.address_3;

        if (!this.customerAddress) {
          this.customerAddress = "ไม่มีที่อยู่";
        }
      } else {
        this.customerAddress = "ไม่พบข้อมูลลูกค้า";
        // console.log('Customer not found');
      }
    },

    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.updatePage();
    },
    updatePage() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      // ใช้ข้อมูลที่กรองแล้วใน filteredSaleRecordsPaid
      this.filteredSaleRecords = this.filteredSaleRecordsPaid.slice(startIndex, endIndex);
    },

    search() {
      const filtered = this.saleRecords.filter((saleRecord) => {
        const matchesSearch = this.getCustomerName(
          saleRecord.customer_id
        ).toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesPackageType = this.selectedPackageType.length === 0 || this.selectedPackageType.includes(saleRecord.package_type_id);
        return matchesSearch && matchesPackageType;
      });

      this.currentPage = 1;
      this.filteredSaleRecordsPaid = filtered;
      this.updatePage();
    },
    clearSearch() {
      this.searchQuery = "";
      this.search();
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

      this.saleRecords.sort((a, b) => {
        let aValue, bValue;
        if (column === "name") {
          aValue = this.getCustomerName(a.customer_id);
          bValue = this.getCustomerName(b.customer_id);
        } else {
          aValue = a[column];
          bValue = b[column];
        }

        if (aValue < bValue) return -this.sortDirection[column];
        if (aValue > bValue) return this.sortDirection[column];
        return 0;
      });

      this.currentPage = 1;
      this.updatePage();
    },
    clearSort() {
      this.sortColumn = "id";
      this.sortDirection.id = 1;
      this.saleRecords.sort((a, b) => a.id - b.id);
      this.currentPage = 1;
      this.updatePage();
    },

    toggleFiltterDropdown() {
      this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    },
    applyFilter() {
      if (this.selectedPackageType.length > 0) {
        this.filteredSaleRecords = this.packageTypes.filter(packageType =>
          this.selectedPackageType.includes(packageType.package_type_id)
        );
      } else {
        this.filteredSaleRecords = this.saleRecords;
      }
      this.isFilterDropdownOpen = false;
      this.updatePage();
    },
    clearFilter() {
      this.selectedPackageType = [];
      this.filteredSaleRecords = this.saleRecords;
      this.updatePage();
    },

    toggleMoreDropdown(index) {
      this.moreOpenDropdownIndex =
        this.moreOpenDropdownIndex === index ? null : index;
    },
    moreDropdownPositionClass(index) {
      if (index >= this.filteredSaleRecords.length - 2) {
        return "dropdown-up";
      }
      return "dropdown-down";
    },

    getPaymentStatusText(status) {
      return status === "paid" ? "ชำระเงินแล้ว" : "ยังไม่ได้ชำระเงิน";
    },
    getPaymentStatusClass(status) {
      return status === "paid"
        ? "text-white bg-green-500"
        : "text-white bg-red-500";
    },
    getAddPaymentStatusClass(status) {
      return status === "paid"
        ? "text-green-500 font-bold"
        : "text-red-500 font-bold";
    },

    filterPrograms() {
      if (
        this.saleRecord.promotion_type_id &&
        this.saleRecord.promotion_type_id.id
      ) {
        this.programs = this.allPrograms.filter(
          (program) =>
            program.promotion_type_id === this.saleRecord.promotion_type_id.id
        );
      } else {
        this.programs = this.allPrograms; // หรือค่า default ที่คุณต้องการ
      }
      this.saleRecord.program_id = [];
    },

    filterPackages() {
      if (this.saleRecord.program_id && this.saleRecord.program_id.id) {
        this.packages = this.allPackages.filter(
          (pkg) => pkg.program_id === this.saleRecord.program_id.id
        );
      } else {
        this.packages = this.allPackages; // ค่า default ที่คุณต้องการ
      }
      this.saleRecord.package_id = []; // รีเซ็ตค่า package_id
    },

    filterEditPrograms() {
      if (
        this.selectedSaleRecord.promotion_type_id &&
        this.selectedSaleRecord.promotion_type_id.id
      ) {
        this.programs = this.allPrograms.filter(
          (program) =>
            program.promotion_type_id === this.selectedSaleRecord.promotion_type_id.id
        );
      } else {
        this.programs = this.allPrograms; // หรือค่า default ที่คุณต้องการ
      }
    },
    filterEditPackages() {
      if (this.selectedSaleRecord.program_id && this.selectedSaleRecord.program_id.id) {
        this.packages = this.allPackages.filter(
          (pkg) => pkg.program_id === this.selectedSaleRecord.program_id.id
        );
      } else {
        this.packages = this.allPackages; // ค่า default ที่คุณต้องการ
      }
    },

    async showPackageDetails(packageId) {
      const selectedSaleRecord = this.packages.find(
        (pkg) => pkg.id === packageId.id
      ); // เข้าถึง id จาก Proxy
      if (selectedSaleRecord) {
        this.packageDetails = selectedSaleRecord;
        this.isShowingPackageDetails = true;
      } else {
        console.error("ไม่พบแพ็คเกจที่เลือก");
      }
    },
    togglePackageDetails(packageId) {
      if (this.isShowingPackageDetails) {
        this.resetPackageDetails();
      } else {
        this.showPackageDetails(packageId);
      }
    },
    resetPackageDetails() {
      this.packageDetails = null;
      this.isShowingPackageDetails = false;
    },

    async fetchLookupData() {
      try {
        const [
          customersRes,
          promotionTypesRes,
          programsRes,
          packagesRes,
          packageTypesRes,
          zoneDeliveryRes,
          zoneDeliveryTypeRes,
          sellerNamesRes,
          paymentTypeRes,
          additionalTypeRes,
          deliveryRoundRes,
          receiveFoodRes,
          selectFoodRes,
        ] = await Promise.all([
          axios.get("http://127.0.0.1:3333/customers-hhb"),
          axios.get("http://127.0.0.1:3333/promotion-types"),
          axios.get("http://127.0.0.1:3333/programs"),
          axios.get("http://127.0.0.1:3333/packages"),
          axios.get("http://127.0.0.1:3333/package-types"),
          axios.get("http://127.0.0.1:3333/zone-deliveries"),
          axios.get("http://127.0.0.1:3333/zone-delivery-types"),
          axios.get("http://127.0.0.1:3333/seller-names"),
          axios.get("http://127.0.0.1:3333/payment-types"),
          axios.get("http://127.0.0.1:3333/additional-types"),
          axios.get("http://127.0.0.1:3333/delivery-rounds"),
          axios.get("http://127.0.0.1:3333/receive-foods"),
          axios.get("http://127.0.0.1:3333/select-foods"),
        ]);

        this.customers = customersRes.data;
        this.promotionTypes = promotionTypesRes.data;
        this.allPrograms = programsRes.data || [];
        this.programs = this.allPrograms;
        if (this.saleRecord.promotion_type_id) {
          this.filterPrograms();
        }

        this.allPackages = packagesRes.data.filter((packaged) => {
          if (!packaged.start_date) {
            packaged.displayLabel = packaged.name;
            return true;
          }

          const date = new Date(packaged.start_date);
          const currentMonth = new Date().getMonth();
          const startMonth = date.getMonth();

          if (startMonth === currentMonth) {
            const thaiMonths = [
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฎาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ];
            const thaiMonth = thaiMonths[date.getMonth()];
            const thaiYear = date.getFullYear();

            packaged.displayLabel = `${packaged.name} (${thaiMonth} ${thaiYear})`;
            return true;
          }
          return false;
        });
        this.packages = this.allPackages;
        if (this.saleRecord.program_id) {
          this.filterPackages();
        }

        this.packageTypes = packageTypesRes.data;
        this.zoneDeliveries = zoneDeliveryRes.data;
        this.zoneDeliveryTypes = zoneDeliveryTypeRes.data;
        this.sellerNames = sellerNamesRes.data;
        this.paymentTypes = paymentTypeRes.data.data;
        this.additionalTypes = additionalTypeRes.data;

        this.deliveryRounds = deliveryRoundRes.data;
        this.receiveFoods = receiveFoodRes.data;
        this.selectFoods = selectFoodRes.data;

        this.updatePage;
        //console.log('Fetched payment types:', paymentTypeRes.data);
        //console.log(this.paymentTypes);
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },

    async fetchSaleRecords() {
      try {
        const response = await axios.get("http://127.0.0.1:3333/sale-records-hhb");
        this.saleRecords = response.data;
        this.filteredSaleRecords = response.data;
        this.saleRecords.sort((a, b) => a.id - b.id);
        this.updatePage();
      } catch (error) {
        console.error("Error fetching sale records:", error);
      }
    },

    getCustomerName(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.name : "ไม่พบข้อมูล";
    },
    getPromotionTypeName(promotionTypeId) {
      const promotionType = this.promotionTypes.find((c) => c.id === promotionTypeId);
      return promotionType ? promotionType.name : "ไม่พบข้อมูล";
    },
    getProgramName(programId) {
      const program = this.programs.find((p) => p.id === programId);
      if (program) {
        const promotionType = this.promotionTypes.find(
          (pt) => pt.id === program.promotion_type_id
        );
        const promotionTypeName = promotionType
          ? promotionType.name
          : "ไม่มีโปรโมชั่น"; // กรณีที่ไม่มีข้อมูล PromotionType
        return `${program.name} (${promotionTypeName})`; // แสดงชื่อโปรแกรมพร้อมชื่อโปรโมชั่น
      }
      return "ไม่พบข้อมูล";
    },
    getPackageName(packageId) {
      if (this.allPackages && Array.isArray(this.allPackages)) {
        const packaged = this.allPackages.find((p) => p.id === packageId);
        if (packaged) {
          if (!packaged.start_date) {
            return packaged.name;
          }

          const date = new Date(packaged.start_date);
          const currentMonth = new Date().getMonth();
          const startMonth = date.getMonth();

          if (startMonth === currentMonth) {
            const thaiMonths = [
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฎาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ];
            const thaiMonth = thaiMonths[date.getMonth()];
            const thaiYear = date.getFullYear();

            return `${packaged.name} (${thaiMonth} ${thaiYear})`;
          }
          return packaged.name;
        }
        return "ไม่พบข้อมูล";
      }
      return "ข้อมูลแพ็คเกจไม่พร้อมใช้งาน";
    },
    getPackageTypeName(packageTypeId) {
      const packageType = this.packageTypes.find((c) => c.id === packageTypeId);
      return packageType ? packageType.name : "ไม่พบข้อมูล";
    },
    getPaymentTypeName(paymentTypeId) {
      const payment_type = this.paymentTypes.find((c) => c.id === paymentTypeId);
      return payment_type ? payment_type.name : null;
    },
    getZoneName(zoneDeliveryId) {
      const zoneDelivery = this.zoneDeliveries.find(
        (z) => z.id === zoneDeliveryId
      );
      return zoneDelivery ? zoneDelivery.name : "ไม่พบข้อมูล";
    },
    getSelectFood(selectFoodId) {
      const selectFood = this.selectFoods.find((z) => z.id === selectFoodId);
      return selectFood ? selectFood.name : " ";
    },
    getReceiveFoodName(receiveFoodId) {
      const receiveFood = this.receiveFoods.find((z) => z.id === receiveFoodId);
      return receiveFood ? receiveFood.name : "";
    },
    getDeliveryRoundName(deiveryRoundId) {
      const deliveryRound = this.deliveryRounds.find(
        (z) => z.id === deiveryRoundId
      );
      return deliveryRound ? deliveryRound.name : " ";
    },
    getSellerName(sellerId) {
      const seller = this.sellerNames.find((z) => z.id === sellerId);
      return seller ? seller.name : " ";
    },
    getZonePrice(zoneId) {
      // สมมติว่า zone_deliveries เป็นอาเรย์หรือออบเจกต์ที่เก็บข้อมูลทั้งหมดของ zone
      const zone = this.zoneDeliveries.find((zone) => zone.id === zoneId);
      return zone ? zone.price : 0; // ถ้าไม่พบ zone ให้คืนค่า 0
    },
    getCustomerAddress1(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.address_1 : "ไม่พบข้อมูล";
    },
    getCustomerAddress2(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.address_2 : "ไม่พบข้อมูล";
    },
    getCustomerAddress3(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.address_3 : "ไม่พบข้อมูล";
    },

    startEditing(saleRecord) {
      this.isEditing = true;
      this.editingSaleRecordId = saleRecord.id;
    },

    saveUpdatedDelivery(saleRecord) {
      this.updateDelivery(saleRecord);
      this.isEditing = false;
      this.editingSaleRecordId = null;
    },

    cancelEditing() {
      this.fetchSaleRecords();
      this.isEditing = false;
      this.editingSaleRecordId = null;

    },

    async updateDelivery(saleRecord) {
      try {
        await axios.put(`http://127.0.0.1:3333/sale-records-hhb/${saleRecord.id}/delivery`, {
          delivery_round: saleRecord.delivery_round || '',
          deliver: saleRecord.deliver || '',
          delivery_zone: saleRecord.delivery_zone || ''
        });

        await this.fetchSaleRecords();
        this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!")
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการจัดส่ง:", error);
        this.showErrorToastNotification("กิดข้อผิดพลาดในการแก้ไข!")
      }
    },

    // getCustomerAddress(customerId, addressType) {
    //   const customer = this.customers.find((c) => c.id === customerId);
    //   return customer ? customer[addressType] : "ไม่พบข้อมูล";
    // },

    // // ฟังก์ชันเลือกประเภทที่อยู่ที่ใช้
    // getSelectedAddressType(saleRecordId) {
    //   return this.selectedAddressType[saleRecordId] || "address_1"; // ค่าเริ่มต้นเป็น address_1
    // },

    // // ฟังก์ชันที่ใช้ในการอัพเดตประเภทที่อยู่ที่เลือก
    // setSelectedAddressType(saleRecordId, value) {
    //   this.selectedAddressType[saleRecordId] = value;
    // },
    //   getCustomerAddress(customerId, addressType = "address_1") {
    //     const customer = this.customers.find((c) => c.id === customerId);
    //     if (!customer) return "ไม่พบข้อมูล";

    //     return customer[addressType] || "ไม่มีข้อมูล";
    //   },
    //   getSelectedAddressType(saleRecordId) {
    //   return this.selectedAddressType[saleRecordId] || "address_1"; // ค่าเริ่มต้น
    // },
    // setSelectedAddressType(saleRecordId, value) {
    //   this.$set(this.selectedAddressType, saleRecordId, value);
    // },


    getCustomerTel(customerId) {
      const customer = this.customers.find((c) => c.id === customerId);
      return customer ? customer.tel : "ไม่พบข้อมูล";
    },

    onViewDetail(saleRecord) {
      this.selectedSaleRecord = saleRecord;
      this.isDetailModalOpen = true;
      this.moreOpenDropdownIndex = null;
    },
    closeDetailModal() {
      this.isDetailModalOpen = false;
      // this.selectedSaleRecord = null;
    },
    formatDetailLabel(key) {
      const labels = {
        //customer_id: 'รหัส',
        seller_name_id: "ผู้ขาย",
        name: "ชื่อ-สกุลลูกค้า",
        package_type: "Package Type",
        promotion_type: "Promotion Type",
        program: "Program",
        package: "แพ็กเกจที่ซื้อ ",
        package_price: "ราคาแพ็กเกจ",
        promotion_detail: "รายละเอียดโปรโมชัน",
        other_promotion_detail: "รายละเอียดโปรโมชันเพิ่มเติม(นอกเหนือจากโปรฯ รายเดือนที่ต้องได้รับอนุมัติ)",
        free_mad: "จำนวนกล่องที่แถม M or A or D",
        free_dessert: "จำนวนกล่องที่แถม Dessert",
        free_brittles: "จำนวนกล่องที่แถม Brittles",
        free_energy_balls: "จำนวนกล่องที่แถม Energy Balls",
        free_dressing: "จำนวนกล่องที่แถม Dressing",
        free_yoghurt: "จำนวนกล่องที่แถม Yoghurt",
        free_granola: "จำนวนกล่องที่แถม Granola",
        free_credit: "เครดิตที่แถม (บาท)",

        discount: "ส่วนลดเพิ่มเติมจากโปรฯ ประจำเดือน (ถ้ามี)",
        extra_charge: "Extra Charge (%)",
        extra_charge_price: "มูลค่า Extra Charge",
        total_package_price: "มูลค่าแพ็กเกจรวม",
        receive_food_id: "วิธีการรับอาหาร",

        zone1_id: "In-house Riders (ที่อยู่ 1)",
        total_zone1_price: "ค่าจัดส่งรวม (ที่อยู่ 1)",
        zone2_id: "In-house Riders (ที่อยู่ 2)",
        total_zone2_price: "ค่าจัดส่งรวม (ที่อยู่ 2)",
        zone3_id: "In-house Riders (ที่อยู่ 3)",
        total_zone3_price: "ค่าจัดส่งรวม (ที่อยู่ 3)",
        zone_outsource_id: "Outsource Riders",
        total_zone_outsource_price: "ค่าจัดส่งรวม Outsource",
        total_delivery_zone_price: "ค่าจัดส่งรวม In-house Riders",
        total_delivery_price: "รวมค่าจัดส่งทั้งหมด",

        total_price: "มูลค่าขายรวม",
        payment_status: "สถานะการชำระเงิน",
        paid_date: "วันที่ชำระเงิน",
        payment_type_id: "วิธีการชำระเงิน",
        receive_date: "วันเริ่มรับอาหารวันแรก",
        sellect_by: "เลือกอาหารโดย",
        start_date: "วันเริ่มแพ็กเกจ",
        expiry_date: "วันหมดอายุแพ็คเกจ",
        note: "Note รายละเอียดโปรโมชันสำหรับส่งสรุปให้ลูกค้า (ถ้ามี)",
        package_detail: "ข้อมูลแพ็กเกจ(สำหรับสรุปให้ลูกค้า)",
        mad: "M or A or D",
        dessert: "Dessert",
        brittles: "Brittles",
        energy_balls: "Energy Balls",
        dressing: "Dressing",
        yoghurt: "Yoghurt",
        granola: "Granola",
        credit: "Cash Credit ที่ได้รับ",

        delivery_date: "วันที่ต้องการรับอาหาร",
        select_food_id: "วิธีการเลือกอาหาร",
      };
      return labels[key] || key;
    },
    getLabelClass(key) {
      if (key === "total_package_price") {
        return "text-custom-orange";
      }
      return "";
    },
    getValueClass() {
      return "";
    },

    onViewResultSaleRecord(saleRecord) {
      this.selectedSaleRecord = saleRecord;
      this.isResultModalOpen = true;
      this.moreOpenDropdownIndex = null;
    },
    closeResultModal() {
      this.isResultModalOpen = false;
      // this.selectedSaleRecord = null;
    },
    formatResultLabel(key) {
      const labels = {
        name: "🏷 คุณ",
        package: "▶️ แพ็คเกจ",
        promotion_detail: "🔥",
        receive_food: "▶️ อาหารที่ได้รับ",
        start_date: "▶️ วันรับอาหารวันแรก",
        sellect_by: "▶️ เลือกอาหารโดย",
        delivery_date: "▶️ วันที่รับอาหาร",
        delivery: "▶️ จัดส่ง",
        package_price: "▶️ ราคาแพ็คเกจ",
        extra_charge: "▶️ Extra Chrage",
        discount: "▶️ ส่วนลด",
        total_delivery_price: "▶️ ค่าจัดส่ง",
        total_price: "▶️ ยอดชำระ",
        expiry_date: "▶️ วันหมดอายุแพ็คเกจ",
        note: "▶️ หมายเหตุ:",
      };
      return labels[key] || key;
    },
    copyResultModalContent() {
      let modalText = this.$refs.modalContent.innerText;
      modalText = modalText.replace(/\n\s*\n/g, "\n");

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(modalText)
          .then(() => {
            this.isCopied = true;
            setTimeout(() => {
              this.isCopied = false;
            }, 2000);
          })
          .catch((err) => {
            console.error("ไม่สามารถคัดลอกข้อความ:", err);
          });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = modalText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          this.isCopied = true;
          setTimeout(() => {
            this.isCopied = false;
          }, 2000);
        } catch (err) {
          console.error("ไม่สามารถคัดลอกข้อความ:", err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
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


    checkPackageType() {
      if (
        this.saleRecord.package_type_id &&
        (this.saleRecord.package_type_id.name.toLowerCase() === 'additional sales' ||
          this.saleRecord.package_type_id.name.toLowerCase() === 'consignment')
      ) {
        this.clearAdditionalForm();
      } else {
        this.clearNotAdditionalForm();
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
  watch: {
    "saleRecord.customer_id"(newCustomerId) {
      this.fetchCustomerAddress(newCustomerId);
    },
    searchQuery() {
      this.updatePage();
    },
    currentPage() {
      this.updatePage();
    },
  },
  created() {
    this.filteredSaleRecords = this.saleRecords;
    this.sortData("id");
    this.fetchLookupData();
    this.fetchSaleRecords();
    this.updatePage();
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.fetchLookupData();
    this.fetchSaleRecords();
    this.updatePage();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style>
.dropdown-up {
  bottom: 100%;
  margin-bottom: 4px;
}

@media print {

  @page {
    margin: 10mm;   
  }
}
</style>
