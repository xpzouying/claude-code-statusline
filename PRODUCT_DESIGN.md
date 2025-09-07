# 🐾 Claude Code Status Line - Product Design Document

## 1. Product Overview

### 1.1 Product Positioning
Claude Code Status Line is a monorepo containing pet-themed status line plugins for various tools and environments. The flagship `claude-code-statusline` plugin transforms boring status bars into delightful displays featuring adorable emoji pets that react to your usage patterns.

### 1.2 Core Value
- **Intuitive Visualization**: Transform abstract token consumption into vivid pet states
- **Real-time Monitoring**: Live tracking of 5-hour billing window usage
- **Cost Control**: Help users manage API usage costs effectively
- **Fun Interaction**: Add joy to development through pet companions
- **Multi-platform Support**: Extensible architecture for various tools (Claude Code, tmux, etc.)

## 2. Technical Architecture

### 2.1 Tech Stack
- **Runtime**: Node.js 18+
- **Package Manager**: npm workspaces (monorepo)
- **Core Dependencies**: ccusage (token analysis engine)
- **Output Format**: ANSI color codes
- **Data Sources**: ccusage direct imports + Claude Code JSON API
- **Architecture**: Modular monorepo with shared core library

### 2.2 Monorepo Structure
```
claude-code-status-line/              # Monorepo root
├── packages/
│   ├── core/                         # @claude-status-line/core
│   │   ├── pet-states.js            # Pet behavior definitions
│   │   ├── animations.js            # State management logic
│   │   └── utils.js                 # Shared utilities
│   ├── claude-code/                  # claude-code-statusline (npm)
│   │   ├── index.js                 # Main plugin entry
│   │   ├── package.json             # Published package
│   │   └── test.js                  # Integration tests
│   └── tmux/                         # Future: tmux-pet-statusline
├── docs/                             # Documentation
├── package.json                      # Workspace configuration
└── README.md                         # Monorepo overview
```

### 2.3 System Architecture
```
┌─────────────────┐
│  Claude Code    │
│    Status API   │
└────────┬────────┘
         │ JSON (stdin)
         ▼
┌─────────────────┐
│ claude-code-    │
│ statusline      │
│  (packages/     │
│   claude-code)  │
└────────┬────────┘
         │ import
         ▼
┌─────────────────┐
│ @claude-status- │
│ line/core       │
│ (packages/core) │
└────────┬────────┘
         │
         ├──────────────┐
         ▼              ▼
┌─────────────────┐  ┌──────────────┐
│     ccusage     │  │ Claude Code  │
│  (direct import)│  │  Cost Data   │
└─────────────────┘  └──────────────┘
         │              │
         └──────┬───────┘
                ▼
        ┌───────────────┐
        │ Status Line   │
        │  (stdout)     │
        └───────────────┘
```

### 2.4 Data Flow
1. Claude Code passes session JSON data via stdin
2. Plugin calls ccusage direct imports for 5h window statistics
3. Core library calculates pet state based on token consumption rate
4. Formatted status line output to stdout

## 3. Feature Design

### 3.1 Dynamic Pet State System

#### Core States (Animation Cycles)
| Usage Range | Pet States | Description | Behavior |
|-------------|------------|-------------|----------|
| 0-10% | 😸😌🐱 **Just Started** | Taking it easy, warming up | Relaxed animation |
| 10-30% | 🐱😽😻 **Light Work** | Working casually, nice and steady | Gentle movement |
| 30-60% | 🙀😺😻 **Getting Busy** | Picking up steam, pace quickening | Active behavior |
| 60-80% | 😺😼😻 **Very Active** | Deeply focused, full of energy | High activity |
| 80-95% | 🤪😼😾 **Intense Mode** | High intensity, going full throttle | Intense states |
| 95-100% | 😵😿😰 **Nearly Exhausted** | Pushing limits, hang in there! | Fatigue indicators |

#### Special Behaviors (Random, 5% probability)
- 😽 Stretching
- 😻 Grooming
- 🥱 Yawning
- 😌 Content
- 🙀 Alert

### 3.2 Information Display
- **Pet Status**: Dynamic emoji + status text
- **Usage Percentage**: 5h window usage progress
- **Progress Bar**: Color-coded visualization (green → yellow → red)
- **Remaining Time**: Window remaining available time
- **Cost Amount**: Current session accumulated cost
- **Account Type**: Pro subscription or API

### 3.3 Dual Data Source Strategy
1. **Primary Source**: ccusage direct imports (precise)
2. **Fallback Source**: Claude Code cost field (estimated)
3. **Graceful Degradation**: Auto-switch to fallback when ccusage fails

## 4. Implementation Details

### 4.1 Core Algorithms

#### Usage Percentage Calculation
```javascript
// Based on token usage vs historical maximum
const maxTokensReference = Math.max(...historicalTokens);
const usagePercent = Math.min(100, Math.round((currentTokens / maxTokensReference) * 100));
```

#### Pet State Logic
```javascript
// Located in @claude-status-line/core
export function getPetState(usagePercent) {
  const stateCategory = PET_STATES.find(state => 
    usagePercent >= state.minUsage && usagePercent <= state.maxUsage
  );
  
  return stateManager.getRandomState(stateCategory);
}
```

### 4.2 Performance Optimizations
- Direct ccusage module imports (no subprocess overhead)
- Graceful error handling with fallbacks
- Modular architecture for code sharing
- Lightweight dependencies

## 5. Product Roadmap

### 5.1 V1.1 - Monorepo Architecture ✅ (Current)
- [x] Monorepo structure with npm workspaces
- [x] Shared core library (@claude-status-line/core)
- [x] Professional npm package (claude-code-statusline)
- [x] English internationalization
- [x] Direct ccusage imports for performance
- [x] Comprehensive test suite
- [x] Global CLI installation
- [x] Enhanced documentation

### 5.2 V1.2 - Enhanced Features
- [ ] Additional pet types (dogs, rabbits, etc.)
- [ ] Custom threshold configuration
- [ ] Historical usage statistics
- [ ] Performance monitoring dashboard
- [ ] Plugin configuration system

### 5.3 V2.0 - Multi-Platform Expansion
- [ ] tmux plugin (tmux-pet-statusline)
- [ ] Zsh prompt theme
- [ ] Vim/Neovim statusline
- [ ] Terminal title updates
- [ ] Unified configuration system

### 5.4 V3.0 - Advanced Features
- [ ] Pixel art animations
- [ ] Sound notifications
- [ ] Web dashboard
- [ ] Community pet gallery
- [ ] Plugin marketplace

## 6. Installation & Configuration

### 6.1 Quick Installation (Recommended)
```bash
# Install globally via npm
npm install -g claude-code-statusline

# Configure Claude Code
# Add to .claude/settings.json:
{
  "statusLine": {
    "type": "command",
    "command": "claude-code-statusline",
    "padding": 0
  }
}
```

### 6.2 Development Installation
```bash
# Clone monorepo
git clone https://github.com/xpzouying/claude-code-statusline.git
cd claude-code-status-line

# Install dependencies
npm install

# Test functionality
npm run test

# Install locally for testing
npm install -g ./packages/claude-code
```

## 7. Testing Strategy

### 7.1 Test Architecture
- **Integration Tests**: `packages/claude-code/test.js` - Simulates various usage scenarios
- **Monorepo Tests**: `npm run test` - Runs tests across all workspaces
- **Package Tests**: Individual package testing capabilities

### 7.2 Test Scenarios
1. **Low Usage** (0-10%): Resting states
2. **Medium Usage** (20-70%): Active states  
3. **High Usage** (70-95%): Intense states
4. **Near Limit** (>95%): Exhausted states
5. **Fallback Mode**: ccusage unavailable scenarios

### 7.3 Test Coverage
```bash
🧪 CC Pet Statusline Test Suite
==================================================
✓ Low usage (resting) - 😌 Warming up...
✓ Medium usage (active) - 😻 Pace is quickening  
✓ High usage (intense) - 😾 Super focused!
✓ Near limit (exhausted) - 😰 Hang in there!
==================================================
All tests passed!
```

## 8. Success Metrics

### 8.1 Functional Metrics
- ✅ Accurately displays 5h window usage status
- ✅ Pet states reflect real-time consumption rates
- ✅ Users can intuitively understand remaining usage
- ✅ Installation completed within 2 minutes
- ✅ Professional npm package distribution

### 8.2 Performance Metrics
- Update latency < 100ms
- CPU usage < 1%
- Memory usage < 50MB
- Package size < 15KB

### 8.3 Adoption Metrics
- npm package downloads
- GitHub stars and forks
- Community contributions
- User retention rate

## 9. User Feedback Collection

### 9.1 Feedback Channels
- GitHub Issues and Discussions
- npm package reviews
- Community forums
- Direct user reports

### 9.2 Focus Areas
- Pet behavior preferences
- Information display priorities
- Performance impact assessment
- Feature requests and suggestions
- Multi-platform expansion needs

## 10. Project Summary

Claude Code Status Line has successfully evolved from a single-purpose plugin to a professional monorepo architecture supporting multiple platforms. Through creative pet-themed visualization, it transforms boring data monitoring into an engaging and delightful experience.

### Technical Highlights
- **Professional npm Distribution**: Global installation via `npm install -g claude-code-statusline`
- **Monorepo Architecture**: Scalable structure supporting multiple platforms
- **Modular Design**: Shared core library for code reusability
- **Direct Integration**: ccusage module imports for optimal performance
- **Graceful Degradation**: Robust fallback mechanisms
- **International Support**: English interface for global accessibility
- **Comprehensive Testing**: Automated test suite ensuring reliability

### Product Innovation
- **First Dynamic Pet-Themed Claude Code Status Bar**: Pioneering the use of animated emoji pets
- **Living Digital Pet Experience**: Truly reactive pet companions that respond to usage patterns
- **Emotional Token Visualization**: Innovative approach to making abstract data tangible
- **Multi-Platform Vision**: Extensible architecture for tmux, zsh, vim, and more
- **Community-Driven Development**: Open source approach encouraging contributions

### Architecture Evolution
- **V1.0**: Single file implementation with Chinese interface
- **V1.1**: Monorepo structure with international English support ✅ (Current)
- **V2.0**: Multi-platform expansion (tmux, zsh, vim)
- **V3.0**: Advanced features (web dashboard, community gallery)

---

*Document Version: 2.0.0*  
*Last Updated: 2025-09-07*  
*Architecture: Monorepo with npm workspaces*  
*Status: Production Ready*