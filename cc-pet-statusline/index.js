#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import { statSync } from 'fs';

const execAsync = promisify(exec);

// Cat states with dynamic emojis and texts
const CAT_STATES = {
  DEEP_SLEEP: {
    emojis: ['😴'],
    texts: ['呼呼大睡中...'],
    animationSpeed: 12000, // 12 seconds per frame
    burnRateRange: [0, 0]
  },
  DOZING: {
    emojis: ['😸', '😌', '🥱'],
    texts: ['迷糊中...', '昏昏欲睡~', '哈~欠~'],
    animationSpeed: 8000, // 8 seconds per frame
    burnRateRange: [0, 5]
  },
  LAZY_WATCHING: {
    emojis: ['🐱', '😽', '😻'],
    texts: ['懒洋洋地看着', '伸个懒腰~', '整理毛发中'],
    animationSpeed: 6000, // 6 seconds per frame
    burnRateRange: [5, 15]
  },
  CURIOUS: {
    emojis: ['🙀', '😺', '😻'],
    texts: ['发现了什么？', '有点兴致~', '好奇ing...'],
    animationSpeed: 5000, // 5 seconds per frame
    burnRateRange: [15, 50]
  },
  EXCITED: {
    emojis: ['😺', '😼', '😻'],
    texts: ['兴致勃勃！', '专注ing...', '干劲满满！'],
    animationSpeed: 4000, // 4 seconds per frame
    burnRateRange: [50, 150]
  },
  CRAZY_MODE: {
    emojis: ['🤪', '😼', '😾'],
    texts: ['猫咪炸毛了！', '全力冲刺！', '疯狂模式ON！'],
    animationSpeed: 3000, // 3 seconds per frame
    burnRateRange: [150, Infinity]
  },
  EXHAUSTED: {
    emojis: ['😵', '😿', '🙀'],
    texts: ['累坏了...', '需要休息', '快到极限了...'],
    animationSpeed: 10000, // 10 seconds per frame
    burnRateRange: [0, Infinity] // Special condition: high usage percent
  }
};

// Special states that appear randomly
const SPECIAL_STATES = {
  STRETCHING: { emoji: '😽', text: '伸个懒腰~' },
  GROOMING: { emoji: '😻', text: '整理毛发中' },
  YAWNING: { emoji: '🥱', text: '哈~欠~' },
  CONTENT: { emoji: '😌', text: '满足地眯着眼' },
  ALERT: { emoji: '🙀', text: '警觉！' }
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Animation and state management
class CatStateManager {
  constructor() {
    this.startTime = Date.now();
    this.lastStateChange = Date.now();
    this.currentState = null;
    this.stateHistory = [];
  }

  // Get current animation frame for a state
  getAnimationFrame(state, timestamp = Date.now()) {
    const frameIndex = Math.floor((timestamp / state.animationSpeed)) % state.emojis.length;
    return {
      emoji: state.emojis[frameIndex],
      text: state.texts[frameIndex]
    };
  }

  // Check if should show special state (random chance)
  getSpecialState(timestamp = Date.now()) {
    // 5% chance every 10 seconds
    const specialChance = Math.floor(timestamp / 10000) % 20 === 0;
    if (specialChance && Math.random() < 0.05) {
      const specialKeys = Object.keys(SPECIAL_STATES);
      const randomSpecial = specialKeys[Math.floor(Math.random() * specialKeys.length)];
      return SPECIAL_STATES[randomSpecial];
    }
    return null;
  }

  // Get fatigue factor based on usage history (0-1, where 1 = fully energetic)
  getFatigueFactor(elapsedMinutes, usagePercent) {
    // Cats get tired after continuous high activity
    if (elapsedMinutes > 120 && usagePercent > 60) {
      return Math.max(0.3, 1 - (elapsedMinutes - 120) / 180);
    }
    if (elapsedMinutes > 180) {
      return Math.max(0.5, 1 - (elapsedMinutes - 180) / 120);
    }
    return 1.0;
  }

  // Check if there's been recent activity by analyzing transcript modification time
  isRecentlyActive(transcriptPath, threshold = 5) {
    try {
      if (!transcriptPath) return false;
      
      const stats = statSync(transcriptPath);
      const lastModified = stats.mtime.getTime();
      const now = Date.now();
      const minutesSinceLastActivity = (now - lastModified) / (1000 * 60);
      
      return minutesSinceLastActivity < threshold;
    } catch (error) {
      // If we can't check the file, assume no recent activity (safer default)
      return false;
    }
  }

  // Get appropriate cat state based on burn rate and other factors
  getCatState(burnRate, usagePercent, elapsedMinutes = 0, timestamp = Date.now(), transcriptPath = null) {
    // Check for special states first
    const specialState = this.getSpecialState(timestamp);
    if (specialState) {
      return specialState;
    }

    // Exhausted state for high usage
    if (usagePercent >= 95) {
      return this.getAnimationFrame(CAT_STATES.EXHAUSTED, timestamp);
    }

    // Check for recent activity - if no activity in last 5 minutes, cat should be sleepy
    const recentlyActive = this.isRecentlyActive(transcriptPath, 5);
    
    // Apply fatigue factor
    const fatigue = this.getFatigueFactor(elapsedMinutes, usagePercent);
    let adjustedBurnRate = burnRate * fatigue;
    
    // If no recent activity, force into sleepy states regardless of historical burn rate
    if (!recentlyActive && burnRate < 200) {
      // Gradual transition to sleep based on inactivity duration
      const inactivityFactor = Math.min(1, elapsedMinutes / 60); // 0 to 1 over 1 hour
      
      let selectedState;
      if (inactivityFactor > 0.8) {
        selectedState = CAT_STATES.DEEP_SLEEP;
      } else if (inactivityFactor > 0.5) {
        selectedState = CAT_STATES.DOZING;
      } else {
        selectedState = CAT_STATES.LAZY_WATCHING;
      }
      
      return this.getAnimationFrame(selectedState, timestamp);
    }

    // Determine base state from burn rate (for active periods)
    let selectedState;
    
    if (burnRate === 0 || adjustedBurnRate < 1) {
      selectedState = CAT_STATES.DEEP_SLEEP;
    } else if (adjustedBurnRate < 5) {
      selectedState = CAT_STATES.DOZING;
    } else if (adjustedBurnRate < 15) {
      selectedState = CAT_STATES.LAZY_WATCHING;
    } else if (adjustedBurnRate < 50) {
      selectedState = CAT_STATES.CURIOUS;
    } else if (adjustedBurnRate < 150) {
      selectedState = CAT_STATES.EXCITED;
    } else {
      selectedState = CAT_STATES.CRAZY_MODE;
    }

    return this.getAnimationFrame(selectedState, timestamp);
  }
}

// Global state manager instance
const catManager = new CatStateManager();

// Get cat state using the new dynamic system
function getCatState(burnRate, usagePercent, elapsedMinutes = 0, transcriptPath = null) {
  // Use burn rate if available, otherwise estimate from usage percent
  let effectiveBurnRate = burnRate;
  
  if (burnRate === undefined || burnRate === null) {
    // Estimate burn rate from usage percentage and time
    if (usagePercent < 5) effectiveBurnRate = 0;
    else if (usagePercent < 20) effectiveBurnRate = 3;
    else if (usagePercent < 40) effectiveBurnRate = 25;
    else if (usagePercent < 70) effectiveBurnRate = 75;
    else if (usagePercent < 95) effectiveBurnRate = 120;
    else effectiveBurnRate = 200;
  }
  
  return catManager.getCatState(effectiveBurnRate, usagePercent, elapsedMinutes, Date.now(), transcriptPath);
}

// Create progress bar
function createProgressBar(percent, width = 10) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  
  // Color based on usage level
  let color = colors.green;
  if (percent >= 80) color = colors.red;
  else if (percent >= 60) color = colors.yellow;
  
  return color + '▓'.repeat(filled) + colors.dim + '░'.repeat(empty) + colors.reset;
}

// Format time remaining
function formatTimeRemaining(minutes) {
  if (minutes <= 0) return '时间到!';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `剩余 ${hours}h ${mins}m`;
  }
  return `剩余 ${mins}m`;
}

// Parse ccusage output
async function getCCUsageData(sessionId) {
  try {
    // Call ccusage blocks command with JSON output
    const { stdout } = await execAsync(`bunx ccusage blocks --json 2>/dev/null`);
    const data = JSON.parse(stdout);
    
    // Find the active block
    const activeBlock = data.blocks?.find(b => b.isActive);
    if (!activeBlock) {
      return null;
    }
    
    // Get remaining minutes from projection
    const remainingMinutes = activeBlock.projection?.remainingMinutes || 300;
    const totalMinutes = 300;
    const elapsedMinutes = totalMinutes - remainingMinutes;
    
    // Get token usage
    const totalTokens = activeBlock.totalTokens || 0;
    const tokensPerMinute = activeBlock.burnRate?.tokensPerMinuteForIndicator || 0;
    
    // Calculate usage percentage based on time elapsed
    const usagePercent = Math.min(100, Math.round((elapsedMinutes / totalMinutes) * 100));
    
    return {
      usagePercent,
      remainingMinutes,
      tokensPerMinute,
      totalCost: activeBlock.costUSD || 0,
      blockStartTime: activeBlock.startTime
    };
  } catch (error) {
    // Fallback if ccusage fails - return null to use Claude Code data
    return null;
  }
}

// Main function
async function main() {
  let input = '';
  
  // Read stdin
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  
  // Parse Claude Code JSON input
  let claudeData = {};
  try {
    claudeData = JSON.parse(input);
  } catch (e) {
    // If no valid JSON input, use empty object
  }
  
  // Get session ID and transcript path
  const sessionId = claudeData.session_id || 'unknown';
  const transcriptPath = claudeData.transcript_path || null;
  const modelName = claudeData.model?.display_name || 'Claude';
  
  // Determine account type
  const accountType = claudeData.version?.includes('api') ? 'API' : 'Pro订阅';
  
  // Get ccusage data
  const usageData = await getCCUsageData(sessionId);
  
  // Default values if ccusage fails
  let usagePercent = 0;
  let remainingMinutes = 300;
  let tokensPerMinute = undefined;
  let totalCost = 0;
  
  if (usageData) {
    usagePercent = usageData.usagePercent;
    remainingMinutes = usageData.remainingMinutes;
    tokensPerMinute = usageData.tokensPerMinute;
    totalCost = usageData.totalCost;
  } else if (claudeData.cost) {
    // Fallback to Claude Code provided cost data
    totalCost = claudeData.cost.total_cost_usd || 0;
    // Rough estimate of usage percentage based on cost
    // Assuming average $2 per 5h block
    usagePercent = Math.min(100, Math.round((totalCost / 2) * 100));
    remainingMinutes = Math.round(300 * (1 - usagePercent / 100));
    // Don't set tokensPerMinute - let getPetState use percentage-based logic
  }
  
  // Calculate elapsed minutes in the current 5h block
  const totalMinutes = 300;
  const elapsedMinutes = totalMinutes - remainingMinutes;
  
  // Get dynamic cat state
  const catState = getCatState(tokensPerMinute, usagePercent, elapsedMinutes, transcriptPath);
  
  // Build status line
  const parts = [
    `${catState.emoji} ${catState.text}`,
    `5h: ${usagePercent}% ${createProgressBar(usagePercent)}`,
    formatTimeRemaining(remainingMinutes),
    `💰 $${totalCost.toFixed(2)}`,
    accountType
  ];
  
  // Output the status line
  console.log(parts.join(' | '));
}

// Run the script
main().catch(error => {
  // On error, output a simple fallback status
  console.log('🐱 Claude Code Pet Status | 初始化中...');
});