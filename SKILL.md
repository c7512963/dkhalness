# 文件管理（File Manager）

处理用户上传文件、管理 `uploads/` 文件库、预览与在线编辑文件（文本/docx/PDF/图片）。

**何时使用**：用户说"上传文件/打开文件库/文件管理/编辑简历/改一下这个文件/看看这个附件"，
或消息里有文件上传事件（📎 我上传了…）时。

## 文件在哪

- 上传的文件统一存在 **`D:\deepskhaness\uploads\`**（可含子目录，如 `uploads/简历/2025/`）。
- GUI 输入框上方有 **`✒️ 文件管理`** 按钮（客户端插件 upui-6 提供），打开全屏面板：
  树形目录浏览 / 上传到当前目录 / 新建文件夹 / 预览 / 在线编辑 / 重命名 / 下载 / 多选批量 / 删除。

## 面板能力一览

| 操作 | 说明 |
|---|---|
| 单击文件 | 打开预览弹窗（文本/docx 显示内容，图片/PDF 直接预览） |
| ✏️ 修改（预览内） | 文本/docx 进入编辑，保存写回原文件（docx 段落级写回，保留格式） |
| ✏️ 按钮（行 hover） | 内联重命名（回车确认） |
| ⬇️ 按钮（行 hover） | 下载文件到本地 |
| 🗑️ 按钮（行 hover） | 删除文件/文件夹（二次确认） |
| ☑ 多选 | 勾选多项后批量下载/删除 |
| 📎 上传到当前目录 | 上传到当前选中的文件夹（支持子目录路径） |

## Agent 侧工具

- **`list_uploads`**（upld-5 插件）：列出 `uploads/` 目录所有文件（name/path/类型/大小）。
  用户上传文件后先调用它确认落盘位置。
- **`see_image`**：看图片内容（本会话模型不支持图片输入，图片一律用 see_image）。
- 文本文件用 `read` 读取；docx 用 `plugins/scripts/docx_read.ps1` 提取段落（或让用户面板里编辑）。

## 插件恢复（插件不在运行时）

动态插件是进程本地的，会话重启后丢失。**优先检查自动恢复**：

- 若本会话使用 **"创造模式·自动恢复"** 预设（`cordis-auto`），其系统提示已要求 agent 在每轮开始时
  自动检查并重建插件——此时直接往下干活即可，无需再手动恢复。
- 否则按 restore-harness-plugins 技能恢复两个插件：
1. **upui-6（文件管理面板，双端）**：存档 `D:\deepskhaness\plugins\upload-ui.client.js`（code.client）+
   `D:\deepskhaness\plugins\upload-ui.host.js`（code.host）；`cordis_define`（kind new，idPrefix `upui`）→
   `cordis_run`（出现批准卡让用户点允许）。
2. **upld-5（list_uploads 工具，宿主）**：存档 `D:\deepskhaness\plugins\upload-inbox.host.js`（code.host）；
   idPrefix `upld`，同样 define + run。
3. 依赖文件：`D:\deepskhaness\plugins\scripts\docx_read.ps1`、`docx_write.ps1`（docx 预览/编辑用），
   恢复时必须存在。
4. 注意：`harness` 是沙箱全局变量，**不要 inject**；工具用 `harness.defineTool` 内嵌 execute +
   `harness.registerTool(ctx, tool)` 两参注册；宿主沙箱无 Buffer，base64 解码走 node 子进程。

## 故障处理

- 面板按钮在但点文件没反应：刷新页面；仍不行则 cordis_stop 再 run upui-6。
- 上传失败：单文件 ≤15MB；目录路径含非法字符会被拒。
- docx 编辑保存失败：确认 scripts/ 目录存在、文件未被其他程序占用。
