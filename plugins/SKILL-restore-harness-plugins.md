# 恢复 Harness 插件（Restore Harness Plugins）

把 DSH 会话的 4 个动态 Cordis 插件从存档文件恢复到当前进程。

**何时使用**：会话重启后动态插件全部丢失（Cordis 插件是进程本地的），
用户说"恢复插件/插件没了/把插件弄回来"时。任何新会话都可以用本技能恢复。

**存档位置**：`D:\deepskhaness\plugins\`
- `qinghua-ui.client.js` — 青花瓷界面（主题令牌 + 装饰层）→ idPrefix `xinx`
- `seeimage.host.js` — see_image 视觉工具 → idPrefix `seei`
- `refs.host.js` — `/refs` 白名单图片路由 → idPrefix `imgv`
- `pet.host.js` + `pet.client.js` — 韩立宠物（宿主状态 + 客户端 SVG）→ idPrefix `otter`
- `upload-inbox.host.js` — 上传导入器（list_uploads 扫描 uploads/ 目录，图片+文件都能列）→ idPrefix `upld`
- `upload-ui.client.js` + `upload-ui.host.js` — 文件管理（一个全屏面板整合上传+树形文件库+预览编辑；**双端插件**，两个文件都要提供 code.host 和 code.client；host 端 handle 有 upld/upload-file、upld/list-files、upld/mkdir、upld/preview、upld/read-file、upld/write-file、upld/write-doc）→ idPrefix `upui`
- `scripts/docx_read.ps1` + `scripts/docx_write.ps1` — docx 段落提取/写回脚本（upui 的 docx 预览编辑依赖，恢复时必须保证 `D:\deepskhaness\plugins\scripts\` 存在）

**恢复步骤**（按顺序执行，全部成功后告诉用户刷新页面）：

1. 先用 `read` 读取存档文件拿到完整代码（宿主/客户端是独立文件）。
2. 对每个插件调用 `cordis_define`：
   - `plugin.kind: "new"`，`idPrefix` 用上表；不要复用旧 id（系统会分配新后缀）。
   - `name` / `purpose` 取文件顶部注释里的中文名和一句说明。
   - `code.host` / `code.client` 用文件里的完整函数体字符串（去掉文件顶部的 `//` 注释行即可）。
   - 两个文件的插件（pet）必须同时提供 `code.host` 和 `code.client`。
   - **不要 inject 'harness'**（它是沙箱全局变量，inject 会让插件永远 waiting）；
     服务一律 `ctx.get(...)` 取并判空。工具必须 `harness.defineTool` 内嵌 `execute`
     后 `harness.registerTool(ctx, tool)` 两参注册。
3. 依次 `cordis_run`（`mode: "run"`）：
   - 返回值 `awaiting-approval` 时，让用户在界面批准卡点里点"允许"，不要反复重试。
   - 建议顺序：青花瓷 → see_image → /refs → 上传导入器(upld) → 上传图片栏(upui) → 宠物（宠物最后，因为依赖前面）。
4. 全部运行成功后，提醒用户刷新页面查看效果。
   - 客户端插件（青花瓷/上传栏/宠物）运行时会出现批准卡，必须让用户点"允许"。

**故障处理**：
- 客户端 UI（青花瓷/宠物）不显示但状态是 running：客户端运行器可能卡死，
  把全部动态插件 `cordis_stop` 后再逐个 `cordis_run`。
- `see_image` 报 DashScope 错误：检查网络（Node fetch 可用即可，不要用 pwsh/curl 测外网）。
- 工具/路由不生效：`cordis_inspect_self` 查看当前包与诊断。

**注意**：恢复出的插件仍是进程本地的，下次重启仍会丢失；本技能就是重复恢复用的。
