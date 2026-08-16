# plugins/ — 动态插件存档（进程重启后用于恢复）

DSH 的动态 Cordis 插件是进程本地的：会话重启后全部丢失。
本目录保存每个插件的完整源码，任何新会话按 `SKILL-restore-harness-plugins.md`
的步骤即可一键恢复（define + run，会出现批准卡，点允许即可）。

| 文件 | 插件 | 作用 | idPrefix |
|---|---|---|---|
| `qinghua-ui.client.js` | 青花瓷界面 | 主题令牌覆盖 + 缠枝/回纹/海水纹装饰 + 匾额 + 灵签 | `xinx` |
| `seeimage.host.js` | see_image | 本地图片 → qwen3-vl-flash 视觉描述（宿主工具） | `seei` |
| `refs.host.js` | /refs 路由 | 工作区参考图以 `/refs/<文件名>` 暴露给浏览器 | `imgv` |
| `pet.host.js` + `pet.client.js` | 韩立宠物 | 2D 矢量御剑韩立，心情/施法/拖动，绑定 agent 状态 | `otter` |
| `upload-inbox.host.js` | 上传导入器 | GUI 附件上传的图片自动导入 uploads/ + list_uploads 工具 | `upld` |
| `upload-ui.client.js` + `upload-ui.host.js` | 文件管理 | 全屏文件管理面板：树形文件库 + 上传到当前目录 + 新建文件夹 + 预览编辑（text/docx 编辑，image/pdf 预览） | `upui`（双端） |
| `scripts/docx_read.ps1` + `docx_write.ps1` | docx 解析脚本 | upui 宿主端调 pwsh 提取/写回 docx 段落（保留样式） | 依赖文件 |

## 安装为全局技能（一次性的，让"恢复插件"变成任何会话都能触发）

把 `SKILL-restore-harness-plugins.md` 复制到：

```
C:\Users\admin\.agents\skills\restore-harness-plugins\SKILL.md
```

PowerShell 命令（需要管理员/放开权限，DSH 沙箱默认只允许写 D:\deepskhaness）：

```powershell
New-Item -ItemType Directory -Force C:\Users\admin\.agents\skills\restore-harness-plugins | Out-Null
Copy-Item D:\deepskhaness\plugins\SKILL-restore-harness-plugins.md C:\Users\admin\.agents\skills\restore-harness-plugins\SKILL.md
```

装好后，任何新会话里说"恢复插件"，会话 agent 就会读本技能并自动重建 4 个插件。
