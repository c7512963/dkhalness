// /refs 白名单图片路由（宿主端）：把工作区里的参考图以 /refs/<文件名> 暴露给浏览器。idPrefix 'imgv'
// 白名单：D:\deepskhaness 下 ref_*.png|jpg、hanli_preview.png、*.glb 等。
return {
  inject: ['webServer', 'fs', 'ctx'],
  apply(ctx) {
    const webServer = ctx.webServer
    const fs = ctx.fs
    const ROOT = 'D:/deepskhaness'
    const WHITELIST = /^(ref_|hanli_|preview|screenshot|pz)/i

    const mime = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.glb': 'model/gltf-binary',
      '.svg': 'image/svg+xml',
      '.json': 'application/json',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
    }

    const disposer = webServer.register({
      kind: 'prefix',
      path: '/refs',
      handler: async (req, res) => {
        try {
          const rel = decodeURIComponent(req.url.split('?')[0].replace(/^\/refs\/?/, ''))
          if (!rel || rel.includes('..') || rel.includes(':')) {
            res.writeHead(403, { 'Content-Type': 'text/plain' })
            return res.end('forbidden')
          }
          const abs = ROOT + '/' + rel
          const ext = rel.slice(rel.lastIndexOf('.')).toLowerCase()
          const type = mime[ext] || 'application/octet-stream'
          const data = await fs.readBytes(abs)
          res.writeHead(200, {
            'Content-Type': type,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
          })
          res.end(Buffer.from(data))
        } catch (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end('not found: ' + String(err && err.message ? err.message : err).slice(0, 200))
        }
      },
    })
    ctx.effect(() => () => disposer && disposer())
  },
}
