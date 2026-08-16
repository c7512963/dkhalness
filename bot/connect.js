// CDP 附加到已运行的 360 浏览器（--remote-debugging-port=9222 启动），读取 BOSS 登录态
// 用法：node connect.js
const { chromium } = require('playwright')
const fs = require('fs')

;(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
  const ctxs = browser.contexts()
  console.log('CONNECTED, contexts:', ctxs.length)
  let ctx = ctxs[0]
  // 找 zhipin 页面所在 context
  for (const c of ctxs) {
    const urls = c.pages().map((p) => p.url())
    if (urls.some((u) => u.includes('zhipin'))) { ctx = c; break }
  }
  const pages = ctx.pages()
  console.log('PAGES', pages.map((p) => p.url()).join('\n'))
  const zhipin = pages.find((p) => p.url().includes('zhipin'))
  if (!zhipin) {
    console.log('NO_ZHIPIN 未找到 BOSS 页面，请先打开 https://www.zhipin.com/ 再运行')
    await browser.close()
    return
  }
  // 确认登录态：尝试读取页面关键元素
  await zhipin.bringToFront()
  await zhipin.waitForTimeout(2000)
  const html = await zhipin.content().catch(() => '')
  const logged = html.includes('立即沟通') || html.includes('我的') || html.includes('zhipin.com/web/user')
  console.log('LOGGED_IN?', logged ? '是' : '否（可能未登录，请先在窗口里登录）')
  // 读 cookie 保存
  const cookies = await ctx.cookies('https://www.zhipin.com').catch(() => [])
  fs.writeFileSync('D:/deepskhaness/bot/cookies.json', JSON.stringify(cookies, null, 2))
  console.log('COOKIES_SAVED', cookies.length)
  await browser.close()
})().catch((e) => { console.error('ERR', e.message); process.exit(1) })
