// see_image 视觉工具（宿主端）：本地图片 → qwen3-vl-flash 描述。idPrefix 'seei'
// 正确写法：harness 是沙箱全局变量，绝不 inject；fs/subprocess 用 ctx.get 判空；
// 工具用 defineTool 内嵌 execute + registerTool(ctx, tool) 两参。
return {
  apply(ctx) {
    const subprocess = ctx.get('subprocess')
    const fs = ctx.get('fs')
    if (!subprocess || !fs) return

    const WORKSPACE = 'D:/deepskhaness'
    const KEY = 'sk-ws-H.RXLEPYY.J5lO.MEQCIFWDRVpyDG_C2lf7wJ8YeISImboiUhe0wOA9_JD8RWBDAiBo2yCHg_1U6npLq4rgihwp5QXO8BuJoT3iSFpsW3vhHg'
    const BASE = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    const MODEL = 'qwen3-vl-flash'

    const NODE_SCRIPT = [
      "const fs = require('fs');",
      "const img = process.argv[1];",
      "const key = process.argv[2];",
      "const mime = img.toLowerCase().endsWith('.png') ? 'image/png' : (img.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg');",
      "const b64 = fs.readFileSync(img).toString('base64');",
      "const body = JSON.stringify({ model: '" + MODEL + "', messages: [{ role: 'user', content: [ { type: 'text', text: '请详细描述这张图片的内容。如果图中有动漫/3D角色，描述其发型、服饰、颜色、姿态、表情、整体比例。重点指出画面中明显的问题：是否被遮挡、变形、贴图错位、五官异常、比例失调、画质差、构图奇怪。用中文回答，简洁但具体，250字以内。' }, { type: 'image_url', image_url: { url: 'data:' + mime + ';base64,' + b64 } } ] }], max_tokens: 700 });",
      "(async () => {",
      "  const r = await fetch('" + BASE + "/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, body });",
      "  const j = await r.json();",
      "  const text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;",
      "  console.log(text || JSON.stringify(j).slice(0, 600));",
      "})().catch(function (e) { console.log('VISION_ERR ' + e.message); });",
    ].join('\n')

    const runVision = async (imagePath) => {
      const target = await fs.resolve(imagePath, { cwd: WORKSPACE })
      const abs = fs.processPath(target)
      const nodeExe = await subprocess.resolveExecutable('node')
      const handle = subprocess.spawn({
        argv: [nodeExe, '-e', NODE_SCRIPT, abs, KEY],
        cwd: WORKSPACE,
        stdio: { stdin: 'ignore', stdout: 'collect', stderr: 'collect' },
        graceMs: 45000,
      })
      await handle.done
      const out = handle.collected && handle.collected.stdout ? handle.collected.stdout.readFrom(0).text : ''
      const err = handle.collected && handle.collected.stderr ? handle.collected.stderr.readFrom(0).text : ''
      return (out || err || 'no output').trim()
    }

    const tool = harness.defineTool({
      name: 'see_image',
      description: '看图：读取工作区里的图片文件，调用 Qwen3-VL 视觉模型返回详细描述（人物形象、颜色、姿态 + 明显问题：遮挡/变形/贴图错位/比例失调等）。用于查看渲染预览、参考图、截图。',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '图片路径，相对 D:\\deepskhaness 或绝对路径，如 hanli_preview.png' },
        },
        required: ['path'],
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean' },
            description: { type: 'string' },
            error: { type: 'string' },
          },
        },
        render: (args, value) => {
          const v = value || {}
          const text = v.error ? '看图失败: ' + v.error : (v.description || JSON.stringify(v))
          return [{ type: 'text', text: text }]
        },
      },
      execute: async (args, exec) => {
        try {
          const description = await runVision(String(args.path))
          return { ok: true, description: description }
        } catch (e) {
          return { ok: false, error: String(e && e.message ? e.message : e) }
        }
      },
    })
    harness.registerTool(ctx, tool)
  },
}
