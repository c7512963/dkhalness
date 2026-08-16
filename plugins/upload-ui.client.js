// 上传文件栏·客户端（配合 upload-ui.host.js）：输入框上方"✒️ 文件管理"按钮，
// 打开全屏文件管理面板（上传 + 树形文件库 + 预览编辑整合），水墨风：宣纸底色 +
// 远山剪影 + 墨点晕染 + 墨绿色调。idPrefix 'upui'
// 面板功能：
// - 树形目录浏览：文件夹点击展开/折叠并设为当前目录（面包屑可跳转）
// - 📎 上传到当前目录（支持子目录路径）、＋ 新建文件夹、⟳ 刷新、✕ 关闭
// - 行 hover 出现 🗑️ 删除（文件/文件夹，二次确认）
// - 点击文件 → 预览弹窗：text/docx 可"✏️ 修改"保存；image/pdf 直接预览；binary 提示
// 注意：客户端注入 inject:['sessions']；React/styles/host/ctx 是客户端沙箱全局。
return {
  inject: ['sessions'],
  apply(ctx) {
    const slots = ctx.get('slots')
    if (!slots) return

    styles.insert(`
.upld-dock{position:relative;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:6px 4px 2px;font-family:system-ui,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif}
.upld-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(63,90,72,.4);background:rgba(255,253,247,.85);color:#3f5a48;border-radius:999px;padding:5px 13px;font-size:13px;cursor:pointer;box-shadow:0 1px 4px rgba(60,70,60,.08)}
.upld-btn:hover{background:#eef2ec}
.upld-err{color:#b0442e;font-size:12px;flex-basis:100%}
.upld-hint{color:#9aa3bc;font-size:11px}
.upld-ok{color:#3f7a55;font-size:12px}
.upld-panel{position:fixed;inset:0;z-index:9994;background:rgba(40,50,45,.4);display:flex;align-items:center;justify-content:center}
.upld-panel-card{position:relative;width:min(880px,94vw);height:min(660px,88vh);background:linear-gradient(180deg,#f8f4ec 0%,#f2ebda 100%);border-radius:14px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 16px 60px rgba(30,40,35,.4)}
.upld-deco{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0}
.upld-mount{position:absolute;bottom:0;border-radius:50% 50% 0 0 / 100% 100% 0 0}
.upld-mount-1{left:-10%;width:70%;height:26%;background:linear-gradient(180deg,rgba(90,105,90,.10),rgba(90,105,90,.30));opacity:.7}
.upld-mount-2{right:-12%;width:78%;height:34%;background:linear-gradient(180deg,rgba(80,95,80,.12),rgba(80,95,80,.34));opacity:.75}
.upld-mount-3{left:8%;width:64%;height:20%;background:linear-gradient(180deg,rgba(100,110,95,.08),rgba(100,110,95,.24))}
.upld-fog{position:absolute;bottom:-20px;left:-10%;width:120%;height:70px;background:linear-gradient(180deg,rgba(248,244,236,0),rgba(248,244,236,.92));z-index:1}
.upld-ink{position:absolute;border-radius:50%;background:radial-gradient(circle at 40% 40%,rgba(70,80,70,.5),rgba(70,80,70,0) 70%);animation:upld-float 7s ease-in-out infinite}
@keyframes upld-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.upld-panel-head{position:relative;z-index:2;padding:10px 16px;border-bottom:1px solid rgba(80,95,80,.18);display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:rgba(255,253,247,.55);backdrop-filter:blur(4px)}
.upld-panel-title{font-weight:600;font-size:14px;color:#3a463f;margin-right:4px;letter-spacing:1px}
.upld-crumb{font-size:12px;color:#3f5a48;cursor:pointer;background:rgba(240,244,238,.9);border:1px solid rgba(63,90,72,.25);border-radius:6px;padding:2px 8px}
.upld-crumb:hover{background:#e6ece2}
.upld-panel-body{position:relative;z-index:1;flex:1;overflow:auto;padding:10px}
.upld-li{display:flex;align-items:center;gap:6px;padding:5px 8px;margin:3px 0;border-radius:8px;cursor:pointer;font-size:13px;color:#3a463f;user-select:none;background:rgba(255,253,247,.75);border:1px solid rgba(80,95,80,.12);box-shadow:0 1px 3px rgba(60,70,60,.06)}
.upld-li:hover{background:rgba(255,253,247,.96);border-color:rgba(63,90,72,.35)}
.upld-li-sel{background:rgba(226,236,228,.95);border-color:rgba(63,90,72,.4);box-shadow:0 1px 5px rgba(63,90,72,.18)}
.upld-li-multi{background:rgba(222,232,226,.95);border-color:rgba(63,90,72,.45)}
.upld-li .ico{flex:none;width:16px;text-align:center}
.upld-li .nm{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.upld-rn{flex:1;font-size:13px;padding:2px 6px;border:1px solid #3f5a48;border-radius:6px;outline:none;background:#fff;color:#3a463f}
.upld-li .sz{color:#9aa3bc;font-size:11px;flex:none}
.upld-acts{display:none;gap:2px;align-items:center;flex:none;margin-left:4px}
.upld-li:hover .upld-acts{display:inline-flex}
.upld-act{cursor:pointer;font-size:12px;color:#66705f;padding:0 3px;border-radius:6px}
.upld-act:hover{background:#e0e8e2}
.upld-del{cursor:pointer;font-size:12px;color:#b0442e;padding:0 3px;border-radius:6px}
.upld-del:hover{background:#f7e4dc}
.upld-bar{position:relative;z-index:2;padding:6px 16px;display:flex;gap:10px;align-items:center;font-size:12px;color:#3a463f;background:rgba(240,244,238,.85);border-bottom:1px solid rgba(80,95,80,.12)}
.upld-empty{color:#8a94ad;font-size:12px;padding:12px 8px;background:rgba(255,253,247,.6);border-radius:8px}
.upld-modal{position:fixed;inset:0;z-index:9995;background:rgba(40,50,45,.4);display:flex;align-items:center;justify-content:center}
.upld-editor{width:min(860px,92vw);height:min(640px,86vh);background:#fffdf8;border-radius:14px;box-shadow:0 16px 60px rgba(30,40,35,.4);display:flex;flex-direction:column;overflow:hidden}
.upld-editor-head{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #e8e2d4;font-size:14px;font-weight:600;color:#3a463f}
.upld-editor-head .sp{flex:1}
.upld-editor textarea{flex:1;border:0;outline:none;resize:none;padding:14px 16px;font-family:'Cascadia Code','Consolas','JetBrains Mono',monospace;font-size:13px;line-height:1.6;color:#2b3a2f;background:#fdfaf2;white-space:pre;tab-size:2}
.upld-preview{flex:1;overflow:auto;padding:14px 16px;font-size:13px;line-height:1.7;color:#2b3a2f;background:#fdfaf2;white-space:pre-wrap;word-break:break-word}
.upld-imgbox{flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;background:#f0f2f7;padding:16px}
.upld-imgbox img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;box-shadow:0 4px 18px rgba(20,30,70,.18)}
.upld-pdfbox{flex:1;overflow:hidden;background:#e8eaef;display:flex;flex-direction:column}
.upld-pdfbox iframe{flex:1;width:100%;border:0;background:#fff}
.upld-pdfnote{padding:8px 16px;font-size:12px;color:#8a94ad;background:#f6f8fc;border-top:1px solid #e7ecf7}
.upld-editor-foot{display:flex;align-items:center;gap:10px;padding:10px 16px;border-top:1px solid #e8e2d4}
.upld-save{display:inline-flex;align-items:center;border:0;background:#3f5a48;color:#fff;border-radius:999px;padding:6px 18px;font-size:13px;cursor:pointer}
.upld-save:disabled{opacity:.55;cursor:default}
.upld-edit{display:inline-flex;align-items:center;border:1px solid #3f5a48;background:#fff;color:#3f5a48;border-radius:999px;padding:5px 16px;font-size:13px;cursor:pointer}
.upld-edit:hover{background:#eef2ec}
.upld-cancel{border:1px solid #d8d2c4;background:#fff;color:#66705f;border-radius:999px;padding:5px 16px;font-size:13px;cursor:pointer}
.upld-loading{color:#9aa3bc;font-size:13px;padding:20px;text-align:center}
.mkt-card{margin:4px 0;padding:10px 12px;border-radius:10px;background:rgba(255,253,247,.85);border:1px solid rgba(80,95,80,.15);box-shadow:0 1px 3px rgba(60,70,60,.06)}
.mkt-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.mkt-repo{font-weight:600;font-size:13.5px;color:#3a463f}
.mkt-badge{font-size:11px;padding:1px 8px;border-radius:999px;background:#e6ece2;color:#3f5a48}
.mkt-stars{font-size:12px;color:#b08a2e}
.mkt-zh{font-size:12.5px;color:#4a5648;margin:4px 0}
.mkt-desc{font-size:11.5px;color:#8a94ad}
.mkt-acts{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;align-items:center}
.mkt-file{font-size:11px;color:#66705f;background:#f2efe7;border-radius:6px;padding:1px 6px}
`)

    const el = React.createElement
    const MAX_FILE = 15 * 1024 * 1024
    const TEXT_EXTS = /\.(txt|md|markdown|json|xml|java|py|js|ts|jsx|tsx|yml|yaml|properties|csv|log|conf|ini|sql|sh|bat|html|css|env|cfg|gradle|kt|go|rs|c|cpp|h|vue|docx)$/i
    const CAT = { skills: '技能包', preset: '预设', list: '资源列表' }

    function MarketPanel({ onClose }) {
      const [items, setItems] = React.useState(null)
      const [states, setStates] = React.useState({})
      const [notice, setNotice] = React.useState(null)
      const load = () => {
        host.call('hot/list', {}).then((res) => {
          setItems(res && res.ok && Array.isArray(res.items) ? res.items : [])
        }).catch((e) => setNotice('❌ ' + String((e && e.message) || e)))
      }
      React.useEffect(() => { load() }, [])
      const setSt = (repo, patch) => setStates((prev) => ({ ...prev, [repo]: { ...(prev[repo] || {}), ...patch } }))
      const download = (item) => {
        setSt(item.repo, { busy: true, err: null })
        host.call('hot/download', { repo: item.repo }).then((res) => {
          if (!res || res.ok === false) { setSt(item.repo, { busy: false, err: (res && res.error) || '下载失败' }); return }
          setSt(item.repo, { busy: false, dir: res.dir, files: res.files || [], done: true })
        }).catch((e) => setSt(item.repo, { busy: false, err: String((e && e.message) || e) }))
      }
      const install = (item, kind, file) => {
        setSt(item.repo, { busy: true, err: null })
        host.call('hot/install', { repo: item.repo, kind: kind, file: file }).then((res) => {
          if (!res || res.ok === false) { setSt(item.repo, { busy: false, err: (res && res.error) || '安装失败' }); return }
          setSt(item.repo, { busy: false, installed: kind + '@' + res.target })
        }).catch((e) => setSt(item.repo, { busy: false, err: String((e && e.message) || e) }))
      }
      const renderItem = (it, i) => {
        const st = states[it.repo] || {}
        const actBtns = [el('button', { key: 'dl', className: 'upld-btn', onClick: () => download(it), disabled: st.busy }, st.busy ? '处理中…' : (st.done ? '⟳ 重新下载' : '⬇ 下载'))]
        if (st.done && st.files && st.files.some((f) => f.endsWith('SKILL.md'))) {
          actBtns.push(el('button', { key: 'sk', className: 'upld-btn', onClick: () => install(it, 'skill', st.files.find((f) => f.endsWith('SKILL.md'))) }, '📥 装为技能'))
        }
        if (st.done && st.files && st.files.some((f) => f.endsWith('agent.cordis.yml'))) {
          actBtns.push(el('button', { key: 'pr', className: 'upld-btn', onClick: () => install(it, 'preset', st.files.find((f) => f.endsWith('agent.cordis.yml'))) }, '📥 装为预设'))
        }
        const status = st.installed ? el('span', { className: 'upld-ok' }, '✅ 已安装：' + st.installed)
          : st.err ? el('span', { className: 'upld-err' }, st.err) : null
        return el('div', { key: i, className: 'mkt-card' },
          el('div', { className: 'mkt-head' },
            el('span', { className: 'mkt-repo' }, it.repo),
            el('span', { className: 'mkt-badge' }, CAT[it.cat] || it.cat),
            el('span', { className: 'mkt-stars' }, '⭐ ' + it.stars),
            el('span', { className: 'sp', style: { flex: 1 } }),
            el('a', { className: 'upld-btn', href: 'https://github.com/' + it.repo, target: '_blank', rel: 'noreferrer', style: { textDecoration: 'none' } }, '🔗 GitHub')),
          el('div', { className: 'mkt-zh' }, it.zh),
          it.desc && el('div', { className: 'mkt-desc' }, it.desc),
          status,
          st.done && st.files && el('div', { className: 'mkt-acts' }, st.files.map((f, j) => el('span', { key: j, className: 'mkt-file' }, f.split('/').pop()))),
          el('div', { className: 'mkt-acts' }, actBtns))
      }
      return el('div', { className: 'upld-panel', onClick: (e) => { if (e.target === e.currentTarget) onClose() } },
        el('div', { className: 'upld-panel-card' },
          el('div', { className: 'upld-panel-head' },
            el('span', { className: 'upld-panel-title' }, '🧩 插件市场（GitHub 热门）'),
            el('span', { className: 'sp', style: { flex: 1 } }),
            el('button', { className: 'upld-btn', onClick: load }, '⟳ 刷新'),
            el('button', { className: 'upld-cancel', onClick: onClose }, '✕ 关闭')),
          notice && el('div', { style: { padding: '6px 16px', fontSize: 12 } }, notice),
          el('div', { className: 'upld-panel-body' },
            !items ? el('div', { className: 'upld-empty' }, '加载中…')
              : items.length === 0 ? el('div', { className: 'upld-empty' }, '暂无数据')
              : items.map(renderItem))))
    }

    function FileEditor({ file, onClose, onSaved }) {
      const [kind, setKind] = React.useState(null)
      const [content, setContent] = React.useState('')
      const [dataUrl, setDataUrl] = React.useState(null)
      const [loading, setLoading] = React.useState(true)
      const [editMode, setEditMode] = React.useState(false)
      const [saving, setSaving] = React.useState(false)
      const [err, setErr] = React.useState(null)
      React.useEffect(() => {
        let stopped = false
        setLoading(true)
        setErr(null)
        setEditMode(false)
        host.call('upld/preview', { name: file.name }).then((res) => {
          if (stopped) return
          if (res && res.ok === false) { setErr(res.error || '读取失败'); setLoading(false); return }
          setKind(res.kind)
          if (res.kind === 'text') setContent(res.content || '')
          else if (res.kind === 'docx') setContent((res.lines || []).join('\n'))
          else if (res.kind === 'image' || res.kind === 'pdf') setDataUrl(res.dataUrl)
          setLoading(false)
        }).catch((e) => { if (!stopped) { setErr(String((e && e.message) || e)); setLoading(false) } })
        return () => { stopped = true }
      }, [file.name])
      const save = async () => {
        if (saving) return
        setSaving(true)
        setErr(null)
        try {
          const isDocx = kind === 'docx'
          const payload = isDocx ? { name: file.name, lines: content.split('\n') } : { name: file.name, content: content }
          const res = await host.call(isDocx ? 'upld/write-doc' : 'upld/write-file', payload)
          if (res && res.ok === false) throw new Error(res.error || '保存失败')
          setEditMode(false)
          onSaved(file.name)
        } catch (e2) { setErr(String((e2 && e2.message) || e2)) } finally { setSaving(false) }
      }
      const editable = kind === 'text' || kind === 'docx'
      let body = null
      if (loading) body = el('div', { className: 'upld-loading' }, '读取中…')
      else if (kind === 'image') body = el('div', { className: 'upld-imgbox' }, el('img', { src: dataUrl, alt: file.name }))
      else if (kind === 'pdf') body = el('div', { className: 'upld-pdfbox' },
        el('iframe', { src: dataUrl, title: file.name }),
        el('div', { className: 'upld-pdfnote' }, 'PDF 预览。图片型 PDF（无文字层）无法直接改字：请编辑同目录 docx/txt 后重新导出；有文字层的 PDF 可告诉 agent 提取编辑。'))
      else if (kind === 'binary') body = el('div', { className: 'upld-preview' }, '二进制文件不支持在线编辑（可让 agent 处理）')
      else if (!kind) body = el('div', { className: 'upld-preview' }, err || '无法读取')
      else body = editMode
        ? el('textarea', { value: content, onChange: (e) => setContent(e.target.value), spellCheck: false })
        : el('div', { className: 'upld-preview' }, content)
      return el('div', { className: 'upld-modal', onClick: (e) => { if (e.target === e.currentTarget) onClose() } },
        el('div', { className: 'upld-editor' },
          el('div', { className: 'upld-editor-head' },
            el('span', null, (kind === 'image' ? '🖼️ ' : kind === 'pdf' ? '📄 ' : '✏️ ') + file.name),
            el('span', { className: 'sp' }),
            el('button', { className: 'upld-cancel', onClick: onClose }, '关闭')),
          body,
          el('div', { className: 'upld-editor-foot' },
            err && el('span', { className: 'upld-err', style: { flex: 1 } }, err),
            el('span', { className: 'sp', style: { flex: 1 } }),
            editable && !editMode && el('button', { className: 'upld-edit', onClick: () => { setErr(null); setEditMode(true) } }, '✏️ 修改'),
            editMode && el('button', { className: 'upld-cancel', onClick: () => { setErr(null); setEditMode(false) } }, '取消'),
            editMode && el('button', { className: 'upld-save', onClick: save, disabled: saving }, saving ? '保存中…' : '保存'))))
    }

    function TNode({ node, depth, expanded, currentDir, selectMode, selected, editingName, onToggle, onFile, onSelect, onStartRename, onCommitRename, onCancelRename, onDownload, onDelete }) {
      const isDir = node.kind === 'dir'
      const open = !!expanded[node.name]
      const sel = currentDir === node.name
      const picked = selected.has(node.name)
      const isEditing = editingName === node.name
      const handleClick = () => {
        if (selectMode) onSelect(node)
        else if (isDir) onToggle(node)
        else onFile(node)
      }
      return el('div', null,
        el('div', { className: 'upld-li' + (selectMode ? (picked ? ' upld-li-multi' : '') : (sel ? ' upld-li-sel' : '')), style: { paddingLeft: 6 + depth * 16 }, onClick: handleClick },
          el('span', { className: 'ico' }, selectMode ? (picked ? '☑️' : '⬜') : (isDir ? (open ? '📂' : '📁') : (TEXT_EXTS.test(node.name) ? '✏️' : '📄'))),
          isEditing
            ? el('input', { className: 'upld-rn', defaultValue: node.label || node.name.split('/').pop(), autoFocus: true,
                onClick: (e) => e.stopPropagation(),
                onKeyDown: (e) => { if (e.key === 'Enter') onCommitRename(e.target.value); else if (e.key === 'Escape') onCancelRename() },
                onBlur: (e) => onCommitRename(e.target.value) })
            : el('span', { className: 'nm' }, node.label || node.name.split('/').pop()),
          el('span', { className: 'sz' }, isDir ? (open ? '▼' : '▶') : node.size >= 1048576 ? (node.size / 1048576).toFixed(1) + 'MB' : Math.max(1, Math.round(node.size / 1024)) + 'KB'),
          !selectMode && el('span', { className: 'upld-acts' },
            !isDir && el('span', { className: 'upld-act', title: '下载', onClick: (e) => { e.stopPropagation(); onDownload(node) } }, '⬇️'),
            el('span', { className: 'upld-act', title: '重命名', onClick: (e) => { e.stopPropagation(); onStartRename(node) } }, '✏️'),
            el('span', { className: 'upld-del', title: '删除', onClick: (e) => { e.stopPropagation(); onDelete(node) } }, '🗑️'))),
        open && isDir && node.children && node.children.map((c) => el(TNode, { key: c.name, node: c, depth: depth + 1, expanded: expanded, currentDir: currentDir, selectMode: selectMode, selected: selected, editingName: editingName, onToggle: onToggle, onFile: onFile, onSelect: onSelect, onStartRename: onStartRename, onCommitRename: onCommitRename, onCancelRename: onCancelRename, onDownload: onDownload, onDelete: onDelete })))
    }

    function FilePanel({ onClose, onOpenFile }) {
      const [tree, setTree] = React.useState(null)
      const [currentDir, setCurrentDir] = React.useState('')
      const [expanded, setExpanded] = React.useState({ '': true })
      const [uploading, setUploading] = React.useState(false)
      const [notice, setNotice] = React.useState(null)
      const [selectMode, setSelectMode] = React.useState(false)
      const [selected, setSelected] = React.useState(new Set())
      const [editingName, setEditingName] = React.useState(null)
      const kindsRef = React.useRef({})
      const inputRef = React.useRef(null)

      const reload = () => {
        host.call('upld/list-files', {}).then((res) => {
          setTree(res && res.ok && Array.isArray(res.tree) ? res.tree : [])
        }).catch(() => setTree([]))
      }
      React.useEffect(() => { reload() }, [])

      const onToggle = (node) => {
        setExpanded((prev) => ({ ...prev, [node.name]: !prev[node.name] }))
        setCurrentDir(node.name)
      }
      const goCrumb = (parts, i) => setCurrentDir(parts.slice(0, i).join('/'))
      const onSelect = (node) => {
        kindsRef.current[node.name] = node.kind
        setSelected((prev) => {
          const n = new Set(prev)
          if (n.has(node.name)) n.delete(node.name); else n.add(node.name)
          return n
        })
      }
      const onStartRename = (node) => { setNotice(null); setEditingName(node.name) }
      const onCancelRename = () => setEditingName(null)
      const onCommitRename = (newName) => {
        const path = editingName
        setEditingName(null)
        if (!path || !newName || !newName.trim()) return
        const oldBase = path.split('/').pop()
        if (newName.trim() === oldBase) return
        host.call('upld/rename', { path: path, newName: String(newName).trim() }).then((res) => {
          if (res && res.ok === false) { setNotice('❌ ' + (res.error || '重命名失败')); return }
          setNotice('✏️ 已重命名 ' + oldBase + ' → ' + String(newName).trim())
          if (res && res.name && (currentDir === path || currentDir.startsWith(path + '/'))) {
            setCurrentDir(res.name + currentDir.slice(path.length))
          }
          reload()
        }).catch((e) => setNotice('❌ ' + String((e && e.message) || e)))
      }
      const downloadOne = async (node) => {
        try {
          const res = await host.call('upld/download', { name: node.name })
          if (!res || res.ok === false) { setNotice('❌ ' + ((res && res.error) || '下载失败')); return }
          const bytes = Uint8Array.from(atob(res.data), (c) => c.charCodeAt(0))
          const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }))
          const a = document.createElement('a')
          a.href = url
          a.download = res.name
          document.body.appendChild(a)
          a.click()
          a.remove()
          setTimeout(() => URL.revokeObjectURL(url), 5000)
        } catch (e) { setNotice('❌ 下载失败: ' + String((e && e.message) || e)) }
      }
      const multiDownload = async () => {
        const files = [...selected].filter((n) => kindsRef.current[n] !== 'dir')
        if (!files.length) { setNotice('所选没有可下载的文件'); return }
        for (const n of files) await downloadOne({ name: n, kind: 'file' })
      }
      const multiDelete = () => {
        const n = selected.size
        if (!n) return
        if (!window.confirm('确定删除选中的 ' + n + ' 项？此操作不可恢复！')) return
        let ok = 0
        const names = [...selected]
        const step = (i) => {
          if (i >= names.length) {
            setNotice('🗑️ 已删除 ' + ok + ' 项')
            setSelected(new Set())
            reload()
            return
          }
          const name = names[i]
          host.call('upld/delete', { path: name, recursive: kindsRef.current[name] === 'dir' }).then((res) => {
            if (res && res.ok) ok++
            step(i + 1)
          }).catch(() => step(i + 1))
        }
        step(0)
      }
      const onDelete = (node) => {
        const isDir = node.kind === 'dir'
        const msg = isDir
          ? '确定删除文件夹 ' + node.name + ' 及其全部内容？此操作不可恢复！'
          : '确定删除文件 ' + node.name + '？此操作不可恢复！'
        if (!window.confirm(msg)) return
        host.call('upld/delete', { path: node.name, recursive: isDir }).then((res) => {
          if (res && res.ok === false) { setNotice('❌ ' + (res.error || '删除失败')); return }
          setNotice('🗑️ 已删除 ' + node.name)
          if (isDir && currentDir === node.name) setCurrentDir('')
          reload()
        }).catch((e) => setNotice('❌ ' + String((e && e.message) || e)))
      }
      const newFolder = () => {
        const name = window.prompt('新建文件夹名称（创建到当前目录下，支持多级）', '新文件夹')
        if (!name || !name.trim()) return
        const rel = currentDir ? currentDir + '/' + String(name).trim() : String(name).trim()
        host.call('upld/mkdir', { path: rel }).then((res) => {
          setNotice(res && res.ok === false ? ('❌ ' + (res.error || '创建失败')) : '✅ 已创建 ' + rel)
          reload()
        }).catch((e) => setNotice('❌ ' + String((e && e.message) || e)))
      }
      const pick = () => inputRef.current && inputRef.current.click()
      const onFiles = async (e) => {
        const picked = Array.from(e.target.files || [])
        e.target.value = ''
        if (!picked.length) return
        setUploading(true)
        setNotice(null)
        const done = []
        const failed = []
        for (const f of picked) {
          if (f.size > MAX_FILE) { failed.push(f.name + ' 超15MB'); continue }
          try {
            const dataUrl = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f) })
            const rel = currentDir ? currentDir + '/' + f.name : f.name
            const res = await host.call('upld/upload-file', { name: rel, data: dataUrl.split(',')[1] })
            if (res && res.ok) done.push(f.name)
            else failed.push(f.name + (res && res.error ? ':' + res.error : ''))
          } catch (e2) { failed.push(f.name) }
        }
        setUploading(false)
        setNotice((done.length ? '✅ 已上传 ' + done.length + ' 个：' + done.join('、') : '') + (failed.length ? (done.length ? '；' : '') + '❌ ' + failed.join('、') : ''))
        reload()
      }
      const crumb = ['文件'].concat(currentDir ? currentDir.split('/') : [])
      const inks = [
        { l: '12%', t: '16%', s: 14, d: '0s' },
        { l: '80%', t: '12%', s: 10, d: '1.2s' },
        { l: '58%', t: '66%', s: 8, d: '.7s' },
        { l: '28%', t: '55%', s: 12, d: '1.8s' },
        { l: '90%', t: '48%', s: 7, d: '.4s' },
        { l: '70%', t: '78%', s: 6, d: '2.2s' },
      ]
      return el('div', { className: 'upld-panel', onClick: (e) => { if (e.target === e.currentTarget) onClose() } },
        el('div', { className: 'upld-panel-card' },
          el('div', { className: 'upld-deco' },
            el('div', { className: 'upld-mount upld-mount-1' }),
            el('div', { className: 'upld-mount upld-mount-2' }),
            el('div', { className: 'upld-mount upld-mount-3' }),
            el('div', { className: 'upld-fog' }),
            inks.map((d, i) => el('span', { key: i, className: 'upld-ink', style: { left: d.l, top: d.t, width: d.s, height: d.s, animationDelay: d.d } }))),
          el('div', { className: 'upld-panel-head' },
            el('span', { className: 'upld-panel-title' }, '✒️ 文件管理'),
            crumb.map((seg, i) => el('span', { key: i, className: 'upld-crumb', onClick: () => goCrumb(crumb.slice(1), i) }, seg)),
            el('span', { className: 'sp', style: { flex: 1 } }),
            el('button', { className: 'upld-btn', onClick: () => { setSelectMode((m) => !m); setSelected(new Set()) } }, selectMode ? '✖ 退出多选' : '☑ 多选'),
            el('button', { className: 'upld-btn', onClick: pick, disabled: uploading }, uploading ? '上传中…' : '📎 上传到当前目录'),
            el('button', { className: 'upld-btn', onClick: newFolder }, '＋ 新建文件夹'),
            el('button', { className: 'upld-btn', onClick: reload }, '⟳ 刷新'),
            el('button', { className: 'upld-cancel', onClick: onClose }, '✕ 关闭')),
          selectMode && el('div', { className: 'upld-bar' },
            el('span', null, '已选 ' + selected.size + ' 项'),
            el('button', { className: 'upld-btn', onClick: multiDownload }, '⬇ 下载所选文件'),
            el('button', { className: 'upld-btn', onClick: multiDelete }, '🗑 删除所选'),
            el('button', { className: 'upld-cancel', onClick: () => { setSelectMode(false); setSelected(new Set()) } }, '取消')),
          el('input', { ref: inputRef, type: 'file', multiple: true, style: { display: 'none' }, onChange: onFiles }),
          notice && el('div', { style: { position: 'relative', zIndex: 2, padding: '6px 16px', fontSize: 12 } }, notice),
          el('div', { className: 'upld-panel-body' },
            !tree ? el('div', { className: 'upld-empty' }, '加载中…')
              : tree.length === 0 ? el('div', { className: 'upld-empty' }, '暂无文件')
              : tree.map((n) => el(TNode, { key: n.name, node: n, depth: 0, expanded: expanded, currentDir: currentDir, selectMode: selectMode, selected: selected, editingName: editingName, onToggle: onToggle, onFile: onOpenFile, onSelect: onSelect, onStartRename: onStartRename, onCommitRename: onCommitRename, onCancelRename: onCancelRename, onDownload: downloadOne, onDelete: onDelete })))))
    }

    function UploadDock(props) {
      const [panelOpen, setPanelOpen] = React.useState(false)
      const [marketOpen, setMarketOpen] = React.useState(false)
      const [editing, setEditing] = React.useState(null)
      return el('div', { className: 'upld-dock' },
        el('button', { className: 'upld-btn', onClick: () => setPanelOpen(true) }, '✒️ 文件管理'),
        el('button', { className: 'upld-btn', onClick: () => setMarketOpen(true) }, '🧩 插件市场'),
        panelOpen && el(FilePanel, { onClose: () => setPanelOpen(false), onOpenFile: (f) => { setPanelOpen(false); setEditing(f) } }),
        marketOpen && el(MarketPanel, { onClose: () => setMarketOpen(false) }),
        editing && el(FileEditor, { file: editing, onClose: () => setEditing(null), onSaved: (name) => setEditing(null) }))
    }

    slots.inject('conversation.input.dock', () => slots.register(
      { name: 'conversation.input.dock', id: 'upld-dock', order: 100, label: '文件管理' },
      (props) => el(UploadDock, props)
    ))
  },
}
