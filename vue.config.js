const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    disableHostCheck: true,
    allowedHosts: 'all',  // ยอมรับทุก Host header
    public: 'https://fitfood-frontend-production.up.railway.app' // หรือโดเมนของคุณถ้ามี
  }
})
