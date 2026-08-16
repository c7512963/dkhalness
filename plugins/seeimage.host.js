// see_image 视觉工具（宿主端）：本地图片 → qwen3-vl-flash 描述。idPrefix 'seei'
// 依赖：Node 内置 fetch 可用；图片经 base64 传给 DashScope OpenAI 兼容端点。
return {
  inject: ['harness', 'fs', 'subprocess'],
  apply(ctx) {
    const { harness, fs, subprocess } = ctx
    const DASHSCOPE_KEY = 'sk-ws-H.RXLEPYY.J5lO.MEQCIFWDRVpyDG_C2lf7wJ8YeISImboiUhe0wOA9_JD8RWBDAiBo2yCHg_1U6npLq4rgihwp5QXO8BuJoT3iSFpsW3vhHg'
    const MODEL = 'qwen3-vl-flash'
    const ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
    const MAX_IMG = 12 * 1024 * 1024 // 12MB 上限

    const describe = async (path) => {
      const abs = fs.resolve(path)
      const data = await fs.readBytes(abs)
      if (data.byteLength > MAX_IMG) throw new Error('图片超过 12MB，请压缩后再试')
      const b64 = Buffer.from(data).toString('base64')
      const body = {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: '请用中文详细描述这张图片：整体内容、人物/主体形象、颜色、姿态、构图。然后指出明显问题（如果有）：遮挡、变形、贴图错位、比例失调、光影异常等。最后给出改进建议（如果有）。' },
              { type: 'image_url', image_url: { url: 'data:image/png;base64,' + b64 } },
            ],
          },
        ],
        temperature: 0.4,
      }
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + DASHSCOPE_KEY,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error('DashScope HTTP ' + res.status + ': ' + txt.slice(0, 400))
      }
      const json = await res.json()
      const content = json?.choices?.[0]?.message?.content
      if (!content) throw new Error('DashScope 返回空内容')
      return String(content)
    }

    const tool = harness.defineTool({
      name: 'see_image',
      description: '看图：读取一张本地图片文件（png/jpg/webp/gif），调用视觉模型返回详细中文描述（主体形象、颜色、姿态 + 明显问题：遮挡/变形/贴图错位/比例失调等）。用于查看渲染预览、参考图、截图。',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '图片路径，如 hanli_preview.png 或绝对路径' },
        },
        required: ['path'],
        additionalProperties: false,
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: '视觉模型的详细描述' },
          },
          required: ['text'],
          additionalProperties: false,
        },
        render: (data) => data.text,
      },
    })
    const run = async (input) => ({ text: await describe(input.path) })
    harness.registerTool(tool, run)

    ctx.effect(() => () => {
      // harness 生命周期负责注销工具；无额外资源
    })
  },
}
