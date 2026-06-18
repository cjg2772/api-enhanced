// Serverless 入口 + 本地开发通用入口

const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

// 确保 anonymous_token 文件存在（util/request.js 加载时需要读取）
if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
  fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
}

const { constructServer } = require('./server')
const generateConfig = require('./generateConfig')

// Serverless 懒加载
let app = null

module.exports = async (req, res) => {
  if (!app) {
    await generateConfig()
    app = await constructServer()
  }
  return app(req, res)
}

// Vercel判定
if (!process.env.VERCEL) {
  require('./app.js')
}
