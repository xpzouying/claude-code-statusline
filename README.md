# 🐾 Claude Code Status Line

A collection of cute pet-themed status line plugins for various tools and environments. Transform your boring status bars into delightful displays featuring adorable emoji pets that react to your usage patterns!

## 📦 Packages

### [@claude-status-line/core](./packages/core/)
Core library containing shared pet states, animations, and utilities for building status line plugins.

### [claude-code-statusline](./packages/claude-code/)
Status line plugin for Claude Code that displays token usage through animated emoji pets.

**Installation:**
```bash
npm install -g claude-code-statusline
```

**Features:**
- 🐱 Dynamic pet states based on actual token usage percentage
- 📊 5-hour billing window monitoring with progress bars
- ⚡ High-performance direct ccusage integration
- 🌍 International support with English interface
- 🎨 Beautiful ANSI color-coded visualizations

## 🎯 Coming Soon

### tmux-pet-statusline *(Planned)*
A tmux status bar plugin featuring the same loveable pets for terminal multiplexer users.

### More Platforms *(Future)*
- Zsh prompt theme
- Vim/Neovim statusline
- Terminal title updates

## 🚀 Quick Start

### For Claude Code Users

1. **Install the plugin:**
   ```bash
   npm install -g claude-code-statusline
   ```

2. **Configure Claude Code:**
   
   Add to your `.claude/settings.json`:
   ```json
   {
     "statusLine": {
       "type": "command", 
       "command": "claude-code-statusline",
       "padding": 0
     }
   }
   ```

3. **Enjoy your pet companion!**
   
   Your status line will show something like:
   ```
   😺 Very active! | 5h: 67% ▓▓▓▓▓▓▓░░░ | 1h 45m left | 💰 $1.34 | Pro Plan
   ```

## 🐱 Pet States

Your emoji pets react intelligently to your usage patterns:

| Usage Range | Pet Behavior | Description |
|-------------|--------------|-------------|
| 0-10% | 😸😌🐱 **Just Started** | Taking it easy, warming up |
| 10-30% | 🐱😽😻 **Light Work** | Working casually, nice and steady |
| 30-60% | 🙀😺😻 **Getting Busy** | Picking up steam, pace quickening |
| 60-80% | 😺😼😻 **Very Active** | Deeply focused, full of energy |
| 80-95% | 🤪😼😾 **Intense Mode** | High intensity, going full throttle |
| 95-100% | 😵😿😰 **Nearly Exhausted** | Pushing limits, hang in there! |

Plus random special behaviors: 😽 *Stretching*, 😻 *Grooming*, 🥱 *Yawning*, and more!

## 🛠️ Development

This is a **monorepo** managed with npm workspaces:

```bash
# Clone the repository
git clone https://github.com/xpzouying/claude-code-statusline.git
cd claude-code-status-line

# Install all dependencies
npm install

# Run tests for all packages
npm run test

# Work on a specific package
cd packages/claude-code
npm run test
```

### Project Structure

```
claude-code-status-line/
├── packages/
│   ├── core/           # Shared logic and utilities
│   ├── claude-code/    # Claude Code plugin  
│   └── tmux/          # Future tmux plugin
├── docs/              # Documentation
├── package.json       # Workspace configuration
└── README.md         # This file
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs** - Found an issue? Open a GitHub issue
2. **Request features** - Have ideas for new pet behaviors or platforms? Let us know!
3. **Submit PRs** - Bug fixes and improvements are always appreciated
4. **Add translations** - Help us support more languages
5. **Create new plugins** - Port the pets to other tools and platforms

### Development Guidelines

- Follow the existing code style and patterns
- Add tests for new features
- Update documentation for user-facing changes
- Use the shared `@claude-status-line/core` package for common logic

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- **[ccusage](https://github.com/ryoppippi/ccusage)** by [@ryoppippi](https://github.com/ryoppippi) - Powers the Claude Code integration with excellent token usage analysis
- **Claude Code Team** - For providing the extensible status line API
- **Open Source Community** - For inspiration and feedback

## 🔗 Links

- **npm Package**: [`claude-code-statusline`](https://www.npmjs.com/package/claude-code-statusline)
- **GitHub**: [xpzouying/claude-code-statusline](https://github.com/xpzouying/claude-code-statusline)
- **Issues**: [Report bugs or request features](https://github.com/xpzouying/claude-code-statusline/issues)

---

Made with ❤️ for developers who love both productivity and cute pets!