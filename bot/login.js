// BOSS直聘 登录脚本：弹出 Edge 窗口，用户扫码登录，登录成功后保存登录态
// 用法：node login.js   （在打开的浏览器窗口里扫码/登录，脚本自动检测并保存）
const { chromium } = require('playwright')

;(async () => {
  const ctx = await chromium.launchPersistentContext('D:/deepskhaness/bot/profile', {
    executablePath: 'C:/Users/admin/AppData/Local/360Chrome/Chrome/Application/360chrome.exe',
    headless: false,
  })
  const page = ctx.pages()[0] || (await ctx.newPage())
  console.log('LOGIN_WAIT 请在打开的 Edge 窗口里登录 BOSS直聘（推荐扫码登录）……')
  await page.goto('https://www.zhipin.com/', { timeout: 60000 })
  let ok = false
  for (let i = 0; i < 300; i++) {
    await page.waitForTimeout(2000)
    const url = page.url()
    let html = ''
    try { html = await page.content() } catch (e) {}
    if (url.includes('/web/geek') || html.includes('geek/chat') || html.includes('立即沟通') || (html.includes('职位') && html.includes('公司'))) {
      ok = true
      break
    }
  }
  await page.waitForTimeout(3000)
  try { await ctx.storageState({ path: 'D:/deepskhaness/bot/state.json' }) } catch (e) {}
  console.log(ok ? 'LOGIN_OK 登录成功，登录态已保存' : 'LOGIN_TIMEOUT 未检测到登录完成，登录态仍已保存（可重跑）')
  await ctx.close()
})().catch((e) => { console.error('ERR', e.message); process.exit(1) })
