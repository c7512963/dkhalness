// 上传导入器（宿主端）：list_uploads 工具改为扫描 D:\deepskhaness\uploads\ 目录，
// 图片和任意文件都能列出（配合上传栏/附件上传自动落盘）。idPrefix 'upld'
// 注意：harness 是沙箱全局变量（不能 inject）；工具必须 defineTool 内嵌 execute +
// registerTool(ctx, tool)；parameters 根级不能声明 additionalProperties:false。
return {
  apply(ctx) {
    const fs = ctx.get('fs')
    const UPLOAD_DIR = 'D:/deepskhaness/uploads'
    const extType = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' }

    const listUploads = async () => {
      if (!fs) return []
      try {
        const target = await fs.resolve(UPLOAD_DIR)
        const entries = await fs.listDir(target)
        return entries
          .filter((e) => e && e.name && e.kind !== 'dir')
          .map((e) => {
            const m = /\.[a-z0-9]+$/i.exec(e.name)
            const ext = m ? m[0].toLowerCase() : ''
            return {
              name: e.name,
              path: UPLOAD_DIR + '/' + e.name,
              mediaType: extType[ext] || 'application/octet-stream',
              size: typeof e.size === 'number' ? e.size : 0,
            }
          })
      } catch (err) {
        return []
      }
    }

    const tool = harness.defineTool({
      name: 'list_uploads',
      description:
        '列出工作区 D:\\deepskhaness\\uploads\\ 目录下的所有上传文件（图片+其他文件：文件名/路径/类型/大小）。' +
        '当用户说"上传了/发了一张图/看看这张图/处理这个附件"而你没看到文件时，先调用本工具。' +
        '图片的 path 可以直接传给 see_image 查看内容。',
      parameters: { type: 'object', properties: {} },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: { type: 'string' },
                  path: { type: 'string' },
                  mediaType: { type: 'string' },
                  size: { type: 'integer' },
                },
              },
            },
          },
        },
        render: (args, value) => {
          const items = value && Array.isArray(value.items) ? value.items : []
          const text = items.length === 0
            ? 'uploads/ 目前没有文件'
            : items.map((x) => x.name + ' | ' + x.mediaType + ' | ' + (x.size / 1024).toFixed(0) + 'KB | ' + x.path).join('\n')
          return [{ type: 'text', text: text }]
        },
      },
      execute: async () => ({ items: await listUploads() }),
    })
    harness.registerTool(ctx, tool)
  },
}
