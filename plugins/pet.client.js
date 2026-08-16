// 韩立宠物·客户端（2D 矢量御剑韩立 + 施法 + 心情系统）。配合 pet.host.js，idPrefix 'otter'
return {
  inject: ['timer'],
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    styles.insert(`
.otter-pet{position:fixed;z-index:9990;pointer-events:auto;user-select:none;font-family:system-ui,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif}
.otter-pet__stage{position:relative;width:180px;height:175px;cursor:grab;transform-origin:50% 100%}
.otter-pet__stage:active{cursor:grabbing}
.otter-pet__svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.otter-pet--happy .otter-pet__stage,.otter-pet--excited .otter-pet__stage{animation:op-jump .45s ease-in-out 2}
.otter-pet--sad .hl-head{animation:op-sad .6s ease-in-out 2}
.hl-fly{animation:hl-fly 3s ease-in-out infinite}
.hl-robe,.hl-sleeve-b,.hl-eye,.hl-brow{transform-box:fill-box}
.hl-robe{transform-origin:50% 100%;animation:hl-robe 3.4s ease-in-out infinite}
.hl-sleeve-b{transform-origin:50% 100%;animation:hl-sleeve 4.2s ease-in-out infinite}
.hl-glow{animation:hl-glow 2.6s ease-in-out infinite}
.hl-trail{animation:hl-trail 3.4s ease-in-out infinite}
.otter-pet--thinking .hl-fly{animation-duration:1.6s}
.otter-pet--working .hl-fly{animation-duration:.8s}
.otter-pet--working .hl-glow{animation-duration:1.1s}
.otter-pet--sleep .hl-fly{animation-duration:5.5s}
.otter-pet--sad .hl-fly{animation-duration:4s}
.otter-pet--casting .hl-fly{animation-duration:.55s}
.otter-pet--casting .hl-glow{animation-duration:.5s}
.otter-pet--casting .hl-mouth-neutral{display:none}
.otter-pet--casting .hl-mouth-happy{display:block}
.otter-pet--casting .otter-pet__stage{animation:op-cast .25s ease-in-out 3}
@keyframes op-cast{0%,100%{transform:translateX(0)}50%{transform:translateX(-3px) scale(1.02)}}
@keyframes hl-fly{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes hl-robe{0%,100%{transform:rotate(0)}50%{transform:rotate(-2.5deg)}}
@keyframes hl-sleeve{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(-3px,2px) rotate(-7deg)}}
@keyframes hl-glow{0%,100%{opacity:.22}50%{opacity:.45}}
@keyframes hl-trail{0%,100%{transform:translateX(0)}50%{transform:translateX(-5px)}}
.hl-eye{transform-origin:50% 60%;transition:transform .12s}
.otter-pet--sleep .hl-eye{transform:scaleY(.12)}
.otter-pet--happy .hl-eye{transform:scaleY(.4)}
.otter-pet--sad .hl-eye{transform:translateY(2px) scaleY(.9)}
.hl-mouth-happy,.hl-mouth-sad{display:none}
.otter-pet--happy .hl-mouth-neutral{display:none}
.otter-pet--happy .hl-mouth-happy{display:block}
.otter-pet--sad .hl-mouth-neutral{display:none}
.otter-pet--sad .hl-mouth-sad{display:block}
.otter-pet--sleep .hl-mouth-neutral{display:none}
.otter-pet--sleep .hl-mouth-happy{display:block}
.op-deco{position:absolute;pointer-events:none;opacity:0;animation:op-deco 2.4s ease-out forwards}
.op-deco--gem{left:30px;top:-6px;color:#2ecc71}
.op-deco--gem2{left:118px;top:0;color:#27ae60;animation-delay:.15s}
.op-deco--rune{left:22px;top:-8px;color:#d4af37}
.op-deco--rune2{left:100px;top:-14px;color:#e6c85a;animation-delay:.25s}
.op-deco--rune3{left:60px;top:-22px;color:#f0d878;animation-delay:.5s}
.op-deco--spark{left:24px;top:20px;color:#ffd166}
.op-deco--spark2{left:122px;top:14px;color:#ffd166;animation-delay:.2s}
.op-deco--sweat{left:132px;top:26px;color:#7fd0ff}
.op-deco--tear{left:120px;top:92px;color:#6fb6ff}
.op-deco--tear2{left:136px;top:96px;color:#6fb6ff;animation-delay:.2s}
.op-deco--cast{left:26px;top:-10px;color:#ffd166;font-size:18px}
.op-deco--cast2{left:100px;top:-16px;color:#d4af37;font-size:15px;animation-delay:.15s}
.op-deco--cast3{left:60px;top:-26px;color:#7de8ff;font-size:20px;animation-delay:.3s}
@keyframes op-deco{0%{opacity:0;transform:translateY(8px) scale(.6)}30%{opacity:1}100%{opacity:0;transform:translateY(-28px) scale(1.15)}}
.op-think{position:absolute;pointer-events:none;font-size:14px;opacity:.9;animation:op-think 2.2s ease-in-out infinite}
.op-think--1{left:22px;top:8px}
.op-think--2{left:118px;top:0;animation-delay:.7s;font-size:11px}
.op-think--3{left:64px;top:-10px;animation-delay:1.3s;font-size:17px}
.otter-pet--working .op-think{animation-duration:1.1s}
@keyframes op-think{0%{opacity:0;transform:translateY(6px)}30%{opacity:.95}100%{opacity:0;transform:translateY(-16px)}}
.op-sweat{position:absolute;right:22px;top:20px;font-size:14px;opacity:0;animation:op-think 1.8s ease-in-out .5s infinite}
.op-zzz{position:absolute;right:-4px;top:8px;color:#8ab6ff;font-size:15px;font-weight:700;opacity:0;animation:op-zzz 2.6s ease-in-out infinite}
.op-zzz--2{right:-20px;top:-2px;font-size:11px;animation-delay:.8s}
@keyframes op-zzz{0%{opacity:0;transform:translate(0,0)}35%{opacity:.9}100%{opacity:0;transform:translate(8px,-14px)}}
.op-bubble{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:8px;max-width:190px;width:max-content;padding:7px 11px;border-radius:12px;background:#fff;color:#2b3a67;font-size:12.5px;line-height:1.4;text-align:center;box-shadow:0 4px 14px rgba(43,58,103,.18);z-index:2}
.op-bubble::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#fff}
.otter-btns{position:absolute;top:-8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;opacity:0;transition:opacity .15s;z-index:3}
.otter-pet:hover .otter-btns{opacity:1}
.otter-btn{width:22px;height:22px;border:0;border-radius:50%;background:rgba(255,255,255,.94);box-shadow:0 2px 8px rgba(43,58,103,.22);cursor:pointer;font-size:11px;line-height:1;display:flex;align-items:center;justify-content:center;color:#4d6bfe}
.otter-btn:hover{background:#eaf1ff}
.otter-pill{position:fixed;right:20px;bottom:26px;padding:8px 13px;border-radius:999px;background:#fff;box-shadow:0 4px 14px rgba(43,58,103,.2);cursor:pointer;font-size:13px;color:#2b3a67;z-index:9990}
.otter-pill:hover{background:#eaf1ff}
`)

    const el = React.createElement
    const now = () => Date.now()
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const LINES = {
      idle: ['在修炼呢~', '闭关中……', '元婴期指日可待！', '今日灵石尚未炼……'],
      sleep: ['zzz…', '梦里在渡劫……'],
      thinking: ['让我参悟一下……', '这功法有点难……', '口诀就在嘴边了……'],
      working: ['御剑赶路中！', '丹炉火候刚好！', '别急，马上好！'],
      happy: ['嘿嘿，突破成功了！', '多谢道友！', '这丹药香得很！'],
      sad: ['呜……走火入魔了', '丹炉炸了……', '再试一次吧！'],
      excited: ['有新的机缘！', '天降灵宝！', '来了来了！'],
      casting: ['青元剑诀！', '大衍诀！', '罗烟步！', '三转重元功！', '惊雷变！'],
    }
    let nextDeco = 1

    function HanLiSVG() {
      return el('svg', { className: 'otter-pet__svg', viewBox: '0 0 220 210', 'aria-hidden': true },
        el('defs', null,
          el('linearGradient', { id: 'swordGrad', x1: '0', y1: '0', x2: '1', y2: '0' },
            el('stop', { offset: '0%', 'stop-color': '#3fae6a' }),
            el('stop', { offset: '100%', 'stop-color': '#2e8b57' }))),
        el('g', { className: 'hl-trail' },
          el('ellipse', { cx: 18, cy: 170, rx: 16, ry: 6, fill: '#ffffff', opacity: 0.55 }),
          el('ellipse', { cx: 40, cy: 178, rx: 10, ry: 4, fill: '#ffffff', opacity: 0.35 }),
          el('ellipse', { cx: 6, cy: 160, rx: 9, ry: 4, fill: '#ffffff', opacity: 0.4 }),
          el('path', { d: 'M44 152 L122 142', stroke: '#d7f0ff', 'stroke-width': 5, opacity: 0.35, 'stroke-linecap': 'round' })),
        el('g', { className: 'hl-fly' },
          el('ellipse', { className: 'hl-glow', cx: 108, cy: 146, rx: 95, ry: 13, fill: '#7ddb9b', opacity: 0.28 }),
          el('g', { className: 'hl-sword', transform: 'rotate(-5 110 140)' },
            el('rect', { x: 6, y: 137, width: 16, height: 8, rx: 3, fill: '#7a4a1f' }),
            el('path', { d: 'M22 132 q4 6 -4 11 z', fill: '#a45d2a' }),
            el('rect', { x: 22, y: 135, width: 152, height: 9, rx: 4, fill: 'url(#swordGrad)' }),
            el('path', { d: 'M174 137 L196 132 L196 147 Z', fill: '#2e8b57' }),
            el('path', { d: 'M24 136.5 L172 131', stroke: '#c9f2d8', 'stroke-width': 2, opacity: 0.9, 'stroke-linecap': 'round' }),
            el('path', { d: 'M10 143 q-8 7 -4 18', stroke: '#c0392b', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' })),
          el('g', { className: 'hl-body' },
            el('rect', { x: 92, y: 126, width: 10, height: 13, rx: 4, fill: '#3a2e22' }),
            el('rect', { x: 112, y: 126, width: 10, height: 13, rx: 4, fill: '#3a2e22' }),
            el('path', { className: 'hl-robe', d: 'M87 102 L123 102 L135 133 L121 139 L104 135 L85 139 Z', fill: '#6B7A6D' }),
            el('rect', { x: 85, y: 101, width: 40, height: 5, rx: 2, fill: '#3a4a3f' }),
            el('path', { className: 'hl-sleeve-b', d: 'M83 96 q-24 6 -18 32 q11 -9 24 -7 Z', fill: '#5d6b60' }),
            el('path', { d: 'M124 98 q20 2 27 15 q-9 6 -23 1 Z', fill: '#5d6b60' }),
            el('circle', { cx: 147, cy: 115, r: 5, fill: '#f2d8b8' }),
            el('g', { className: 'hl-head' },
              el('circle', { cx: 108, cy: 84, r: 27, fill: '#f2d8b8' }),
              el('path', { d: 'M81 84 a27 27 0 0 1 54 0 q-5 -14 -15 -18 q-13 -6 -26 0 q-10 4 -13 18 z', fill: '#2b2b2b' }),
              el('circle', { cx: 112, cy: 56, r: 8, fill: '#2b2b2b' }),
              el('rect', { x: 117, y: 50, width: 23, height: 3.5, rx: 1.5, fill: '#8a5a2b' }),
              el('path', { d: 'M86 74 q11 -11 22 -5 q10 -5 22 5 q-13 -8 -21 -2 q-9 -4 -23 2 z', fill: '#2b2b2b' }),
              el('path', { className: 'hl-brow hl-brow-l', d: 'M94 78 q6 -4 12 -2', stroke: '#2b2b2b', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }),
              el('path', { className: 'hl-brow hl-brow-r', d: 'M116 74 q6 -4 12 -2', stroke: '#2b2b2b', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }),
              el('ellipse', { className: 'hl-eye hl-eye-l', cx: 99, cy: 86, rx: 4.5, ry: 5.5, fill: '#2b2b2b' }),
              el('circle', { cx: 100.5, cy: 84, r: 1.6, fill: '#fff' }),
              el('ellipse', { className: 'hl-eye hl-eye-r', cx: 117, cy: 86, rx: 4.5, ry: 5.5, fill: '#2b2b2b' }),
              el('circle', { cx: 118.5, cy: 84, r: 1.6, fill: '#fff' }),
              el('path', { d: 'M108 90 q1 3 0 5', stroke: '#d9b28e', 'stroke-width': 1.4, fill: 'none', 'stroke-linecap': 'round' }),
              el('path', { className: 'hl-mouth hl-mouth-neutral', d: 'M104 96 q4 3 8 0', stroke: '#8a5a3a', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }),
              el('path', { className: 'hl-mouth hl-mouth-happy', d: 'M101 95 q7 7 14 0', stroke: '#8a5a3a', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }),
              el('path', { className: 'hl-mouth hl-mouth-sad', d: 'M103 99 q6 -5 12 0', stroke: '#8a5a3a', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' })),
            el('g', { className: 'hl-beetle' },
              el('circle', { cx: 133, cy: 99, r: 5, fill: '#d4a017' }),
              el('path', { d: 'M131 96.5 q2 3 4 0', stroke: '#8a6a10', 'stroke-width': 1.2, fill: 'none' }))))
      )
    }

    function Pet() {
      const [mood, setMood] = React.useState('idle')
      const [trans, setTrans] = React.useState(null)
      const [bubble, setBubble] = React.useState(null)
      const [decos, setDecos] = React.useState([])
      const [pos, setPos] = React.useState(null)
      const [hidden, setHidden] = React.useState(false)
      const [manualSleep, setManualSleep] = React.useState(false)
      const rootRef = React.useRef(null)
      const dragRef = React.useRef(null)
      const seenRef = React.useRef({ errorAt: 0, toolAt: 0, messages: 0 })
      const idleSinceRef = React.useRef(now())

      const showBubble = (text, ms) => setBubble({ text: text, until: now() + ms })
      const addDeco = (kind, i) => {
        const id = nextDeco++
        setDecos((d) => d.concat([{ id: id, kind: kind, i: i, until: now() + 2600 }]))
      }
      const setTransient = (kind, ms) => {
        setTrans({ kind: kind, until: now() + ms })
        addDeco(kind, 0)
        addDeco(kind, 1)
      }
      const castSpell = () => {
        setManualSleep(false)
        setTransient('casting', 2600)
        addDeco('casting', 2)
        showBubble(pick(LINES.casting), 2600)
      }

      React.useEffect(() => {
        let stopped = false
        const tick = async () => {
          let s = null
          try {
            s = await host.call('otter/state', {})
          } catch (e) { /* host half not ready yet */ }
          if (stopped) return
          const t = now()
          if (s) {
            const seen = seenRef.current
            if (s.error && s.errorAt > seen.errorAt) {
              seen.errorAt = s.errorAt
              setManualSleep(false)
              setTransient('sad', 4500)
              showBubble(pick(LINES.sad), 4000)
            }
            if (s.messages > seen.messages) {
              seen.messages = s.messages
              setManualSleep(false)
              setTransient('excited', 4000)
              showBubble(pick(LINES.excited), 3500)
            }
            if (s.toolAt > seen.toolAt && s.tool) {
              seen.toolAt = s.toolAt
              setTransient('happy', 3500)
              showBubble('施展了一下 ' + s.tool + ' 法术！', 3000)
            }
            let base
            if (s.running) {
              idleSinceRef.current = t
              base = t - s.toolAt < 3000 ? 'working' : 'thinking'
            } else {
              if (idleSinceRef.current === 0) idleSinceRef.current = t
              base = t - idleSinceRef.current > 30000 ? 'sleep' : 'idle'
            }
            setMood(base)
          }
          setDecos((d) => d.filter((x) => x.until > t))
          setBubble((b) => (b && b.until > t ? b : null))
        }
        tick()
        const dispose = ctx.interval(tick, 900)
        return () => { stopped = true; dispose() }
      }, [])

      const onDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        const root = rootRef.current
        if (!root) return
        const rect = root.getBoundingClientRect()
        dragRef.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, left: rect.left, top: rect.top, moved: false }
        try { root.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }
      const onMove = (e) => {
        const d = dragRef.current
        if (!d || d.id !== e.pointerId) return
        const dx = e.clientX - d.startX
        const dy = e.clientY - d.startY
        if (!d.moved && Math.abs(dx) + Math.abs(dy) < 5) return
        d.moved = true
        const root = rootRef.current
        if (!root) return
        const vw = typeof window !== 'undefined' ? window.innerWidth : 2000
        const vh = typeof window !== 'undefined' ? window.innerHeight : 1200
        const left = Math.min(Math.max(4, d.left + dx), vw - root.offsetWidth - 4)
        const top = Math.min(Math.max(4, d.top + dy), vh - root.offsetHeight - 4)
        setPos({ left: left, top: top })
      }
      const onUp = (e) => {
        const d = dragRef.current
        if (!d || d.id !== e.pointerId) return
        dragRef.current = null
        if (!d.moved) {
          setManualSleep(false)
          setTransient('happy', 3000)
          showBubble(pick(LINES.happy), 3000)
        }
      }
      const onDouble = () => setManualSleep((m) => !m)

      const t = now()
      const effMood = manualSleep ? 'sleep' : trans && trans.until > t ? trans.kind : mood
      const stageStyle = pos ? { left: pos.left, top: pos.top } : { right: 20, bottom: 26 }

      if (hidden) {
        return el('div', { className: 'otter-pill', onClick: () => setHidden(false), title: '找回韩立' }, '🦦 点我找回宠物')
      }

      const decoIcons = { happy: ['💎', '💠'], thinking: ['☯', '☯', '☯'], excited: ['✨', '✨'], working: ['⚡'], sad: ['💧', '💧'], casting: ['⚡', '☯', '✨'] }
      const decoClass = { happy: ['gem', 'gem2'], thinking: ['rune', 'rune2', 'rune3'], excited: ['spark', 'spark2'], working: ['sweat'], sad: ['tear', 'tear2'], casting: ['cast', 'cast2', 'cast3'] }

      return el('div', {
        className: 'otter-pet otter-pet--' + effMood,
        style: stageStyle,
        onPointerDown: onDown,
        onPointerMove: onMove,
        onPointerUp: onUp,
        onDoubleClick: onDouble,
      },
        el('div', { className: 'otter-pet__stage', ref: rootRef },
          el(HanLiSVG, null),
          (effMood === 'thinking' || effMood === 'working') && el('span', { className: 'op-think op-think--1' }, effMood === 'working' ? '⚡' : '☯'),
          (effMood === 'thinking' || effMood === 'working') && el('span', { className: 'op-think op-think--2' }, effMood === 'working' ? '⚡' : '☯'),
          (effMood === 'thinking' || effMood === 'working') && el('span', { className: 'op-think op-think--3' }, effMood === 'working' ? '⚡' : '☯'),
          effMood === 'working' && el('span', { className: 'op-sweat' }, '💦'),
          effMood === 'sleep' && el('span', { className: 'op-zzz' }, 'Z'),
          effMood === 'sleep' && el('span', { className: 'op-zzz op-zzz--2' }, 'z'),
          decos.map((x) => el('span', { key: x.id, className: 'op-deco op-deco--' + decoClass[x.kind][x.i] }, decoIcons[x.kind][x.i])),
          bubble && el('div', { className: 'op-bubble' }, bubble.text),
          el('div', { className: 'otter-btns', onPointerDown: (e) => e.stopPropagation() },
            el('button', { className: 'otter-btn', title: manualSleep ? '叫醒' : '睡觉', onClick: () => setManualSleep((m) => !m) }, manualSleep ? '⏰' : '💤'),
            el('button', { className: 'otter-btn', title: '施法', onClick: castSpell }, '⚡'),
            el('button', { className: 'otter-btn', title: '藏起来', onClick: () => setHidden(true) }, '✕'))
        ))
    }

    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'otter-pet', order: 200 },
      () => el(Pet, null)
    ))
  },
}
