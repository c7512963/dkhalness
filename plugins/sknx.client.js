// 皮肤库切换（客户端）：🎨 按钮 → 6 套配色皮肤（青花瓷/水墨/暗夜玻璃/雾蓝/松石/暖阳）一键切换，
// localStorage 记忆选择，重启自动恢复。idPrefix 'sknx'
// 用 theme.overrideTokens（theme 是客户端服务，ctx.get('theme')）；切换时先 dispose 旧皮肤。
return {
  apply(ctx) {
    const slots = ctx.get('slots')
    if (!slots) return
    const theme = ctx.get('theme')
    if (!theme) return

    styles.insert(`
.skn-dock{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(63,90,72,.4);background:rgba(255,253,247,.85);color:#3f5a48;border-radius:999px;padding:5px 13px;font-size:13px;cursor:pointer;box-shadow:0 1px 4px rgba(60,70,60,.08)}
.skn-dock:hover{background:#eef2ec}
.skn-panel{position:fixed;inset:0;z-index:9994;background:rgba(40,50,45,.4);display:flex;align-items:center;justify-content:center}
.skn-card{width:min(720px,92vw);max-height:min(600px,86vh);overflow:auto;background:linear-gradient(180deg,#f8f4ec 0%,#f2ebda 100%);border-radius:14px;padding:16px;box-shadow:0 16px 60px rgba(30,40,35,.4)}
.skn-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.skn-title{font-weight:600;font-size:15px;color:#3a463f;flex:1}
.skn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.skn-item{border:2px solid rgba(80,95,80,.18);border-radius:12px;padding:10px;background:rgba(255,253,247,.8);cursor:pointer;text-align:left;font-family:inherit}
.skn-item:hover{border-color:#3f5a48}
.skn-item.on{border-color:#1e5aa8;box-shadow:0 2px 10px rgba(30,90,168,.25)}
.skn-swatch{display:flex;height:34px;border-radius:8px;overflow:hidden;margin-bottom:8px}
.skn-swatch i{flex:1}
.skn-item b{display:block;font-size:13.5px;color:#3a463f;margin-bottom:2px}
.skn-item span{display:block;font-size:11.5px;color:#8a94ad}
`)

    const el = React.createElement
    const KEY = 'dsh-skin'
    const SKINS = {
      qinghua: { name: '青花瓷', desc: '蓝白瓷韵 · 缠枝纹', colors: ['#1e5aa8', '#f1f5fa', '#5b8fd4', '#eaf1f9'], tokens: {
          '--dsw-alias-bg-base': { light: '#f1f5fa', dark: '#0f1a2e' },
          '--dsw-alias-bg-layer-1': { light: '#fbfdff', dark: '#182845' },
          '--dsw-alias-bg-layer-2': { light: '#eef4fb', dark: '#20324f' },
          '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#16233c' },
          '--dsw-alias-border-l1': { light: '#c6d8ee', dark: '#2c4270' },
          '--dsw-alias-border-l2': { light: '#5b8fd4', dark: '#4a73b0' },
          '--dsw-alias-brand-primary': { light: '#1e5aa8', dark: '#5b8fd4' },
          '--dsw-alias-label-primary': { light: '#1b2f4e', dark: '#e2eaf6' },
          '--dsw-alias-label-secondary': { light: '#5a6f8c', dark: '#a9bcd8' },
          '--dsw-alias-state-error-primary': { light: '#b5453a', dark: '#d97a6c' },
          '--dsw-alias-state-success-primary': { light: '#2f7d5b', dark: '#5fae85' },
          '--dsw-alias-state-warn-primary': { light: '#c08a2e', dark: '#d9a94e' },
          '--dsw-specific-sidebar-fill': { light: '#eaf1f9', dark: '#111d33' },
      }},
      shuimo: { name: '水墨', desc: '宣纸墨韵 · 远山', colors: ['#3a463f', '#f8f4ec', '#8a94ad', '#e6ece2'], tokens: {
          '--dsw-alias-bg-base': { light: '#f4f1ea', dark: '#171c18' },
          '--dsw-alias-bg-layer-1': { light: '#fbf9f3', dark: '#20261f' },
          '--dsw-alias-bg-layer-2': { light: '#eae6db', dark: '#2a332a' },
          '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#1b211b' },
          '--dsw-alias-border-l1': { light: '#d6d0c0', dark: '#3a443a' },
          '--dsw-alias-border-l2': { light: '#8a94ad', dark: '#5a675a' },
          '--dsw-alias-brand-primary': { light: '#3f5a48', dark: '#7fa588' },
          '--dsw-alias-label-primary': { light: '#2e3a31', dark: '#dde6dd' },
          '--dsw-alias-label-secondary': { light: '#66705f', dark: '#a0afa0' },
          '--dsw-alias-state-error-primary': { light: '#b0442e', dark: '#d97a62' },
          '--dsw-alias-state-success-primary': { light: '#3f7a55', dark: '#67a57f' },
          '--dsw-alias-state-warn-primary': { light: '#b08a2e', dark: '#d4a94e' },
          '--dsw-specific-sidebar-fill': { light: '#efebe1', dark: '#1c221c' },
      }},
      nightglass: { name: '暗夜玻璃', desc: '深色磨砂玻璃', colors: ['#6f8dfc', '#0d1424', '#a9b8e8', '#182238'], tokens: {
          '--dsw-alias-bg-base': { light: '#eef1f8', dark: '#0d1424' },
          '--dsw-alias-bg-layer-1': { light: '#f7f9ff', dark: '#131c30' },
          '--dsw-alias-bg-layer-2': { light: '#e2e8f5', dark: '#1b2640' },
          '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#101a2e' },
          '--dsw-alias-border-l1': { light: '#c3cdea', dark: '#2c3a5e' },
          '--dsw-alias-border-l2': { light: '#6f8dfc', dark: '#5d7ae8' },
          '--dsw-alias-brand-primary': { light: '#3457d5', dark: '#6f8dfc' },
          '--dsw-alias-label-primary': { light: '#1c2a4d', dark: '#e2e8fb' },
          '--dsw-alias-label-secondary': { light: '#5d6b8f', dark: '#a9b8e8' },
          '--dsw-alias-state-error-primary': { light: '#c2453a', dark: '#e07a6f' },
          '--dsw-alias-state-success-primary': { light: '#2e7d5b', dark: '#5fae85' },
          '--dsw-alias-state-warn-primary': { light: '#c08a2e', dark: '#d9a94e' },
          '--dsw-specific-sidebar-fill': { light: '#e6ebf8', dark: '#0f1830' },
      }},
      mist: { name: '雾蓝', desc: '浅蓝灰 · 轻透', colors: ['#7ba7d9', '#eef3f9', '#b9d2ec', '#e2ecf7'], tokens: {
          '--dsw-alias-bg-base': { light: '#eef3f9', dark: '#101b2c' },
          '--dsw-alias-bg-layer-1': { light: '#f7fafd', dark: '#16243a' },
          '--dsw-alias-bg-layer-2': { light: '#e2ecf7', dark: '#1e3048' },
          '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#121f33' },
          '--dsw-alias-border-l1': { light: '#c9dcf0', dark: '#2c4470' },
          '--dsw-alias-border-l2': { light: '#7ba7d9', dark: '#4e7cb8' },
          '--dsw-alias-brand-primary': { light: '#3a6fb5', dark: '#7ba7d9' },
          '--dsw-alias-label-primary': { light: '#213a5e', dark: '#dbe7f6' },
          '--dsw-alias-label-secondary': { light: '#5a7394', dark: '#a3bddb' },
          '--dsw-alias-state-error-primary': { light: '#b5453a', dark: '#d97a6c' },
          '--dsw-alias-state-success-primary': { light: '#2f7d5b', dark: '#5fae85' },
          '--dsw-alias-state-warn-primary': { light: '#c08a2e', dark: '#d9a94e' },
          '--dsw-specific-sidebar-fill': { light: '#e4eef9', dark: '#0f1a2e' },
      }},
      turquoise: { name: '松石', desc: '绿松石 · 清爽', colors: ['#1f9d8a', '#eef8f5', '#7fd1c4', '#e0f3ef'], tokens: {
          '--dsw-alias-bg-base': { light: '#eef8f5', dark: '#0e1f1c' },
          '--dsw-alias-bg-layer-1': { light: '#f7fcfb', dark: '#142a25' },
          '--dsw-alias-bg-layer-2': { light: '#e0f3ef', dark: '#1c3731' },
          '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#11241f' },
          '--dsw-alias-border-l1': { light: '#bfe5de', dark: '#2b4d45' },
          '--dsw-alias-border-l2': { light: '#1f9d8a', dark: '#3fb5a2' },
          '--dsw-alias-brand-primary': { light: '#17826f', dark: '#4fc4b0' },
          '--dsw-alias-label-primary': { light: '#163b33', dark: '#d8efe9' },
          '--dsw-alias-label-secondary': { light: '#4f7a70', dark: '#9cc7be' },
          '--dsw-alias-state-error-primary': { light: '#b5453a', dark: '#d97a6c' },
          '--dsw-alias-state-success-primary': { light: '#2f7d5b', dark: '#5fae85' },
          '--dsw-alias-state-warn-primary': { light: '#c08a2e', dark: '#d9a94e' },
          '--dsw-specific-sidebar-fill': { light: '#e2f4f0', dark: '#0d1c18' },
      }},
      warm: { name: '暖阳', desc: '米黄暖色 · 晨光', colors: ['#d97f3d', '#faf3e6', '#efc48e', '#f6ead2'], tokens: {
          '--dsw-alias-bg-base': { light: '#faf3e6', dark: '#201a12' },
          '--dsw-alias-bg-layer-1': { light: '#fffaf1', dark: '#2a2216' },
          '--dsw-alias-bg-layer-2': { light: '#f6ead2', dark: '#38301f' },
          '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#241d13' },
          '--dsw-alias-border-l1': { light: '#ead9bc', dark: '#4a3f2a' },
          '--dsw-alias-border-l2': { light: '#d97f3d', dark: '#c07a3e' },
          '--dsw-alias-brand-primary': { light: '#b05f24', dark: '#efc48e' },
          '--dsw-alias-label-primary': { light: '#4a341d', dark: '#f3e7d2' },
          '--dsw-alias-label-secondary': { light: '#8a6f4f', dark: '#cfb896' },
          '--dsw-alias-state-error-primary': { light: '#b5453a', dark: '#d97a6c' },
          '--dsw-alias-state-success-primary': { light: '#2f7d5b', dark: '#5fae85' },
          '--dsw-alias-state-warn-primary': { light: '#c08a2e', dark: '#d9a94e' },
          '--dsw-specific-sidebar-fill': { light: '#f7eeda', dark: '#1d170e' },
      }},
    }

    let currentDisposer = null
    const applySkin = (id) => {
      const skin = SKINS[id]
      if (!skin) return
      if (currentDisposer) { try { currentDisposer() } catch (e) {} currentDisposer = null }
      currentDisposer = theme.overrideTokens('skn-' + id, skin.tokens)
      try { localStorage.setItem(KEY, id) } catch (e) {}
    }

    function SkinPanel({ onClose }) {
      const [current, setCurrent] = React.useState(() => { try { return localStorage.getItem(KEY) || 'qinghua' } catch (e) { return 'qinghua' } })
      const pick = (id) => { applySkin(id); setCurrent(id) }
      const renderSkin = (id) => {
        const s = SKINS[id]
        return el('button', { key: id, className: 'skn-item' + (current === id ? ' on' : ''), onClick: () => pick(id) },
          el('div', { className: 'skn-swatch' }, s.colors.map((c, i) => el('i', { key: i, style: { background: c } }))),
          el('b', null, (current === id ? '✓ ' : '') + s.name),
          el('span', null, s.desc))
      }
      return el('div', { className: 'skn-panel', onClick: (e) => { if (e.target === e.currentTarget) onClose() } },
        el('div', { className: 'skn-card' },
          el('div', { className: 'skn-head' },
            el('span', { className: 'skn-title' }, '🎨 皮肤库（线上皮肤项目配色 + 自研）'),
            el('button', { className: 'skn-dock', onClick: onClose }, '✕ 关闭')),
          el('div', { className: 'skn-grid' }, Object.keys(SKINS).map(renderSkin))))
    }

    function SkinDock() {
      const [open, setOpen] = React.useState(false)
      return el('div', { style: { display: 'inline-block' } },
        el('button', { className: 'skn-dock', onClick: () => setOpen(true) }, '🎨 皮肤'),
        open && el(SkinPanel, { onClose: () => setOpen(false) }))
    }

    slots.inject('conversation.input.dock', () => slots.register(
      { name: 'conversation.input.dock', id: 'skn-dock', order: 110, label: '皮肤' },
      () => el(SkinDock, null)
    ))

    try {
      const saved = localStorage.getItem(KEY)
      if (saved && SKINS[saved]) applySkin(saved)
    } catch (e) {}
  },
}
