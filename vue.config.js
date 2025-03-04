const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', // ตั้งค่าให้เหมาะสมกับการ deploy
  devServer: {
    historyApiFallback: true, // รองรับการใช้ history mode ใน Vue Router
  },
})
