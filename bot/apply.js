// BOSS直聘 自动投递脚本：搜索岗位 → 逐个"立即沟通"→ 随机间隔 → 记录日志
// 用法：node apply.js [limit]   可选 limit 覆盖每日上限
// 前置：先跑 node login.js 完成扫码登录（登录态存在 bot/profile + state.json）
const { chromium } = require('playwright')
const fs = require('fs')
const cfg = require('./config.json')
const LOG = 'D:/deepskhaness/bot/log.txt'

const rand = (a, b) => a + Math.random() * (b - a)

;(async () => {
  const limitArg = parseInt(process.argv[2] || '', 10)
  const limit = Math.min(Number.isFinite(limitArg) ? limitArg : cfg.dailyLimit, cfg.dailyLimit)

  const ctx = await chromium.launchPersistentContext('D:/deepskhaness/bot/profile', {
    executablePath: 'C:/Users/admin/AppData/Local/360Chrome/Chrome/Application/360chrome.exe',
    headless: false,
  })
  const page = ctx.pages()[0] || (await ctx.newPage())
  try { await ctx.storageState({ path: 'D:/deepskhaness/bot/state.json' }) } catch (e) {}

  const url = cfg.url + encodeURIComponent(cfg.keyword) + (cfg.city ? '&city=' + cfg.city : '')
  console.log('OPEN', url)
  await page.goto(url, { timeout: 60000 })
  await page.waitForTimeout(6000)

  try { await page.screenshot({ path: 'D:/deepskhaness/bot/shot_list.png' }) } catch (e) {}

  const cards = await page.locator('.job-card-wrapper, .job-list-box .job-card, [class*=job-card], .job-primary').all()
  console.log('CARDS', cards.length)

  const n = Math.min(limit, cards.length)
  let applied = 0
  let skipped = 0
  for (let i = 0; i < n; i++) {
    try {
      const card = cards[i]
      const name = ((await card.locator('.job-name, [class*=job-name]').first().textContent().catch(() => '')) || '').trim()
      const company = ((await card.locator('.company-name, [class*=company-name], .boss-name').first().textContent().catch(() => '')) || '').trim()
      const btn = card.locator('button:has-text("立即沟通"), button:has-text("沟通"), .btn-startchat').first()
      if (await btn.count() > 0) {
        await btn.click({ timeout: 8000 })
        await page.waitForTimeout(800 + rand(0, 1500))
        const send = page.locator('button:has-text("发送"), .btn-send, [class*=send]').first()
        if (await send.count() > 0 && await send.isVisible().catch(() => false)) {
          await send.click({ timeout: 3000 }).catch(() => {})
        }
        applied++
        const line = new Date().toLocaleString('zh-CN') + ' | 已沟通 | ' + name + ' | ' + company
        fs.appendFileSync(LOG, line + '\n')
        console.log('APPLIED', i + 1, name, company)
      } else {
        skipped++
      }
    } catch (e) {
      skipped++
      console.log('SKIP', i + 1, e.message)
    }
    if (i < n - 1) {
      const wait = rand(cfg.intervalMinSec, cfg.intervalMaxSec) * 1000
      console.log('WAIT', Math.round(wait / 1000), 's')
      await page.waitForTimeout(wait)
    }
  }
  console.log('DONE applied=' + applied + ' skipped=' + skipped)
  await ctx.close()
})().catch((e) => { console.error('ERR', e.message); process.exit(1) })
