const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    disableHostCheck: true,  // ยอมรับทุก Host header
    allowedHosts: 'all',     // อนุญาตให้เข้าถึงจากทุกๆ host
    host: '0.0.0.0',         // หรือระบุ host ที่คุณต้องการ เช่น 'localhost' หรือ '0.0.0.0'
    port: 8080,              // กำหนดพอร์ตที่ต้องการใช้
    https: false             // ถ้าคุณไม่ต้องการใช้ HTTPS
  }
})
