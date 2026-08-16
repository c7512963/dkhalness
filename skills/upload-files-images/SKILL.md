# 上传文件与图片（Upload Files & Images）

处理用户通过 DSH 网页 GUI 上传的文件/图片，并让 agent 能真正"看到"它们。

**何时使用**：用户说"上传了文件/我发了一张图/看看这张图/处理这个附件/用这张图做…"，
或消息里带了图片但你看不到内容时。

## 用户怎么上传

1. **图片**：GUI 输入框左下角有**回形针（attach）按钮**，点它选择图片（仅支持
   png/jpeg/webp/gif），发送。图片会被宿主 `attachments` 服务存到
   `%DSH_HOME%\attachments\v1\objects\<2位>\<sha256>`，消息里是 `{type:'image', attachment: ImageAttachmentRef}` 块。
2. **其他文件**：GUI 附件只收图片。文档/压缩包等请用户放到
   `D:\deepskhaness`（或其子目录）里，然后在对话里告诉你路径。

## 插件（上传导入器）

`upload-inbox` 插件（存档 `D:\deepskhaness\plugins\upload-inbox.host.js`）自动做两件事：

- 监听 `agent/inbox/inserted`，发现图片块就用 `attachments.readImage` 读出字节，
  经 base64 + node 子进程解码写入 `D:\deepskhaness\uploads\<文件名>`（自动去重/改名）。
- 注册工具 **`list_uploads`**：列出已导入的图片（name/path/类型/尺寸/大小）。

**如果插件没在运行**（会话重启后必然如此）：按恢复流程重建——`cordis_define`
（kind new，idPrefix `upld`，name "上传导入器"，code.host 取存档文件内容去掉注释行）
→ `cordis_run`（run 模式，出现批准卡让用户点允许）。

## Agent 处理流程

1. 用户说上传了图片 → **先调 `list_uploads`**，拿到 path（如 `uploads/xxx.png`）。
2. 用 **`see_image`** 查看内容（本会话模型不支持图片输入，不要用 read_image）。
   示例：`see_image(path='uploads/xxx.png')`。
3. 需要给用户展示/引用时，可用 `/refs` 路由（imgv 插件）：
   `http://127.0.0.1:3080/refs/uploads/xxx.png`。
4. 普通文件：`read`/`grep` 按用户给的路径读。

## 故障处理

- `list_uploads` 返回空但用户确实传了图：插件启动后才上传的才会导入；
  让用户重新发一次，或把图复制进 `D:\deepskhaness\uploads\`。
- 二进制写入失败：确认 `subprocess.resolveExecutable('node')` 能找到 node；
  node 子进程必须在工作区路径内读写（沙箱）。
- 附件读取报错：检查 `attachments` 服务是否挂载
  （`cordis_inspect_query` 查 host Service 目录）。
- 模型看不到图是正常的：deepseek-v4-flash 是纯文本模型，图片块不会进 prompt，
  一切图片内容都走 see_image。
