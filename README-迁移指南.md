# DSH 换电脑迁移指南

迁移包：`dsh-migration-pack.zip`（含插件存档 / 技能 / 自动恢复预设 / 简历文件 / 投递脚本）

## 迁移包内容

| 目录 | 内容 | 装到新电脑哪里 |
|---|---|---|
| `plugins/` | 6 个插件的完整源码 + docx 脚本 + 技能草稿 | `D:\deepskhaness\plugins\` |
| `skills/` | file-manager、restore-harness-plugins、upload-files-images | `C:\Users\<你>\ .agents\skills\` |
| `cordis-auto-preset/` | "创造模式·自动恢复"预设（含自动恢复提示） | `C:\Users\<你>\.dsh\.agent-presets\cordis-auto\` |
| `uploads/` | 上传的简历等文件 | `D:\deepskhaness\uploads\` |
| `bot/` | 自动投递脚本（需在新电脑重新 npm install playwright） | `D:\deepskhaness\bot\` |

## 新电脑步骤

1. **装 DeepSeek Harness**（和现在这台一样的装法），能打开 Web GUI。
2. 解压迁移包，按上表把目录复制到对应位置。
3. 启动 DSH → 新建会话 → 预设选择器选 **"创造模式·自动恢复"**。
4. 发任意消息（如"在吗"）→ agent 自动检查并按 `plugins/` 存档重建全部插件 → 批准卡点允许 → 刷新页面。
5. 说"文件管理"→ 技能加载，文件库/插件市场恢复使用。

## 自动投递（如需要）

- `bot/` 里是脚本，新电脑：`cd D:\deepskhaness\bot && npm install playwright`（需要允许下载 Chromium，或换本机浏览器）。
- 登录态（cookie/浏览器 profile）**不随迁移包走**，需要在新电脑重新登录一次。

## 注意事项

- 技能目录和预设目录在 `C:\Users\admin\` 下，换用户名要改路径。
- 工作区其他文件（PZ 地图、Blender 模型、参考图等）不在包里，需要单独拷贝 `D:\deepskhaness` 整个目录（量大）。
- 重启后插件自动恢复依赖"自动恢复预设"，新电脑务必装 `cordis-auto-preset`。
