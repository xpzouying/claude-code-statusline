# 🐾 CC Pet Statusline

一个为 Claude Code 设计的宠物主题状态栏插件，通过可爱的 emoji 宠物展示你的 token 使用情况！

## 🌟 特性

- 🎮 **动态宠物状态**：根据 token 消耗速率展示不同的宠物状态
- 📊 **5小时窗口监控**：实时显示当前 5 小时计费窗口的使用百分比
- ⏱️ **剩余时间提醒**：清晰展示窗口剩余可用时间
- 💰 **成本追踪**：实时显示当前会话的花费
- 🎨 **彩色进度条**：直观的使用量可视化

## 🐱 宠物状态说明

| 状态 | Emoji | 说明 | Token 消耗速率 |
|------|-------|------|---------------|
| 睡觉中 | 😴 | 完全没有消耗 | 0 tokens/min |
| 休息中 | 🐱 | 极低消耗 | < 10 tokens/min |
| 散步中 | 🚶 | 低速消耗 | 10-50 tokens/min |
| 运动中 | 🐕 | 中速消耗 | 50-150 tokens/min |
| 疯狂中 | 🦄 | 高速消耗 | > 150 tokens/min |
| 累坏了 | 😵 | 接近限制 | 使用量 > 95% |

## 📦 安装

### 方式一：快速安装（推荐）

1. 克隆或下载本项目
2. 在项目根目录运行安装命令：

```bash
cd cc-pet-statusline
npm install
chmod +x index.js
```

3. 配置 Claude Code（见下方配置部分）

### 方式二：本地全局安装

在项目目录中运行：

```bash
# 使用 npm link 创建全局链接
cd cc-pet-statusline
npm link

# 验证安装
which cc-pet-statusline
```

或者直接从本地路径全局安装：

```bash
# 从本地路径安装
npm install -g /path/to/cc-pet-statusline

# 例如
npm install -g ./cc-pet-statusline
```

## ⚙️ 配置

### 1. 编辑 Claude Code 配置文件

在你的项目根目录创建或编辑 `.claude/settings.json`：

```json
{
  "statusLine": {
    "type": "command",
    "command": "node /path/to/cc-pet-statusline/index.js",
    "padding": 0
  }
}
```

如果全局安装，可以使用：

```json
{
  "statusLine": {
    "type": "command",
    "command": "cc-pet-statusline",
    "padding": 0
  }
}
```

### 2. 重启 Claude Code

配置完成后，重新启动 Claude Code 会话即可看到宠物状态栏。

## 🎯 效果示例

低使用量：
```
😴 睡觉中 | 5h: 5% ▓░░░░░░░░░ | 剩余 4h 45m | 💰 $0.10 | Pro订阅
```

中等使用量：
```
🐕 运动中 | 5h: 40% ▓▓▓▓░░░░░░ | 剩余 3h 0m | 💰 $0.80 | Pro订阅
```

高使用量：
```
🦄 疯狂中 | 5h: 75% ▓▓▓▓▓▓▓▓░░ | 剩余 1h 15m | 💰 $1.50 | Pro订阅
```

接近限制：
```
😵 累坏了 | 5h: 96% ▓▓▓▓▓▓▓▓▓▓ | 剩余 12m | 💰 $1.92 | API
```

## 🧪 测试

项目包含测试脚本，可以模拟不同的使用场景：

```bash
npm test
```

## 🔧 故障排除

### 状态栏不显示

1. 确认 `.claude/settings.json` 配置正确
2. 确保脚本路径正确且有执行权限
3. 重启 Claude Code 会话

### 配置格式错误

如果出现 "Expected object, but received string" 错误，说明配置格式不正确。

**错误格式**：
```json
{
  "statusLine": "cc-pet-statusline"
}
```

**正确格式**：
```json
{
  "statusLine": {
    "type": "command",
    "command": "cc-pet-statusline",
    "padding": 0
  }
}
```

### 数据不准确

- 本插件依赖 `ccusage` 工具读取本地日志文件
- 确保 Claude Code 的日志文件正常生成
- 首次使用可能需要等待一些活动后才能显示准确数据

### 宠物状态不变化

- 宠物状态基于实时的 token 消耗速率
- 如果没有活动，宠物会保持睡觉或休息状态
- 开始对话后宠物会根据消耗速率改变状态

## 🛠️ 技术栈

- **Node.js 18+**：核心运行环境
- **ccusage**：Token 统计引擎
- **ANSI Colors**：终端颜色支持

## 📝 工作原理

1. Claude Code 每 300ms 调用一次状态栏脚本
2. 脚本通过 stdin 接收当前会话的 JSON 数据
3. 调用 ccusage 分析本地日志文件获取 token 使用统计
4. 根据消耗速率计算宠物状态
5. 输出格式化的状态栏到 stdout

## 🚀 未来计划

- [ ] 添加更多宠物形象
- [ ] 支持自定义阈值配置
- [ ] 添加历史统计功能
- [ ] 支持声音提醒
- [ ] 开发 tmux 插件版本
- [ ] 支持像素艺术动画

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

## 🙏 致谢

- [ccusage](https://github.com/ryoppippi/ccusage) - 提供核心 token 统计功能
- Claude Code 团队 - 提供 status line API 支持

---

Made with ❤️ for Claude Code users