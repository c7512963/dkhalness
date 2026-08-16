// 青花瓷界面客户端插件（theme 令牌 + 装饰 + 匾额 + 灵签）
// 用法：作为 cordis_define 的 code.client（函数体字符串），idPrefix 'xinx'
return {
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    const theme = ctx.get('theme')
    if (theme) {
      ctx.effect(() => theme.overrideTokens('xianxia-bluewhite', {
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
      }))
    }

    styles.insert(`
.xx-decor{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}
.xx-bg{position:absolute;inset:0}
.xx-pattern{position:absolute;inset:0;width:100%;height:100%}
.xx-huiwen{position:absolute;top:0;left:0;width:100%;height:24px}
.xx-mountains{position:absolute;left:0;right:0;bottom:0;width:100%;height:120px}
.xx-waves{position:absolute;left:0;right:0;bottom:0;width:100%;height:90px}
.xx-cloud{position:absolute;border-radius:50%;background:#1e5aa8;filter:blur(12px);opacity:.10}
.xx-cloud-1{width:230px;height:48px;top:10%;left:-12%;animation:xx-drift 70s linear infinite}
.xx-cloud-2{width:170px;height:36px;top:24%;left:-8%;opacity:.08;animation:xx-drift 100s linear infinite;animation-delay:-40s}
.xx-cloud-3{width:130px;height:28px;top:6%;right:-10%;opacity:.09;animation:xx-drift 85s linear infinite;animation-delay:-20s;animation-direction:reverse}
@keyframes xx-drift{from{transform:translateX(0)}to{transform:translateX(135vw)}}
.xx-sword{position:absolute;top:16%;left:-20%;width:38%;height:2px;background:linear-gradient(90deg,transparent,#1e5aa8,transparent);opacity:0;animation:xx-sweep 26s ease-in-out infinite}
@keyframes xx-sweep{0%,68%{opacity:0;transform:translateX(0) rotate(6deg)}76%{opacity:.5}88%{opacity:.15;transform:translateX(230%) rotate(-8deg)}100%{opacity:0;transform:translateX(230%) rotate(-8deg)}}
.xx-vine{position:absolute;width:130px;height:130px;opacity:.5}
.xx-vine-tl{top:26px;left:12px}
.xx-vine-br{bottom:34px;right:12px;transform:rotate(180deg)}
.xx-plaque{position:fixed;top:9px;left:50%;transform:translateX(-50%);z-index:80;pointer-events:auto;display:flex;align-items:center;gap:8px;background:radial-gradient(circle at 30% 25%,#ffffff,#e9eff8);border:2px solid #1e5aa8;outline:1px solid rgba(30,90,168,.35);outline-offset:2px;border-radius:10px;padding:4px 16px 4px 14px;box-shadow:0 2px 10px rgba(27,47,78,.18);cursor:pointer;font-family:'STKaiti','KaiTi',serif}
.xx-plaque:hover{border-color:#16427e}
.xx-plaque-t{color:#16427e;font-size:15px;letter-spacing:6px}
.xx-plaque-seal{width:16px;height:16px;border-radius:3px;background:#1e5aa8;color:#f7fafd;font-size:11px;line-height:16px;text-align:center;flex:none}
.xx-seal{width:30px;height:30px;border-radius:7px;background:#1e5aa8;color:#f7fafd;border:0;cursor:pointer;font-family:'STKaiti','KaiTi',serif;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(30,90,168,.3)}
.xx-seal:hover{background:#16427e;transform:scale(1.06)}
.xx-mask{position:fixed;inset:0;background:rgba(15,26,46,.30);display:flex;align-items:center;justify-content:center;z-index:120;pointer-events:auto}
.xx-slip{width:min(340px,82vw);background:radial-gradient(circle at 20% 15%,#ffffff,#eef3fa);border:2px solid #5b8fd4;border-radius:12px;padding:22px 26px;box-shadow:0 14px 44px rgba(15,26,46,.30);pointer-events:auto;text-align:center;font-family:'STKaiti','KaiTi',serif}
.xx-slip-head{color:#16427e;font-size:20px;letter-spacing:8px;border-bottom:1px dashed #b9cbe4;padding-bottom:10px;margin-bottom:14px}
.xx-slip-line{color:#1b2f4e;font-size:17px;line-height:1.95;min-height:64px;padding:6px 0}
.xx-slip-foot{display:flex;gap:10px;justify-content:center;margin-top:12px}
.xx-slip-btn{padding:6px 16px;border:0;border-radius:6px;background:#1e5aa8;color:#f7fafd;cursor:pointer;font-size:13px;font-family:'STKaiti','KaiTi',serif}
.xx-slip-btn:hover{background:#16427e}
.xx-slip-btn-ghost{background:transparent;border:1px solid #b9cbe4;color:#5a6f8c}
`)

    const el = React.createElement
    const LINES = [
      '今日宜参悟，忌走火入魔。', '三转重元，功到自然成。', '青元剑诀在手，何惧前路。',
      '闭关三载，只为元婴。', '灵石虽小，积少成多。', '道心坚定，外魔不侵。',
      '机缘将至，莫要心急。', '静坐观想，天地灵气自来。', '丹炉火候未到，再等片刻。',
      '天衍四九，人遁其一。', '御剑乘风，心随剑走。', '万卷道藏，不如一悟。',
      '虚名如浮云，实力才是真。', '金丹大道，一步一个脚印。', '莫问前路，只管修行。',
      '灵根虽有优劣，勤能补拙。', '大道三千，条条可证。', '笑看风云，我自修行。',
    ]
    const PLAQUES = ['问 道', '修 真', '悟 道', '御 剑', '丹 心', '云 游']
    const rand = () => LINES[Math.floor(Math.random() * LINES.length)]
    const store = { open: false, line: rand(), plaque: 0 }
    const subs = new Set()
    const emit = () => subs.forEach((f) => f())
    const subscribe = (f) => { subs.add(f); return () => subs.delete(f) }
    const openSlip = () => { store.open = true; store.line = rand(); emit() }
    const closeSlip = () => { store.open = false; emit() }
    const rePick = () => { store.line = rand(); emit() }
    const cyclePlaque = () => { store.plaque = (store.plaque + 1) % PLAQUES.length; emit() }

    const petals = []
    for (let i = 0; i < 6; i++) {
      petals.push(el('ellipse', { cx: 60, cy: 44, rx: 6.5, ry: 11, fill: 'none', stroke: '#1e5aa8', 'stroke-width': 1.3, transform: 'rotate(' + (i * 60) + ' 60 60)' }))
    }

    function SealButton() {
      const [, force] = React.useState(0)
      React.useEffect(() => subscribe(() => force((n) => n + 1)), [])
      return el('button', {
        className: 'xx-seal',
        title: store.open ? '收签' : '求一签',
        onClick: () => (store.open ? closeSlip() : openSlip()),
      }, '签')
    }

    function XianxiaDecor() {
      const [, force] = React.useState(0)
      React.useEffect(() => subscribe(() => force((n) => n + 1)), [])
      return el('div', { className: 'xx-decor' },
        el('div', { className: 'xx-bg' },
          el('svg', { className: 'xx-pattern', 'aria-hidden': true },
            el('defs', null, el('pattern', { id: 'xxFlowerP', width: '120', height: '120', patternUnits: 'userSpaceOnUse' },
              el('g', { opacity: 0.55 }, petals, el('circle', { cx: 60, cy: 60, r: 3.6, fill: '#1e5aa8' })))),
            el('rect', { width: '100%', height: '100%', fill: 'url(#xxFlowerP)', opacity: 0.09 })),
          el('svg', { className: 'xx-huiwen', viewBox: '0 0 1440 24', preserveAspectRatio: 'none', 'aria-hidden': true },
            el('defs', null, el('pattern', { id: 'xxHuiwenP', width: '20', height: '20', patternUnits: 'userSpaceOnUse' },
              el('path', { d: 'M1 1 H19 V19 H1 Z M5 5 H15 V15 H5 Z M9 9 H11 V11 H9 Z', fill: 'none', stroke: '#1e5aa8', 'stroke-width': '1.3' }))),
            el('rect', { width: '100%', height: '24', fill: 'url(#xxHuiwenP)', opacity: 0.4 })),
          el('svg', { className: 'xx-mountains', viewBox: '0 0 1440 200', preserveAspectRatio: 'none', 'aria-hidden': true },
            el('path', { d: 'M0 200 L0 148 Q120 88 240 128 Q360 58 480 118 Q600 76 720 138 Q840 66 960 108 Q1080 88 1200 148 Q1320 96 1440 128 L1440 200 Z', fill: '#1e5aa8', opacity: 0.07 }),
            el('path', { d: 'M0 200 L0 168 Q200 118 380 162 Q560 128 760 168 Q1000 138 1200 174 Q1320 148 1440 168 L1440 200 Z', fill: '#1e5aa8', opacity: 0.05 })),
          el('svg', { className: 'xx-waves', viewBox: '0 0 1440 90', preserveAspectRatio: 'none', 'aria-hidden': true },
            el('path', { d: 'M0 55 Q 36 20 72 55 T 144 55 T 216 55 T 288 55 T 360 55 T 432 55 T 504 55 T 576 55 T 648 55 T 720 55 T 792 55 T 864 55 T 936 55 T 1008 55 T 1080 55 T 1152 55 T 1224 55 T 1296 55 T 1368 55 T 1440 55 V90 H0 Z', fill: '#1e5aa8', opacity: 0.05 }),
            el('path', { d: 'M0 70 Q 36 40 72 70 T 144 70 T 216 70 T 288 70 T 360 70 T 432 70 T 504 70 T 576 70 T 648 70 T 720 70 T 792 70 T 864 70 T 936 70 T 1008 70 T 1080 70 T 1152 70 T 1224 70 T 1296 70 T 1368 70 T 1440 70 V90 H0 Z', fill: '#1e5aa8', opacity: 0.09 })),
          el('svg', { className: 'xx-vine xx-vine-tl', viewBox: '0 0 130 130', 'aria-hidden': true },
            el('path', { d: 'M0 104 C 28 104, 44 90, 52 72 C 60 52, 56 30, 74 22 C 92 14, 112 18, 128 6', fill: 'none', stroke: '#1e5aa8', 'stroke-width': '3', opacity: 0.45, 'stroke-linecap': 'round' }),
            el('circle', { cx: 52, cy: 70, r: 4, fill: '#1e5aa8', opacity: 0.45 }),
            el('circle', { cx: 76, cy: 26, r: 5, fill: '#1e5aa8', opacity: 0.45 }),
            el('circle', { cx: 100, cy: 12, r: 3, fill: '#1e5aa8', opacity: 0.45 })),
          el('svg', { className: 'xx-vine xx-vine-br', viewBox: '0 0 130 130', 'aria-hidden': true },
            el('path', { d: 'M0 104 C 28 104, 44 90, 52 72 C 60 52, 56 30, 74 22 C 92 14, 112 18, 128 6', fill: 'none', stroke: '#1e5aa8', 'stroke-width': '3', opacity: 0.45, 'stroke-linecap': 'round' }),
            el('circle', { cx: 52, cy: 70, r: 4, fill: '#1e5aa8', opacity: 0.45 }),
            el('circle', { cx: 76, cy: 26, r: 5, fill: '#1e5aa8', opacity: 0.45 }),
            el('circle', { cx: 100, cy: 12, r: 3, fill: '#1e5aa8', opacity: 0.45 })),
          el('div', { className: 'xx-cloud xx-cloud-1' }),
          el('div', { className: 'xx-cloud xx-cloud-2' }),
          el('div', { className: 'xx-cloud xx-cloud-3' }),
          el('div', { className: 'xx-sword' })),
        el('div', { className: 'xx-plaque', onClick: cyclePlaque, title: '点我换匾额' },
          el('span', { className: 'xx-plaque-t' }, PLAQUES[store.plaque]),
          el('span', { className: 'xx-plaque-seal' }, '道')),
        store.open && el('div', { className: 'xx-mask', onClick: closeSlip },
          el('div', { className: 'xx-slip', onClick: (e) => e.stopPropagation() },
            el('div', { className: 'xx-slip-head' }, '灵 签'),
            el('div', { className: 'xx-slip-line' }, store.line),
            el('div', { className: 'xx-slip-foot' },
              el('button', { className: 'xx-slip-btn', onClick: rePick }, '再求一签'),
              el('button', { className: 'xx-slip-btn xx-slip-btn-ghost', onClick: closeSlip }, '收签')))))
    }

    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'xianxia-decor', order: -1000 },
      () => el(XianxiaDecor, null)
    ))
    slots.inject('sidebar.footer.action', () => slots.register(
      { name: 'sidebar.footer.action', id: 'xianxia-seal', order: 10 },
      () => el(SealButton, null)
    ))
  },
}
