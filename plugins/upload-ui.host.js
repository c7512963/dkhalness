// 上传文件栏·宿主端（配合 upload-ui.client.js，文件管理整合面板版）：
// - upld/upload-file  客户端上传 base64 → node 解码写 uploads/<相对路径>（支持子目录，自动建目录）
// - upld/list-files   递归返回 uploads/ 目录树（{kind:'dir'|'file', children}）
// - upld/mkdir        新建文件夹（node mkdirSync recursive）
// - upld/preview      预览：text 全文 / docx 段落数组 / image、pdf dataUrl / binary 大小
// - upld/read-file / upld/write-file  文本读写
// - upld/write-doc    docx 段落级写回（pwsh 脚本 docx_write.ps1，保留样式）
// 注意：host.call 只路由到本包自己的 harness.handle；宿主沙箱无 Buffer，
// base64→文件解码交给 node 子进程（stdin 批量写入）；safeRel 防路径穿越（允许子目录）。
// FsDirEntry 字段是 type（'file'|'directory'|'other'），不是 kind！
return {
  apply(ctx) {
    const subprocess = ctx.get('subprocess')
    const fs = ctx.get('fs')
    const UPLOAD_DIR = 'D:/deepskhaness/uploads'
    const SCRIPTS = 'D:/deepskhaness/plugins/scripts'
    const REMOTE = 'D:/deepskhaness/plugins-remote'
    const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    const HOT = [
      { repo: 'LayneChai/superpowers-dsh', cat: 'skills', zh: 'Superpowers 技能包：TDD/调试/规划/协作，改编自 obra/superpowers' },
      { repo: 'mbj733/dsh-hermes-memory', cat: 'preset', zh: 'Hermes 跨会话记忆 + 自主技能学习（agent preset + 插件）' },
      { repo: 'yufeiyufei888/handoff-codex-to-dsh', cat: 'skills', zh: 'Codex 项目交接给 DeepSeek Harness 的技能' },
      { repo: 'HenryZ838978/deepseek-harness', cat: 'skills', zh: 'Harness 增强：Python 库 + dsh CLI + MCP server + Anthropic SKILL.md' },
      { repo: 'Dominic789654/awesome-deepseek-harness', cat: 'list', zh: 'DSH 插件/技能/MCP 服务器/UI 精选合集' },
      { repo: 'fendouai/awesome-deepseek-harness', cat: 'list', zh: 'Awesome DeepSeek Harness（中文）' },
      { repo: 'beancookie/awesome-dsh-plugin', cat: 'list', zh: 'Awesome DSH Plugin 精选' },
      { repo: '0xsline/awesome-deepseek-harness', cat: 'list', zh: 'Awesome DeepSeek Harness' },
    ]

    const safeRel = (name) => {
      if (!name || typeof name !== 'string') return null
      if (name.length > 300) return null
      if (name.includes('..')) return null
      if (name.startsWith('/') || name.startsWith('\\') || /^[a-zA-Z]:/.test(name)) return null
      const parts = String(name).split(/[\\/]/)
      for (const p of parts) if (!p || p === '.') return null
      return parts.join('/')
    }

    const toBase64 = (bytes) => {
      let out = ''
      const n = bytes.length
      for (let i = 0; i < n; i += 3) {
        const b0 = bytes[i]
        const b1 = i + 1 < n ? bytes[i + 1] : 0
        const b2 = i + 2 < n ? bytes[i + 2] : 0
        out += B64[b0 >> 2]
        out += B64[((b0 & 3) << 4) | (b1 >> 4)]
        out += i + 1 < n ? B64[((b1 & 15) << 2) | (b2 >> 6)] : '='
        out += i + 2 < n ? B64[b2 & 63] : '='
      }
      return out
    }

    const runPwsh = async (scriptFile, argv, stdinData) => {
      if (!subprocess) throw new Error('subprocess 服务不可用')
      const pwshPath = await subprocess.resolveExecutable('pwsh')
      const proc = subprocess.spawn({
        argv: [pwshPath, '-NoProfile', '-File', SCRIPTS + '/' + scriptFile].concat(argv),
        cwd: 'D:/deepskhaness',
        stdio: { stdin: stdinData === undefined ? 'ignore' : { data: stdinData }, stdout: 'collect', stderr: 'collect' },
        graceMs: 30000,
      })
      const outcome = await proc.done
      const out = proc.collected && proc.collected.stdout ? proc.collected.stdout.readFrom(0).text : ''
      const err = proc.collected && proc.collected.stderr ? proc.collected.stderr.readFrom(0).text : ''
      if (outcome.exitCode !== 0 && !out) throw new Error('脚本失败: ' + String(err).slice(0, 300))
      return out
    }

    const runNode = async (script, argv, stdinData) => {
      if (!subprocess) throw new Error('subprocess 服务不可用')
      const nodePath = await subprocess.resolveExecutable('node')
      const proc = subprocess.spawn({
        argv: [nodePath, '-e', script].concat(argv),
        cwd: 'D:/deepskhaness',
        stdio: { stdin: stdinData === undefined ? 'ignore' : { data: stdinData }, stdout: 'collect', stderr: 'collect' },
        graceMs: 60000,
      })
      const outcome = await proc.done
      if (outcome.exitCode !== 0) {
        const err = proc.collected && proc.collected.stderr ? proc.collected.stderr.readFrom(0).text : ''
        throw new Error('写入失败: ' + String(err).slice(0, 300))
      }
    }

    const writeBase64 = async (target, b64) => {
      const script = "const fs=require('fs');const t=process.argv[1];let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{fs.mkdirSync(require('path').dirname(t),{recursive:true});fs.writeFileSync(t,Buffer.from(d,'base64'));});"
      await runNode(script, [target], b64)
    }

    const listTree = async (dir, prefix) => {
      const target = await fs.resolve(dir)
      const entries = await fs.listDir(target)
      const out = []
      for (const e of entries) {
        if (!e || !e.name) continue
        const rel = prefix ? prefix + '/' + e.name : e.name
        if (e.type === 'directory') {
          let children = []
          try { children = await listTree(dir + '/' + e.name, rel) } catch (err) { children = [] }
          out.push({ name: rel, label: e.name, kind: 'dir', size: 0, children: children })
        } else {
          out.push({ name: rel, label: e.name, kind: 'file', size: typeof e.size === 'number' ? e.size : 0 })
        }
      }
      out.sort((a, b) => (a.kind === b.kind ? a.label.localeCompare(b.label) : a.kind === 'dir' ? -1 : 1))
      return out
    }

    const guess = (repo) => {
      const n = String(repo).toLowerCase()
      if (n.includes('skill') || n.includes('superpowers')) return { cat: 'skills', zh: '技能包（动态收录）' }
      if (n.includes('preset') || n.includes('memory')) return { cat: 'preset', zh: '预设（动态收录）' }
      if (n.includes('awesome')) return { cat: 'list', zh: '精选列表（动态收录）' }
      if (n.includes('plugin')) return { cat: 'plugin', zh: '插件（动态收录）' }
      return { cat: 'plugin', zh: 'GitHub 热门仓库（动态收录）' }
    }

    harness.handle('hot/list', async () => {
      try {
        const fetchScript = "(async()=>{let j;try{const r=await fetch('https://api.github.com/repos/Dominic789654/awesome-deepseek-harness/readme');j=await r.json()}catch(e){console.log('[]');return}let txt='';try{txt=Buffer.from(j.content||'','base64').toString('utf8')}catch(e){}const found=[];const seen={};const re=/github\\.com\\/([A-Za-z0-9_.-]+\\/[A-Za-z0-9_.-]+)/g;let m;while((m=re.exec(txt))){let r=m[1].replace(/\\/+$/,'').split('#')[0].split('?')[0];if(seen[r]||/^(deepseek-ai|Dominic789654|fendouai|beancookie|0xsline)\\/.test(r)||r.toLowerCase().includes('awesome'))continue;seen[r]=1;found.push(r);}console.log(JSON.stringify(found.slice(0,15)));})().catch(e=>console.log('[]'));"
        const dynOut = await runNode(fetchScript, [])
        let dyn = []
        try { dyn = JSON.parse(dynOut) } catch (e) { dyn = [] }
        const entries = []
        const seenRepo = {}
        for (const h of HOT) { entries.push(h); seenRepo[h.repo] = 1 }
        for (const r of dyn) {
          if (seenRepo[r] || entries.length >= 25) continue
          seenRepo[r] = 1
          const g = guess(r)
          entries.push({ repo: r, cat: g.cat, zh: g.zh })
        }
        const metaScript = "const repos=JSON.parse(process.argv[1]);(async()=>{const out={};for(const r of repos){try{const j=await (await fetch('https://api.github.com/repos/'+r)).json();out[r]={stars:j.stargazers_count||0,desc:j.description||''}}catch(e){}}console.log(JSON.stringify(out));})().catch(e=>console.log('{}'));"
        const metaOut = await runNode(metaScript, [JSON.stringify(entries.map((e) => e.repo))])
        let meta = {}
        try { meta = JSON.parse(metaOut) } catch (e) { meta = {} }
        return {
          ok: true,
          items: entries.map((e) => ({
            repo: e.repo,
            cat: e.cat,
            zh: e.zh,
            stars: (meta[e.repo] && meta[e.repo].stars) || 0,
            desc: (meta[e.repo] && meta[e.repo].desc) || '',
          })),
        }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('hot/download', async (args) => {
      try {
        const repo = args && args.repo ? String(args.repo) : ''
        if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) return { ok: false, error: '非法仓库名' }
        const name = repo.split('/')[1]
        const dir = REMOTE + '/' + name
        const dl = "const fs=require('fs');(async()=>{const urls=['https://codeload.github.com/'+process.argv[1]+'/zip/refs/heads/main','https://codeload.github.com/'+process.argv[1]+'/zip/refs/heads/master'];for(const u of urls){try{const r=await fetch(u,{redirect:'follow'});const ct=r.headers.get('content-type')||'';if(r.ok&&!ct.includes('text/html')){const b=Buffer.from(await r.arrayBuffer());fs.writeFileSync(process.argv[2],b);console.log('OK '+b.length);return;}}catch(e){}}console.log('FAIL');})().catch(e=>console.log('FAIL '+e.message));"
        const zipPath = dir + '/repo.zip'
        const out = await runNode(dl, [repo, zipPath])
        if (!String(out).startsWith('OK')) return { ok: false, error: '下载失败（仓库可能不存在或分支非 main/master）' }
        await runPwsh('unzip.ps1', [zipPath, dir])
        const probe = "const fs=require('fs'),path=require('path');const root=process.argv[1];const found=[];(function walk(d){let es=[];try{es=fs.readdirSync(d,{withFileTypes:true})}catch(e){return}for(const e of es){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name==='SKILL.md'||e.name==='agent.cordis.yml'||e.name==='preset.yml')found.push(p.replace(/\\\\/g,'/'))}})(root);console.log(JSON.stringify(found));"
        const probeOut = await runNode(probe, [dir])
        let files = []
        try { files = JSON.parse(probeOut) } catch (e) { files = [] }
        return { ok: true, dir: dir, files: files }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('hot/install', async (args) => {
      try {
        const kind = args && args.kind
        const file = args && args.file ? String(args.file) : ''
        const repo = args && args.repo ? String(args.repo) : ''
        if (!kind || !file) return { ok: false, error: '参数错误' }
        const name = repo.split('/')[1] || 'plugin'
        if (kind === 'skill') {
          const target = 'C:/Users/admin/.agents/skills/' + name
          const script = "const fs=require('fs');fs.mkdirSync(process.argv[2],{recursive:true});fs.copyFileSync(process.argv[1],process.argv[2]+'/SKILL.md');"
          await runNode(script, [file, target])
          return { ok: true, target: target }
        }
        if (kind === 'preset') {
          const target = 'C:/Users/admin/.dsh/.agent-presets/' + name
          const script = "const fs=require('fs'),path=require('path');const src=process.argv[1],dir=process.argv[2];fs.mkdirSync(dir,{recursive:true});for(const f of ['agent.cordis.yml','preset.yml']){const p=path.join(path.dirname(src),f);if(fs.existsSync(p))fs.copyFileSync(p,path.join(dir,f));}"
          await runNode(script, [file, target])
          return { ok: true, target: target }
        }
        return { ok: false, error: '未知类型' }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/upload-file', async (args) => {
      try {
        const data = args && args.data ? String(args.data) : ''
        if (!data) return { ok: false, error: '没有文件数据' }
        if (data.length > 21 * 1024 * 1024) return { ok: false, error: '文件超过 15MB' }
        const name = safeRel(args && args.name)
        if (!name) return { ok: false, error: '非法文件名' }
        const target = UPLOAD_DIR + '/' + name
        await writeBase64(target, data)
        const bytes = Math.floor(data.length * 3 / 4)
        return { ok: true, name: name, path: target, bytes: bytes }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/list-files', async () => {
      try {
        if (!fs) return { ok: false, error: 'fs 服务不可用' }
        const tree = await listTree(UPLOAD_DIR, '')
        return { ok: true, tree: tree }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/mkdir', async (args) => {
      try {
        const rel = safeRel(args && args.path)
        if (!rel) return { ok: false, error: '非法路径' }
        const script = "const fs=require('fs');fs.mkdirSync(process.argv[1],{recursive:true});"
        await runNode(script, [UPLOAD_DIR + '/' + rel])
        return { ok: true }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/rename', async (args) => {
      try {
        const oldRel = safeRel(args && args.path)
        const newName = args && typeof args.newName === 'string' ? String(args.newName).trim() : ''
        if (!oldRel || !newName) return { ok: false, error: '参数错误' }
        if (newName.length > 120 || /[\\/:*?"<>|]/.test(newName) || newName.includes('/')) return { ok: false, error: '非法文件名' }
        const idx = oldRel.lastIndexOf('/')
        const dir = idx >= 0 ? oldRel.slice(0, idx + 1) : ''
        const script = "const fs=require('fs');fs.renameSync(process.argv[1],process.argv[2]);"
        await runNode(script, [UPLOAD_DIR + '/' + oldRel, UPLOAD_DIR + '/' + dir + newName])
        return { ok: true, name: dir + newName }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/download', async (args) => {
      try {
        if (!fs) return { ok: false, error: 'fs 服务不可用' }
        const name = safeRel(args && args.name)
        if (!name) return { ok: false, error: '非法路径' }
        const target = await fs.resolve(UPLOAD_DIR + '/' + name)
        const data = await fs.readBytes(target, undefined, 50 * 1024 * 1024 + 4096)
        return { ok: true, name: name.split('/').pop(), data: toBase64(data) }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/delete', async (args) => {
      try {
        const rel = safeRel(args && args.path)
        if (!rel) return { ok: false, error: '非法路径' }
        const recursive = !!(args && args.recursive)
        const script = recursive
          ? "const fs=require('fs');fs.rmSync(process.argv[1],{recursive:true,force:true});"
          : "const fs=require('fs');fs.unlinkSync(process.argv[1]);"
        await runNode(script, [UPLOAD_DIR + '/' + rel])
        return { ok: true }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/preview', async (args) => {
      try {
        if (!fs) return { ok: false, error: 'fs 服务不可用' }
        const name = safeRel(args && args.name)
        if (!name) return { ok: false, error: '非法路径' }
        const target = await fs.resolve(UPLOAD_DIR + '/' + name)
        const lower = name.toLowerCase()
        const imgMatch = /\.(png|jpe?g|webp|gif)$/.exec(lower)
        if (imgMatch) {
          const data = await fs.readBytes(target, undefined, 5 * 1024 * 1024 + 4096)
          const media = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }[imgMatch[1]]
          return { ok: true, kind: 'image', mediaType: media, dataUrl: 'data:' + media + ';base64,' + toBase64(data) }
        }
        if (lower.endsWith('.pdf')) {
          const data = await fs.readBytes(target, undefined, 20 * 1024 * 1024 + 4096)
          return { ok: true, kind: 'pdf', mediaType: 'application/pdf', dataUrl: 'data:application/pdf;base64,' + toBase64(data) }
        }
        if (lower.endsWith('.docx')) {
          const out = await runPwsh('docx_read.ps1', [UPLOAD_DIR + '/' + name])
          const j = JSON.parse(out)
          if (j && j.ok === false) return { ok: false, error: j.error || 'docx 解析失败' }
          return { ok: true, kind: 'docx', lines: Array.isArray(j) ? j : [] }
        }
        if (/\.(txt|md|markdown|json|xml|java|py|js|ts|jsx|tsx|yml|yaml|properties|csv|log|conf|ini|sql|sh|bat|html|css|env|cfg|gradle|kt|go|rs|c|cpp|h|vue)$/i.test(name)) {
          const text = await fs.readText(target)
          return { ok: true, kind: 'text', content: text }
        }
        const st = await fs.stat(target)
        return { ok: true, kind: 'binary', size: st && typeof st.size === 'number' ? st.size : 0 }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/read-file', async (args) => {
      try {
        if (!fs) return { ok: false, error: 'fs 服务不可用' }
        const name = safeRel(args && args.name)
        if (!name) return { ok: false, error: '非法路径' }
        const target = await fs.resolve(UPLOAD_DIR + '/' + name)
        const text = await fs.readText(target)
        return { ok: true, content: text }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/write-file', async (args) => {
      try {
        if (!fs) return { ok: false, error: 'fs 服务不可用' }
        const name = safeRel(args && args.name)
        const content = args && typeof args.content === 'string' ? args.content : null
        if (!name || content === null) return { ok: false, error: '参数错误' }
        if (content.length > 512 * 1024) return { ok: false, error: '内容超过 512KB' }
        const target = await fs.resolve(UPLOAD_DIR + '/' + name)
        await fs.writeText(target, content)
        return { ok: true }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })

    harness.handle('upld/write-doc', async (args) => {
      try {
        const name = safeRel(args && args.name)
        const lines = args && Array.isArray(args.lines) ? args.lines.map(String) : null
        if (!name || !lines) return { ok: false, error: '参数错误' }
        if (lines.length > 5000) return { ok: false, error: '段落过多' }
        const out = await runPwsh('docx_write.ps1', [UPLOAD_DIR + '/' + name], JSON.stringify(lines))
        const j = JSON.parse(out)
        return j && j.ok === false ? { ok: false, error: j.error || '写回失败' } : { ok: true }
      } catch (e) {
        return { ok: false, error: String(e && e.message ? e.message : e) }
      }
    })
  },
}
