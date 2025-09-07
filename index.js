#!/usr/bin/env node

import { statSync } from 'fs';
import { getPetState } from './animations.js';
import { formatAccountType, createStatusLine } from './utils.js';

// Import ccusage modules directly
let loadSessionBlockData, getTotalTokens;
try {
  const dataLoaderModule = await import('ccusage/data-loader');
  const calculateCostModule = await import('ccusage/calculate-cost');
  loadSessionBlockData = dataLoaderModule.loadSessionBlockData;
  getTotalTokens = calculateCostModule.getTotalTokens;
} catch (error) {
  // Fallback if ccusage modules are not available
  console.error('Warning: ccusage modules not available, falling back to command line');
}

// Handle command line arguments
function handleCliArgs() {
  const args = process.argv.slice(2);
  
  if (args.includes('--version') || args.includes('-v')) {
    console.log('1.1.3');
    process.exit(0);
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🐾 Claude Code Statusline v1.1.3

A cute pet-themed status line plugin for Claude Code that displays 
your token usage through adorable emoji pets! Now with international support.

Usage:
  claude-code-statusline                Display status line
  claude-code-statusline --version      Show version
  claude-code-statusline --help         Show this help

Configuration:
Add this to your .claude/settings.json:
{
  "statusLine": {
    "type": "command",
    "command": "claude-code-statusline",
    "padding": 0
  }
}

For more information, visit:
https://github.com/xpzouying/claude-code-statusline
    `);
    process.exit(0);
  }
}

// Parse ccusage data using direct import
async function getCCUsageData(sessionId) {
  try {
    // Use direct ccusage import if available
    if (loadSessionBlockData && getTotalTokens) {
      const blocks = await loadSessionBlockData({ offline: true });
      
      // Find the active block
      const activeBlock = blocks.find(b => b.isActive);
      if (!activeBlock) {
        return null;
      }
      
      // Calculate current tokens using getTotalTokens
      const currentTokens = getTotalTokens(activeBlock.tokenCounts);
      
      // Calculate remaining minutes from time data
      const now = new Date();
      const remainingMinutes = Math.round((new Date(activeBlock.endTime).getTime() - now.getTime()) / (1000 * 60));
      
      // Calculate tokens per minute for burn rate indicator
      const elapsedMinutes = Math.round((now.getTime() - new Date(activeBlock.startTime).getTime()) / (1000 * 60));
      const tokensPerMinute = elapsedMinutes > 0 ? Math.round(currentTokens / elapsedMinutes) : 0;
      
      // Find the maximum token count from all non-gap blocks to use as reference
      let maxTokensReference = 28795328; // fallback from historical data
      const historicalTokens = blocks
        .filter(b => !b.isGap && b.tokenCounts)
        .map(b => getTotalTokens(b.tokenCounts))
        .filter(tokens => tokens > 0);
      
      if (historicalTokens.length > 0) {
        maxTokensReference = Math.max(...historicalTokens);
      }
      
      // Calculate usage percentage based on token usage vs historical maximum
      const usagePercent = Math.min(100, Math.round((currentTokens / maxTokensReference) * 100));
      
      return {
        usagePercent,
        remainingMinutes: Math.max(0, remainingMinutes),
        tokensPerMinute,
        totalCost: activeBlock.costUSD || 0,
        blockStartTime: activeBlock.startTime
      };
    }
    
    // Fallback to command line method if direct import failed
    return await getCCUsageDataFallback(sessionId);
  } catch (error) {
    // Fallback if direct import fails - return null to use Claude Code data
    console.error('ccusage direct import failed:', error.message);
    return null;
  }
}

// Fallback command line method (keeping original implementation)
async function getCCUsageDataFallback(sessionId) {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    const { stdout } = await execAsync(`bunx ccusage blocks --json 2>/dev/null`);
    const data = JSON.parse(stdout);
    
    const activeBlock = data.blocks?.find(b => b.isActive);
    if (!activeBlock) {
      return null;
    }
    
    const remainingMinutes = activeBlock.projection?.remainingMinutes || 300;
    const currentTokens = activeBlock.totalTokens || 0;
    const tokensPerMinute = activeBlock.burnRate?.tokensPerMinuteForIndicator || 0;
    
    let maxTokensReference = 28795328;
    if (data.blocks) {
      const maxFromHistory = Math.max(
        ...data.blocks.filter(b => !b.isGap && b.totalTokens).map(b => b.totalTokens)
      );
      if (maxFromHistory > 0) {
        maxTokensReference = maxFromHistory;
      }
    }
    
    const usagePercent = Math.min(100, Math.round((currentTokens / maxTokensReference) * 100));
    
    return {
      usagePercent,
      remainingMinutes,
      tokensPerMinute,
      totalCost: activeBlock.costUSD || 0,
      blockStartTime: activeBlock.startTime
    };
  } catch (error) {
    return null;
  }
}

// Main function
async function main() {
  // Handle CLI arguments first
  handleCliArgs();
  
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
  
  // Get session ID
  const sessionId = claudeData.session_id || 'unknown';
  const modelName = claudeData.model?.display_name || 'Claude';
  
  // Check for test mode (skip ccusage if session_id starts with 'test-')
  const isTestMode = sessionId.startsWith('test-');
  
  // Get ccusage data (skip in test mode)
  const usageData = isTestMode ? null : await getCCUsageData(sessionId);
  
  // Default values if ccusage fails
  let usagePercent = 0;
  let remainingMinutes = 300;
  let totalCost = 0;
  
  if (usageData) {
    usagePercent = usageData.usagePercent;
    remainingMinutes = usageData.remainingMinutes;
    totalCost = usageData.totalCost;
  } else if (claudeData.cost) {
    // Fallback to Claude Code provided cost data
    totalCost = claudeData.cost.total_cost_usd || 0;
    // Rough estimate of usage percentage based on cost
    // Assuming average $2 per 5h block
    usagePercent = Math.min(100, Math.round((totalCost / 2) * 100));
    remainingMinutes = Math.round(300 * (1 - usagePercent / 100));
  }
  
  // Get dynamic pet state based purely on usage percentage
  const petState = getPetState(usagePercent);
  
  // Format account type
  const accountType = formatAccountType(claudeData.version);
  
  // Create and output the status line using core utilities
  const statusLine = createStatusLine(petState, usagePercent, remainingMinutes, totalCost, accountType);
  console.log(statusLine);
}

// Run the script
main().catch(error => {
  // On error, output a simple fallback status
  console.log('🐱 Claude Code Pet Status | Initializing...');
});