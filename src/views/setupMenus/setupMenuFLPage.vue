<template>
  <!-- <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white">
          <th v-for="(header, index) in headers" :key="index" :class="['px-4 py-2 text-left font-bold']"
            :style="{ width: headerWidths[index] }">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(setupMenus, week) in setupMenus" :key="week">
          <tr v-for="(menu, index) in setupMenus" :key="menu.id" class="border-b border-b-gray-200 bg-white relative">
            <td class="px-4 py-2 align-top pb-5">{{ index + 1 }}</td>
  
            <td v-if="index === 0" :rowspan="setupMenus.length" class="px-4 py-2 border border-transparent">
              {{ week }}
            </td>
            <td v-if="index === 0 || setupMenus[index].day_of_week !== setupMenus[index - 1].day_of_week"
              :rowspan="setupMenus.filter(m => m.day_of_week === menu.day_of_week).length"
              class="px-4 py-2 align-top pb-5">
              {{ menu.day_of_week }}
            </td>
  
            <td class="px-4 py-2 align-top pb-5">{{ getMenuEnglishName(menu.menu_id) }}</td>
            <td class="px-4 py-2 align-top pb-5">{{ getMenuThaiName(menu.menu_id) }}</td>
          </tr>
        </template>
</tbody>
</table> -->

  <div
    class="fixed top-4 right-8 bg-green-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
    :class="{ 'opacity-100': showSuccessToast, 'opacity-0': !showSuccessToast }"
  >
    <span class="material-symbols-outlined text-white">check_circle</span>
    <span>{{ toastSuccessMessage }}</span>
    <button
      @click="showSuccessToast = false"
      class="text-white hover:text-gray-200 focus:outline-none"
    >
      <span class="material-symbols-outlined text-xl">close</span>
    </button>
  </div>

  <div
    class="fixed top-4 right-8 bg-red-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-50"
    :class="{ 'opacity-100': showFailToast, 'opacity-0': !showFailToast }"
  >
    <span class="material-symbols-outlined text-white">cancel</span>
    <span>{{ toastFailMessage }}</span>
    <button
      @click="showFailToast = false"
      class="text-white hover:text-gray-200 focus:outline-none"
    >
      <span class="material-symbols-outlined text-xl">close</span>
    </button>
  </div>

  <div class="flex justify-end items-center space-x-2 relative">
    <div class="flex items-center space-x-1 mr-auto">
      <button
        @click="viewMode = 'week'"
        :class="[
          'px-2 py-1 rounded-lg  hover:bg-gray-50',
          { ' text-custom-orange': viewMode === 'week' },
        ]"
      >
        <span class="material-symbols-outlined text-2xl"
          >calendar_view_week</span
        >
      </button>
      <button
        @click="viewMode = 'day'"
        :class="[
          'px-2 py-1 rounded-lg  hover:bg-gray-50',
          { ' text-custom-orange': viewMode === 'day' },
        ]"
      >
        <span class="material-symbols-outlined text-2xl"
          >calendar_view_day</span
        >
      </button>

      <p class="text-4xl mb-2">|</p>
      <h1 class="text-2xl font-bold mb-2 ml-auto">
        {{ viewMode === "week" ? "ดูตามสัปดาห์" : "ดูตามวัน" }}
      </h1>
    </div>

    <div class="flex items-center space-x-4">
      <div>
        <label for="startDate" class="font-bold mr-2 text-gray-700"
          >วันเริ่มต้น:</label
        >
        <input
          type="text"
          id="startDate"
          ref="startDate"
          v-model="formattedStartDate"
          class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange text-custom-orange w-[150px]"
          placeholder="เลือกวันที่"
        />
      </div>
      <button
        @click="updateStartDate"
        class="bg-green-500 text-white px-2 py-1 rounded flex items-center space-x-1 hover:bg-green-700"
        v-if="!isDateConfirmed && startDate !== initialStartDate"
      >
        ยืนยัน
      </button>
    </div>

    <div class="add relative inline-block">
      <button
        @click="openAddModal"
        class="bg-custom-orange text-white px-4 py-2 rounded flex items-center space-x-1 hover:bg-custom-orange-hover"
      >
        <span class="material-symbols-outlined text-white text-xl leading-none"
          >add</span
        >
        <span class="text-white text-base leading-none">เพิ่ม Setup Menu</span>
      </button>

      <div
        v-if="isAddModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      >
        <div
          class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col"
        >
          <div
            class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
            :class="{
              'opacity-100': showErrorToast,
              'opacity-0': !showErrorToast,
            }"
          >
            <span class="material-symbols-outlined text-white">error</span>
            <span>{{ toastErrorMessage }}</span>
            <button
              @click="showErrorToast = false"
              class="text-white hover:text-gray-200 focus:outline-none"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div
            class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md"
          >
            <h2 class="text-xl font-bold">เพิ่มข้อมูล</h2>
            <span
              @click="closeAddModal"
              class="material-symbols-outlined cursor-pointer hover:text-gray-200"
              >close</span
            >
          </div>

          <div class="p-6 space-y-4 overflow-y-auto flex-grow">
            <div class="flex items-center space-x-4">
              <label for="day_of_week" class="font-bold text-gray-700"
                >ลำดับวัน:</label
              >
              <input
                v-model="day_of_week"
                type="number"
                placeholder="กรองลำดับวัน"
                class="p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div
              v-for="(item, index) in formRows"
              :key="index"
              class="space-y-4 relative"
            >
              <!-- หัวข้อแถว -->
              <div class="text-xl font-bold text-gray-700">
                ประเภทอาหาร {{ index + 1 }}
              </div>

              <!-- ประเภทเมนู -->
              <div>
                <label for="mealType" class="font-bold text-gray-700"
                  >ประเภทอาหาร</label
                >
                <multiselect
                  v-model="item.selectedMealType"
                  :options="filteredMealTypes"
                  :multiple="false"
                  :searchable="true"
                  :close-on-select="true"
                  placeholder="เลือกประเภทอาหาร"
                  label="name"
                  track-by="id"
                />
              </div>

              <!-- เมนู -->
              <div>
                <label for="menus" class="block font-bold text-gray-700"
                  >เมนู</label
                >
                <multiselect
                  v-model="item.selectedMenus"
                  :options="getFilteredMenus(item.selectedMealType)"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  track-by="id"
                  :custom-label="menuLabel"
                />
              </div>

              <!-- ปุ่มลบแถว -->
              <div class="absolute top-2 right-4">
                <button
                  type="button"
                  @click="removeRow(index)"
                  class="text-red-500 hover:text-red-600 flex items-center"
                >
                  <span>× ลบเมนู</span>
                </button>
              </div>
            </div>

            <div class="mb-4 flex justify-center">
              <button
                type="button"
                @click="addRow"
                class="text-green-500 hover:text-green-600 flex items-center"
              >
                <span>+ เพิ่มแถว</span>
              </button>
            </div>
          </div>

          <div
            class="flex justify-between space-x-4 p-4 bg-white border-t rounded-b-md list-none"
          >
            <li
              @click="clearForm"
              class="px-4 py-2 cursor-pointer font-bold text-custom-orange text-left hover:underline"
            >
              <span>รีเซ็ตข้อมูล</span>
            </li>
            <div class="flex space-x-2">
              <button
                @click="closeAddModal"
                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                ยกเลิก
              </button>
              <button
                @click="addMenus"
                class="px-4 py-2 rounded bg-custom-orange text-white hover:bg-custom-orange-hover"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-[250px] relative">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="ค้นหา..."
        class="border border-gray-300 rounded-l px-4 py-2 w-full"
        @keyup.enter="search"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="material-symbols-outlined absolute right-[55px] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        close
      </button>
      <button
        @click="search"
        class="bg-custom-orange material-symbols-outlined text-white text-xl px-4 py-2 rounded-r hover:bg-custom-orange-hover"
      >
        search
      </button>
    </div>
  </div>

  <div v-show="viewMode === 'week'">
    <div class="flex items-center space-x-3 py-2">
      <button @click="changeWeek(-1)" class="flex items-center">
        <span
          class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover"
        >
          chevron_backward
        </span>
      </button>

      <multiselect
        v-if="weekOptions.length > 0"
        v-model="selectedWeek"
        :options="weekOptions"
        placeholder="เลือกสัปดาห์"
        :multiple="false"
        :taggable="true"
        :close-on-select="true"
        :allow-empty="true"
        class="w-60"
      >
      </multiselect>

      <button @click="changeWeek(1)" class="flex items-center">
        <span
          class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover"
        >
          chevron_forward
        </span>
      </button>
    </div>

    <div v-if="selectedWeek" class="mb-8">
      <!-- <h2 class="text-xl font-semibold mb-2 ml-2">{{ selectedWeek }}</h2> -->
      <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
        <thead>
          <tr class="bg-custom-orange text-white">
            <th
              v-for="(header, index) in headers"
              :key="index"
              :class="['px-4 py-2 text-left font-bold']"
              :style="{ width: headerWidths[index] }"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(menu, index) in paginatedMenus"
            :key="menu.id"
            class="border-b border-b-gray-200 bg-white relative"
          >
            <td class="px-4 py-2 align-top pb-5">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>

            <td
              v-if="
                index === 0 ||
                menu.day_of_week !== paginatedMenus[index - 1].day_of_week
              "
              :rowspan="getRowSpan(paginatedMenus, menu.day_of_week)"
              class="px-4 py-2 align-top pb-5 border-l border-r"
            >
              <div>
                <strong>ลำดับวันที่: </strong>{{ menu.day_of_week }}
                <br />
                <div class="flex items-center">
                  <span class="material-symbols-outlined text-xl mr-2"
                    >calendar_today</span
                  >
                  {{ formattedDate(menu.date_to_show) }}
                </div>
              </div>
            </td>

            <td class="px-4 py-2 align-top pb-5">
              {{ getMealTypeName(getMealTypeID(menu.menu_id)) }}
            </td>
            <td class="px-4 py-2 align-top pb-5">
              {{ getMenuEnglishName(menu.menu_id) }}
            </td>
            <td class="px-4 py-2 align-top pb-5">
              {{ getMenuThaiName(menu.menu_id) }}
            </td>
            <td class="px-4 py-2 align-top text-right">
              <div class="flex justify-end space-x-2">
                <button
                  @click="openEditModal(menu)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1"
                >
                  <span class="material-symbols-outlined">edit_square</span>
                  <span>แก้ไข</span>
                </button>
                <button
                  @click="confirmDelete(menu.id)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1"
                >
                  <span class="material-symbols-outlined">delete</span>
                  <span>ลบ</span>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="paginatedMenus.length === 0">
            <td
              colspan="6"
              class="py-10 bg-white text-center text-gray-500 font-bold"
            >
              ไม่พบข้อมูล
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="rounded-b-2xl flex justify-center items-center space-x-2 bg-white px-2 py-1"
      >
        <!-- ปุ่ม Previous -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <div class="flex items-center space-x-1">
          <!-- ปุ่มหน้าแรก ถ้าหน้าเริ่มต้นมากกว่า 1 -->
          <button
            v-if="totalPagesArray.start > 1"
            @click="goToPage(1)"
            class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
          >
            1
          </button>

          <!-- แสดง ... ถ้าหน้าต่อไปมีหลายหน้า -->
          <button
            v-if="totalPagesArray.start > 2"
            @click="goToPage(totalPagesArray.start - 1)"
            class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
          >
            ...
          </button>

          <!-- ปุ่มสำหรับหน้าแต่ละหน้า -->
          <button
            v-for="page in totalPagesArray.range"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 rounded-md',
              {
                'bg-custom-orange text-white': currentPage === page,
                'bg-white': currentPage !== page,
              },
            ]"
            class="cursor-pointer hover:bg-custom-orange hover:text-white"
          >
            {{ page }}
          </button>

          <!-- แสดง ... ถ้าหน้าต่อไปมีหลายหน้า -->
          <button
            v-if="totalPagesArray.end < totalPages - 1"
            @click="goToPage(totalPagesArray.end + 1)"
            class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
          >
            ...
          </button>

          <!-- ปุ่มหน้าสุดท้าย -->
          <button
            v-if="totalPagesArray.end < totalPages"
            @click="goToPage(totalPages)"
            class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
          >
            {{ totalPages }}
          </button>
        </div>

        <!-- ปุ่ม Next -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </div>

  <div v-show="viewMode === 'day'">
    <div class="flex items-center space-x-3 py-2">
      <button @click="changeDate(-1)" class="flex items-center">
        <span
          class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover"
        >
          chevron_backward
        </span>
      </button>

      <button
        @click="setToday"
        class="flex items-center text-custom-orange hover:underline hover:text-custom-orange"
      >
        <span class="mr-2 font-bold">วันนี้</span>
      </button>

      <button @click="changeDate(1)" class="flex items-center">
        <span
          class="material-symbols-outlined text-3xl text-custom-orange hover:text-custom-orange-hover"
        >
          chevron_forward
        </span>
      </button>

      <input
        ref="selectedDatePicker"
        type="text"
        v-model="formattedSelectedDate"
        @input="onSelectDateChange"
        class="text-center bg-white rounded-md font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-orange hover:ring-2 hover:ring-custom-orange w-[150px]"
        placeholder="เลือกวันที่"
      />
    </div>

    <table class="min-w-full table-auto rounded-t-2xl overflow-hidden mt-4">
      <thead>
        <tr class="bg-custom-orange text-white">
          <th
            v-for="(header, index) in headersByDay"
            :key="index"
            :class="['px-4 py-2 text-left font-bold']"
            :style="{ width: headerWidthsByDay[index] }"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(menu, index) in paginatedMenusByDay"
          :key="menu.id"
          class="border-b border-b-gray-200 bg-white relative"
        >
          <td class="px-4 py-2 align-top pb-5">
            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
          </td>
          <td class="px-4 py-2 align-top pb-5">
            {{ getMealTypeName(getMealTypeID(menu.menu_id)) }}
          </td>
          <td class="px-4 py-2 align-top pb-5">
            {{ getMenuEnglishName(menu.menu_id) }}
          </td>
          <td class="px-4 py-2 align-top pb-5">
            {{ getMenuThaiName(menu.menu_id) }}
          </td>
          <td class="px-4 py-2 align-top text-right">
            <div class="flex justify-end space-x-2">
              <button
                @click="openEditModal(menu)"
                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1"
              >
                <span class="material-symbols-outlined">edit_square</span>
                <span>แก้ไข</span>
              </button>
              <button
                @click="confirmDelete(menu.id)"
                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1"
              >
                <span class="material-symbols-outlined">delete</span>
                <span>ลบ</span>
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="paginatedMenusByDay.length === 0">
          <td
            colspan="5"
            class="py-10 bg-white text-center text-gray-500 font-bold"
          >
            ไม่พบข้อมูล
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="rounded-b-2xl flex justify-center items-center space-x-2 bg-white px-2 py-1"
    >
      <!-- ปุ่ม Previous -->
      <button
        @click="goToPageByDay(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50"
      >
        <span class="material-symbols-outlined">chevron_left</span>
      </button>

      <div class="flex items-center space-x-1">
        <!-- ปุ่มหน้าแรก ถ้าหน้าเริ่มต้นมากกว่า 1 -->
        <button
          v-if="totalPagesArrayByDay.start > 1"
          @click="goToPageByDay(1)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
        >
          1
        </button>

        <!-- แสดง ... ถ้าหน้าต่อไปมีหลายหน้า -->
        <button
          v-if="totalPagesArrayByDay.start > 2"
          @click="goToPageByDay(totalPagesArrayByDay.start - 1)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
        >
          ...
        </button>

        <!-- ปุ่มสำหรับหน้าแต่ละหน้า -->
        <button
          v-for="page in totalPagesArrayByDay.range"
          :key="page"
          @click="goToPageByDay(page)"
          :class="[
            'px-3 py-2 rounded-md',
            {
              'bg-custom-orange text-white': currentPage === page,
              'bg-white': currentPage !== page,
            },
          ]"
          class="cursor-pointer hover:bg-custom-orange hover:text-white"
        >
          {{ page }}
        </button>

        <!-- แสดง ... ถ้าหน้าต่อไปมีหลายหน้า -->
        <button
          v-if="totalPagesArrayByDay.end < totalPagesByDay - 1"
          @click="goToPageByDay(totalPagesArrayByDay.end + 1)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
        >
          ...
        </button>

        <!-- ปุ่มหน้าสุดท้าย -->
        <button
          v-if="totalPagesArrayByDay.end < totalPagesByDay"
          @click="goToPageByDay(totalPagesByDay)"
          class="px-3 py-2 rounded-md bg-white hover:bg-custom-orange hover:text-white"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- ปุ่ม Next -->
      <button
        @click="goToPageByDay(currentPage + 1)"
        :disabled="currentPage === totalPagesByDay"
        class="px-3 py-2 rounded-md hover:bg-gray-100 text-custom-orange disabled:opacity-50"
      >
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  </div>

  <div
    v-if="isEditModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div
      class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
      :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }"
    >
      <span class="material-symbols-outlined text-white">error</span>
      <span>{{ toastErrorMessage }}</span>
      <button
        @click="showErrorToast = false"
        class="text-white hover:text-gray-200 focus:outline-none"
      >
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <div
      class="bg-white rounded-md shadow-lg w-1/2 max-w-3xl h-auto max-h-[800px] flex flex-col"
    >
      <div
        class="flex justify-between items-center bg-custom-orange text-white px-4 py-2 rounded-t-md"
      >
        <span class="font-bold">แก้ไข</span>
        <div class="flex space-x-2">
          <span
            @click="closeEditModal"
            class="material-symbols-outlined cursor-pointer hover:text-gray-200"
            >close</span
          >
        </div>
      </div>

      <div class="p-6 space-y-4">
        <div class="flex items-center space-x-4">
          <label for="editDayofWeek" class="block text-gray-700 font-bold"
            >ลำดับวัน:</label
          >
          <input
            id="editDayofWeek"
            v-model="selectedSetupMenu.day_of_week"
            type="number"
            placeholder="กรอกลำดับวันที่"
            class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-orange"
          />
        </div>

        <div>
          <label for="editMealType" class="block text-gray-700 font-bold"
            >ประเภทอาหาร</label
          >
          <multiselect
            v-model="selectedSetupMenu.meal_type_id"
            :options="filteredMealTypes"
            :track-by="'id'"
            :label="'name'"
            placeholder="เลือกประเภทอาหาร"
          ></multiselect>
        </div>

        <div class="mb-4">
          <label for="editMenuID" class="block text-gray-700 font-bold"
            >เมนู</label
          >
          <multiselect
            v-model="selectedSetupMenu.menu_id"
            :options="filteredEditMenus"
            :track-by="'id'"
            :label="'name_thai'"
            placeholder="เลือกเมนู"
          />
        </div>
      </div>

      <div
        class="flex justify-end space-x-4 p-4 bg-white border-t rounded-b-md list-none"
      >
        <div class="flex space-x-2">
          <button
            @click="isEditModalOpen = false"
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            ยกเลิก
          </button>
          <button
            @click="saveChanges"
            class="px-4 py-2 rounded bg-custom-orange text-white hover:bg-custom-orange-hover"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="isDeleteModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div
      class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-8 py-4 flex items-center space-x-4 rounded-lg shadow-lg transition-opacity duration-300 z-60"
      :class="{ 'opacity-100': showErrorToast, 'opacity-0': !showErrorToast }"
    >
      <span class="material-symbols-outlined text-white">error</span>
      <span>{{ toastErrorMessage }}</span>
      <button
        @click="showErrorToast = false"
        class="text-white hover:text-gray-200 focus:outline-none"
      >
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md w-1/3">
      <div
        class="flex justify-between items-center bg-red-500 text-white px-4 py-2 rounded-t"
      >
        <h2 class="text-lg font-bold">ยืนยันการลบ</h2>
        <span
          @click="closeDeleteModal"
          class="material-symbols-outlined cursor-pointer hover:text-gray-200"
        >
          close
        </span>
      </div>
      <div class="p-4">
        <p>
          คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?
          การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>
      </div>

      <div class="flex justify-end space-x-2 p-4 border-t">
        <button
          @click="closeDeleteModal"
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          ยกเลิก
        </button>
        <button
          @click="deleteConfirmed"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  </div>

  <!-- <div class="mt-4">
        <h1 class="font-bold">เมนูวันนี้</h1>
        <ul>
            <li v-for="menu in todayMenus" :key="menu.id">{{ getMenuEnglishName(menu.menu_id) }}</li>
        </ul>
    </div> -->
</template>

<script>
import axios from "axios";
import flatpickr from "flatpickr";
import Multiselect from "vue-multiselect";

// import "flatpickr/dist/flatpickr.min.css";

export default {
  data() {
    return {
      headers: [
        "#",
        "วัน",
        "ประเภทอาหาร",
        "ชื่อเมนูภาษาอังกฤษ",
        "ชื่อเมนูภาษาไทย",
        "",
      ],
      headerWidths: ["5%", "10%", "25%", "30%", "30%", "10%"],
      headersByDay: [
        "#",
        "ประเภทอาหาร",
        "ชื่อเมนูภาษาอังกฤษ",
        "ชื่อเมนูภาษาไทย",
        "",
      ],
      headerWidthsByDay: ["5%", "25%", "30%", "30%", "10%"],

      formRows: [{ selectedMealType: null, selectedMenus: [] }],
      selectedSetupMenu: {
        id: "",
        day_of_week: "",
        // meal_type_id: "",
        menu_id: "",
      },

      filteredMenu: [],
      filteredMenuByDay: [],

      setupMenus: [],
      day_of_week: "",
      selectedMenus: [],
      menus: [],
      todayMenus: [],

      setUpMenusByDate: [],
      selectedDate: "",

      meal_types: [],
      selectedMealType: "",

      isAddModalOpen: false,

      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,

      selectedWeek: null, // เก็บค่าที่เลือกจากปุ่ม

      filteredSetupMenu: [],
      viewMode: "week",

      isDeleteModalOpen: false,
      itemToDelete: null,

      isEditModalOpen: false,

      toastSuccessMessage: "",
      showSuccessToast: false,
      toastFailMessage: "",
      showFailToast: false,
      showErrorToast: false,
      toastErrorMessage: "",

      startDate: "", // ตัวแปรสำหรับเก็บ startDate ที่ผู้ใช้เลือก
      initialStartDate: "",

      isDateConfirmed: false,
    };
  },
  components: { Multiselect },
  computed: {
    filteredMealTypes() {
      return this.meal_types.filter(
        (item) => item.menuType && item.menuType.id === 13
      );
    },
    // filteredMenus() {
    //   if (this.selectedMealType) {
    //     return this.menus.filter(menu => menu.meal_type_id === this.selectedMealType.id);
    //   }
    //   return this.menus.filter(menu => {
    //     const selectedMealType = this.meal_types.find(item => item.id === menu.meal_type_id);
    //     return selectedMealType && selectedMealType.menuType.name === 'HHB';
    //   });
    // },

    groupedMenus() {
      return Object.entries(this.setupMenus).map(([week, menus]) => {
        return {
          week,
          menus,
        };
      });
    },
    filteredMenus() {
      if (!this.selectedWeek || !this.setupMenus[this.selectedWeek]) return [];
      const menus = this.setupMenus[this.selectedWeek];

      // กรองข้อมูลตามคำค้นหาที่ผู้ใช้ใส่
      return menus.filter((menu) => {
        const englishName = this.getMenuEnglishName(menu.menu_id)
          ? this.getMenuEnglishName(menu.menu_id).toLowerCase()
          : "";
        const thaiName = this.getMenuThaiName(menu.menu_id)
          ? this.getMenuThaiName(menu.menu_id).toLowerCase()
          : "";
        const search = this.searchQuery.toLowerCase();

        return (
          englishName.includes(search) ||
          thaiName.includes(search) ||
          menu.day_of_week.toString().includes(search)
        );
      });
    },
    filteredMenusByDay() {
      return this.setUpMenusByDate.filter((menu) => {
        const englishName = this.getMenuEnglishName(menu.menu_id)
          ? this.getMenuEnglishName(menu.menu_id).toLowerCase()
          : "";
        const thaiName = this.getMenuThaiName(menu.menu_id)
          ? this.getMenuThaiName(menu.menu_id).toLowerCase()
          : "";
        const search = this.searchQuery.toLowerCase();

        return englishName.includes(search) || thaiName.includes(search);
      });
    },
    weekOptions() {
      return Object.keys(this.setupMenus); // คืนค่าลิสต์สัปดาห์
    },

    paginatedMenus() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredMenus.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredMenus.length / this.itemsPerPage);
    },
    totalPagesArray() {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      return {
        start,
        end,
        range: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      };
    },
    paginatedMenusByDay() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredMenusByDay.slice(start, start + this.itemsPerPage);
    },
    totalPagesByDay() {
      return Math.ceil(this.filteredMenusByDay.length / this.itemsPerPage);
    },
    totalPagesArrayByDay() {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPagesByDay, this.currentPage + 2);
      return {
        start,
        end,
        range: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      };
    },

    filteredEditMenus() {
      if (!this.selectedSetupMenu.meal_type_id) {
        return this.menus; // ถ้ายังไม่ได้เลือก meal_type_id ให้แสดงเมนูทั้งหมด
      }
      return this.menus.filter(
        (menu) => menu.meal_type_id === this.selectedSetupMenu.meal_type_id.id
      );
    },
    menuLabel() {
      return (menu) => `${menu.name_thai} (${menu.name_english || null})`;
    },

    formattedSelectedDate() {
      if (!this.selectedDate) return "";
      return new Intl.DateTimeFormat("en-UK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(this.selectedDate));
    },
    formattedStartDate() {
      if (!this.startDate) return ""; // หากยังไม่ได้เลือกวันที่
      return new Intl.DateTimeFormat("en-UK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(this.startDate));
    },
  },
  methods: {
    async fetchSetupMenus() {
      try {
        const response = await fetch("http://127.0.0.1:3333/setup-menu-fl");
        const data = await response.json();
        for (const week in data) {
          if (Object.prototype.hasOwnProperty.call(data, week)) {
            data[week].sort((a, b) => a.day_of_week - b.day_of_week);
          }
        }
        this.setupMenus = data;
        if (!this.selectedWeek && Object.keys(data).length > 0) {
          this.selectedWeek = "Week 1";
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    },
    getTodayDate() {
      const today = new Date(); // วันที่ปัจจุบัน
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0"); // เดือนต้องเป็น 2 หลัก
      const day = today.getDate().toString().padStart(2, "0"); // วันต้องเป็น 2 หลัก
      return `${year}-${month}-${day}`; // แปลงเป็นรูปแบบ yyyy-mm-dd
    },
    async fetchSetupMenusForToday() {
      try {
        const todayDate = this.getTodayDate(); // คำนวณวันที่ปัจจุบันในรูปแบบ yyyy-mm-dd
        console.log("Today:", todayDate);
        const response = await axios.get(
          `http://127.0.0.1:3333/setup-menu-fl/menus-by-day/${todayDate}`
        );
        console.log("API Response:", response.data);
        this.todayMenus = response.data.menus || [];
      } catch (error) {
        console.error("Error fetching menus for today:", error);
      }
    },
    async fetchLookupData() {
      try {
        const [menuRes, mealTypeRes] = await Promise.all([
          axios.get("http://127.0.0.1:3333/menus"),
          axios.get("http://127.0.0.1:3333/meal-types"),
        ]);

        this.menus = menuRes.data;
        this.meal_types = mealTypeRes.data;
        // console.log(this.menus);
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    },
    async fetchMenusByDay() {
      if (!this.selectedDate) return;

      try {
        const response = await axios.get(
          `http://127.0.0.1:3333/setup-menu-fl/menus-by-day/${this.selectedDate}`
        );
        this.setUpMenusByDate = response.data.menus;
      } catch (error) {
        console.error("Error fetching menus:", error);
        this.setUpMenusByDate = [];
      }
    },
    async fetchStartDate() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3333/setup-menu-fl/get-start-date"
        );
        this.initialStartDate = response.data.startDate; // เก็บค่าจาก API ลงใน initialStartDate
        this.startDate = this.initialStartDate; // ตั้งค่าเริ่มต้นของ startDate เป็นค่าที่ดึงมา

      } catch (error) {
        this.errorMessage = "ไม่สามารถดึงข้อมูลวันที่เริ่มต้นได้";
      }
    },
    async updateStartDate() {
      try {
        if (!this.startDate) {
          this.errorMessage = "กรุณากรอกวันที่เริ่มต้น";
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:3333/setup-menu-fl/set-start-date",
          {
            startDate: this.startDate,
          }
        );
        this.initialStartDate = this.startDate;
        this.isDateConfirmed = true;
        this.successMessage = response.data.message;
        this.errorMessage = "";

        await this.fetchSetupMenus();
        await this.fetchMenusByDay();
        this.showSuccessToastNotification("อัปเดตวันที่เริ่มต้นสำเร็จ!");
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = "เกิดข้อผิดพลาดในการอัปเดตวันที่เริ่มต้น";
        }
        this.successMessage = "";
      }
    },

    formattedDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    },

    changeDate(offset) {
      const currentDate = new Date(this.selectedDate);
      currentDate.setDate(currentDate.getDate() + offset);
      this.selectedDate = currentDate.toISOString().split("T")[0];
      this.fetchMenusByDay();
    },
    setToday() {
      const today = new Date();
      this.selectedDate = today.toISOString().split("T")[0];
      this.fetchMenusByDay(); // รีเฟรชข้อมูลเมนู
    },
    onSelectDateChange(event) {
      const inputDate = new Date(event.target.value);
      if (!isNaN(inputDate)) {
        this.selectedDate = inputDate.toISOString();
      }
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
        return mealType && mealType.menuType.id === 13;
      });
    },
    getMenuEnglishName(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.name_english : null;
    },
    getMenuThaiName(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.name_thai : null;
    },
    getMealTypeID(menuId) {
      const menu = this.menus.find((m) => m.id === menuId);
      return menu ? menu.meal_type_id : null;
    },
    getMealTypeName(menuId) {
      const menu = this.meal_types.find((m) => m.id === menuId);
      return menu ? menu.name : "null";
    },
    // getDateToShow(dayOfWeek) {
    //     const startDate = new Date("2025-01-31");

    //     const targetDate = new Date(startDate);
    //     targetDate.setDate(startDate.getDate() + dayOfWeek - 1);

    //     const options = { year: 'numeric', month: 'short', day: 'numeric' };
    //     return targetDate.toLocaleDateString('en-UK', options);
    // },

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

    changeViewMode(mode) {
      this.viewMode = mode;
      this.currentPage = 1;
    },
    changeWeek(offset) {
      const currentIndex = this.weekOptions.indexOf(this.selectedWeek);
      const nextIndex = currentIndex + offset;

      if (nextIndex >= 0 && nextIndex < this.weekOptions.length) {
        this.selectedWeek = this.weekOptions[nextIndex];
        this.currentPage = 1;
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    goToPageByDay(page) {
      if (page >= 1 && page <= this.totalPagesByDay) {
        this.currentPage = page;
      }
    },
    getRowSpan(menus, dayOfWeek) {
      return menus.filter((menu) => menu.day_of_week === dayOfWeek).length;
    },
    selectWeek(week) {
      this.selectedWeek = week;
      this.currentPage = 1; // รีเซ็ตหน้ากลับไปหน้าแรกเมื่อเลือกสัปดาห์ใหม่
    },

    search() {
      this.currentPage = 1; // รีเซ็ตไปหน้าแรกเมื่อทำการค้นหาใหม่
    },
    clearSearch() {
      this.searchQuery = ""; // เคลียร์คำค้นหาหลังจากกดปุ่ม close
    },
    //   const filtered = this.setupMenus.filter((menu) => {
    //     const matchesSearch = menu.id.toString().includes(this.searchQuery);
    //     // const matchesPromotionType = this.selectedMealType.length === 0 || this.selectedMealType.includes(menu.meal_type_id);
    //     return matchesSearch;
    //   });
    //   this.currentPage = 1;
    //   this.filteredSetupMenu = filtered;
    //   this.updatePage();
    // },
    // clearSearch() {
    //   this.searchQuery = '';
    //   this.search();
    // },

    // updatePage() {
    //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    //   const endIndex = startIndex + this.itemsPerPage;

    //   this.filteredSetupMenu = this.setupMenus.filter((menu) => {
    //     const matchesSearch = menu.id.toString().includes(this.searchQuery);
    //     // const matchesProgram = this.selectedProgram.length === 0 || this.selectedProgram.includes(packaged.program_id);
    //     return matchesSearch;
    //   }).slice(startIndex, endIndex);
    // },

    openAddModal() {
      this.isAddModalOpen = true;
    },
    async addMenus() {
      try {
        const menus = this.formRows
          .map((row) => row.selectedMenus.map((menu) => ({ menu_id: menu.id })))
          .flat();
        if (!this.day_of_week && menus.length === 0) {
          this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
          return;
        }
        if (!this.day_of_week) {
          this.showErrorToastNotification("กรุณากรอกลำดับวัน!");
          return;
        }
        if (menus.length === 0) {
          this.showErrorToastNotification("กรุณาเลือกเมนู!");
          return;
        }

        await axios.post("http://127.0.0.1:3333/setup-menu-fl", {
          day_of_week: this.day_of_week,
          menus: menus,
        });

        // console.log('Response:', response); // ตรวจสอบการตอบกลับจาก API
        this.clearForm();
        this.closeAddModal();

        await this.fetchSetupMenus();
        await this.fetchMenusByDay();

        this.showSuccessToastNotification("บันทึกข้อมูลสำเร็จ!");
      } catch (error) {
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการบันทึกข้อมูล!");
      }
    },
    addRow() {
      this.formRows.push({ selectedMealType: null, selectedMenus: [] });
    },
    removeRow(index) {
      this.formRows.splice(index, 1);
    },
    clearForm() {
      this.formRows = [{ selectedMealType: null, selectedMenus: [] }];
    },
    closeAddModal() {
      this.isAddModalOpen = false;
      this.clearForm();
    },

    openEditModal(menu) {
      const selectedMenu = this.menus.find((m) => m.id === menu.menu_id) || {};

      this.selectedSetupMenu = {
        ...menu,
        menu_id: selectedMenu
          ? { id: selectedMenu.id, name_thai: selectedMenu.name_thai }
          : null,
        meal_type_id:
          this.meal_types.find((mt) => mt.id === selectedMenu.meal_type_id) ||
          null,
      };

      this.isEditModalOpen = true;
    },
    async saveChanges() {
      try {
        if (
          !this.selectedSetupMenu.day_of_week &&
          !this.selectedSetupMenu.menu_id
        ) {
          this.showErrorToastNotification("กรุณากรอกข้อมูลให้ครบถ้วน!");
          return;
        }
        if (!this.selectedSetupMenu.day_of_week) {
          this.showErrorToastNotification("กรุณากรอกลำดับวัน!");
          return;
        }
        if (!this.selectedSetupMenu.menu_id) {
          this.showErrorToastNotification("กรุณาเลือกเมนู!");
          return;
        }

        await axios.put(
          `http://127.0.0.1:3333/setup-menu-fl/${this.selectedSetupMenu.id}`,
          {
            day_of_week: this.selectedSetupMenu.day_of_week,
            menu_id: this.selectedSetupMenu.menu_id.id,
          }
        );

        // const response = await axios.put(`http://127.0.0.1:3333/setup-menu-fl/${this.selectedSetupMenu.id}`, {
        //   day_of_week: this.selectedSetupMenu.day_of_week,
        //   menu_id: this.selectedSetupMenu.menu_id.id,
        // });

        // const index = this.menus.findIndex(menu => menu.id === this.selectedMenu.id);
        // if (index !== -1) {
        //     this.menus[index] = {
        //         ...response.data,
        //         mealType: this.meal_types.find(mt => mt.id === response.data.meal_type_id) || {},
        //     };
        // }
        this.isEditModalOpen = false;

        await this.fetchSetupMenus();
        await this.fetchMenusByDay();

        this.showSuccessToastNotification("แก้ไขข้อมูลสำเร็จ!");
      } catch (error) {
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการแก้ไขข้อมูล!");
      }
    },
    closeEditModal() {
      this.isEditModalOpen = false;
      this.selectedSetupMenu = {};
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
        await axios.delete(
          `http://127.0.0.1:3333/setup-menu-fl/${this.itemToDelete}`
        );
        this.menus = this.menus.filter((item) => item.id !== this.itemToDelete);
        this.closeDeleteModal();
        await this.fetchSetupMenus();
        await this.fetchMenusByDay();
        this.showFailToastNotification("ลบข้อมูลสำเร็จ!");
      } catch (error) {
        console.error("Error deleting item:", error);
        this.showErrorToastNotification("เกิดข้อผิดพลาดในการลบข้อมูล!");
      }
    },
  },
  created() {
    // this.filteredMenu = this.setupMenus;
    // this.sortData('id');
    this.fetchSetupMenus();
    this.fetchLookupData();
    this.fetchSetupMenusForToday();
    this.fetchStartDate();
    this.fetchMenusByDay();

    // this.updatePage();
  },
  mounted() {
    this.fetchSetupMenus();
    this.fetchLookupData();
    this.fetchSetupMenusForToday();
    this.fetchStartDate();

    const today = new Date();
    this.selectedDate = today.toISOString().split("T")[0];
    this.fetchMenusByDay();

    this.$nextTick(() => {
      flatpickr(this.$refs.startDate, {
        dateFormat: "Y-m-d",
        defaultDate: this.initialStartDate,
        onChange: (selectedDates, dateStr) => {
          this.startDate = dateStr;
        },
      });

      flatpickr(this.$refs.selectedDatePicker, {
        dateFormat: "Y-m-d",
        defaultDate: today,
        onChange: (selectedDates, dateStr) => {
          this.selectedDate = dateStr;
          this.fetchMenusByDay();
        },
      });
    });
  },
  watch: {
    selectedWeek() {
      this.currentPage = 1;
    },
    selectedDate() {
      this.currentPage = 1;
    },
    viewMode() {
      this.currentPage = 1;
    },
    startDate(newValue) {
      if (newValue !== this.initialStartDate) {
        this.isDateConfirmed = false;  // ถ้าค่าที่เลือกไม่เหมือนกับค่าเริ่มต้น ปุ่มยืนยันจะแสดง
      }
    },
  },
};
</script>

<style scoped>
/* ไม่จำเป็นต้องใช้ CSS เพิ่มเติมหากใช้ TailwindCSS */
</style>
