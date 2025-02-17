<template>
  <div>
    <!-- ปุ่มพิมพ์ -->
    <vue-to-print :content="contentToPrint">
      <button>พิมพ์ข้อมูล</button>
    </vue-to-print>

    <!-- เนื้อหาที่ต้องการพิมพ์ -->
    <div ref="contentToPrint">
      <table>
        <tr>
          <th>หัวข้อ</th>
          <td>ข้อมูล</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import VueToPrint from 'vue-to-print';

export default {
  components: {
    VueToPrint
  },
  data() {
    return {
      contentToPrint: 'contentToPrint' // ใช้ ref ในการชี้ไปที่ element
    };
  }
};
</script>
