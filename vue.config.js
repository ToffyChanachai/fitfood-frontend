const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    disableHostCheck: true, // ยอมรับทุก Host header
    public: 'https://<your-project-name>.up.railway.app' // หรือโดเมนของคุณถ้ามี
  }
})
