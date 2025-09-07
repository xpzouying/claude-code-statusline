#!/usr/bin/env node

import { spawn } from 'child_process';

// Test cases with different scenarios
const testCases = [
  {
    name: 'Low usage (resting)',
    data: {
      session_id: 'test-session-1',
      model: { id: 'claude-3-opus', display_name: 'Claude 3 Opus' },
      workspace: { current_dir: '/test', project_dir: '/test' },
      version: 'claude-code-pro',
      cost: {
        total_cost_usd: 0.05,
        total_duration_ms: 10000
      }
    }
  },
  {
    name: 'Medium usage (active)',
    data: {
      session_id: 'test-session-2',
      model: { id: 'claude-3-opus', display_name: 'Claude 3 Opus' },
      workspace: { current_dir: '/test', project_dir: '/test' },
      version: 'claude-code-pro',
      cost: {
        total_cost_usd: 0.80,
        total_duration_ms: 60000
      }
    }
  },
  {
    name: 'High usage (intense)',
    data: {
      session_id: 'test-session-3',
      model: { id: 'claude-3-opus', display_name: 'Claude 3 Opus' },
      workspace: { current_dir: '/test', project_dir: '/test' },
      version: 'claude-code-api',
      cost: {
        total_cost_usd: 1.80,
        total_duration_ms: 120000
      }
    }
  },
  {
    name: 'Near limit (exhausted)',
    data: {
      session_id: 'test-session-4',
      model: { id: 'claude-3-opus', display_name: 'Claude 3 Opus' },
      workspace: { current_dir: '/test', project_dir: '/test' },
      version: 'claude-code-pro',
      cost: {
        total_cost_usd: 1.95,
        total_duration_ms: 280000
      }
    }
  }
];

// Run test
async function runTest(testCase) {
  return new Promise((resolve, reject) => {
    console.log(`\n${colors.bright}Testing: ${testCase.name}${colors.reset}`);
    console.log(`Input: ${JSON.stringify(testCase.data, null, 2)}`);
    
    const child = spawn('node', ['index.js'], {
      cwd: process.cwd()
    });
    
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}`));
      } else {
        console.log(`Output: ${output}`);
        resolve(output);
      }
    });
    
    // Send test data
    child.stdin.write(JSON.stringify(testCase.data));
    child.stdin.end();
  });
}

// ANSI colors for test output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m'
};

// Main test runner
async function main() {
  console.log(`${colors.bright}🧪 CC Pet Statusline Test Suite${colors.reset}`);
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      await runTest(testCase);
      console.log(`${colors.green}✓ Test passed${colors.reset}`);
      passed++;
    } catch (error) {
      console.error(`${colors.red}✗ Test failed: ${error.message}${colors.reset}`);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`${colors.bright}Test Results:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}All tests passed!${colors.reset}`);
  }
}

main().catch(console.error);