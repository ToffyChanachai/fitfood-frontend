const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.PORT || 8080, // ใช้พอร์ตที่กำหนดใน ENV หรือพอร์ต 8080
  }
})
