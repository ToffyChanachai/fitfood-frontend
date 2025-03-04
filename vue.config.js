const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://fitfood-backend.onrender.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',  // ลบ "/api" ออกก่อนส่งคำขอไปที่ API
        },
      },
    },
  },
});
