#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 启动时更新anonymous_token（Vercel 构建环境下跳过网络请求喵~）
  if (!process.env.VERCEL_ENV) {
    const generateConfig = require('./generateConfig')
    await generateConfig()
  }
  require('./server').serveNcmApi({
    checkVersion: true,
  })
}
start().catch((err) => {
  console.error('[FATAL] 启动失败:', err)
  process.exit(1)
})
