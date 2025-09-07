# 🐾 Claude Code Statusline

A cute pet-themed status line plugin for Claude Code that displays your token usage through adorable emoji pets!

## ✨ Features

- 🐱 **Dynamic Pet States**: Different pet behaviors based on your actual token usage percentage  
- 📊 **5-Hour Window Monitoring**: Real-time display of current billing window usage
- ⏱️ **Time Remaining**: Clear indication of remaining time in the current session
- 💰 **Cost Tracking**: Live cost updates for your current session
- 🎨 **Visual Progress Bar**: Intuitive usage visualization with color coding
- ⚡ **High Performance**: Direct ccusage module integration for faster response

## 🐱 Pet States

Your pet reacts to your actual token usage percentage (not burn rate):

| Usage | Pet | State | Description |
|-------|-----|-------|-------------|
| 0-10% | 😸😌🐱 | Just Started | Taking it easy, just getting warmed up |
| 10-30% | 🐱😽😻 | Light Work | Working leisurely, nice and steady |
| 30-60% | 🙀😺😻 | Getting Busy | Picking up the pace, getting focused |
| 60-80% | 😺😼😻 | Very Active | Working hard, high concentration |
| 80-95% | 🤪😼😾 | Intense Mode | Full sprint mode, maximum effort |
| 95-100% | 😵😿😰 | Nearly Exhausted | Almost at the limit, hang in there! |

Plus random special states: 😽 Stretching, 😻 Grooming, 🥱 Yawning, and more!

## 📦 Installation

### Recommended: Global npm Installation

Install directly from npm registry:

```bash
# Install globally
npm install -g claude-code-statusline

# Verify installation
claude-code-statusline --version
```

### Alternative: Local Development

For development or custom modifications:

```bash
# Clone the project
git clone https://github.com/xpzouying/claude-code-statusline.git
cd claude-code-statusline

# Install dependencies
npm install

# Link locally for testing
npm link
```

## ⚙️ Configuration

### Setup Claude Code

Create or edit `.claude/settings.json` in your project directory:

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-code-statusline",
    "padding": 0
  }
}
```

For local development installation:

```json
{
  "statusLine": {
    "type": "command", 
    "command": "node /path/to/claude-code-statusline/index.js",
    "padding": 0
  }
}
```

### Restart Claude Code

After configuration, restart your Claude Code session to see the pet status line.

## 🎯 Examples

Low usage:
```
😌 Taking it easy~ | 5h: 8% ▓░░░░░░░░░ | 4h 36m left | 💰 $0.15 | Pro
```

Medium usage:
```
🙀 Getting busy! | 5h: 45% ▓▓▓▓▓░░░░░ | 2h 45m left | 💰 $0.89 | Pro
```

High usage:
```
😾 Super focused! | 5h: 85% ▓▓▓▓▓▓▓▓▓░ | 45m left | 💰 $1.70 | API
```

Almost exhausted:
```
😰 Hang in there! | 5h: 97% ▓▓▓▓▓▓▓▓▓▓ | 9m left | 💰 $1.94 | Pro
```

## 🧪 Testing

Run the test suite to verify functionality:

```bash
npm test
```

## 🔧 Troubleshooting

### Status line not showing

1. Check `.claude/settings.json` format is correct
2. Ensure script path exists and has execute permissions  
3. Restart Claude Code session

### Configuration errors

If you see "Expected object, but received string":

❌ **Wrong format**:
```json
{
  "statusLine": "cc-pet-statusline"  
}
```

✅ **Correct format**:
```json
{
  "statusLine": {
    "type": "command",
    "command": "cc-pet-statusline",
    "padding": 0
  }
}
```

### Inaccurate data

- Plugin depends on ccusage reading local log files
- Ensure Claude Code is generating usage logs properly
- First usage may need some activity before showing accurate data

## 🛠️ Technical Details

### Architecture

- **Node.js 18+**: Runtime environment
- **ccusage modules**: Direct import for data loading (`ccusage/data-loader`, `ccusage/calculate-cost`)
- **ANSI Colors**: Terminal color support
- **Performance**: ~300ms response time with direct module imports

### How it works

1. Claude Code calls the status line script every 300ms
2. Script receives current session JSON data via stdin
3. Directly imports ccusage modules to analyze local usage logs  
4. Calculates pet state based on token usage percentage vs historical maximum
5. Outputs formatted status line to stdout

### Data Sources

- **Primary**: Direct ccusage module calls for active session blocks
- **Fallback**: Claude Code provided cost data when ccusage unavailable
- **Test Mode**: Mock data when session_id starts with 'test-'

## 🚀 Roadmap

- [ ] More pet themes (dogs, birds, etc.)
- [ ] Customizable usage thresholds  
- [ ] Historical usage trends
- [ ] Sound notifications
- [ ] tmux plugin version
- [ ] Pixel art animations

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License

## 🙏 Acknowledgments

Special thanks to:

- **[ccusage](https://github.com/ryoppippi/ccusage)** by [@ryoppippi](https://github.com/ryoppippi) - Provides the core token usage analysis and session block functionality that powers this plugin. Without ccusage's excellent data loading and cost calculation modules, this pet status line wouldn't be possible.

- **Claude Code Team** - For providing the status line API and extensibility support

---

Made with ❤️ for the Claude Code community