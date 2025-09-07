// ANSI color codes for terminal output
export const colors = {
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

// Create progress bar visualization
export function createProgressBar(percent, width = 10) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  
  // Color based on usage level
  let color = colors.green;
  if (percent >= 80) color = colors.red;
  else if (percent >= 60) color = colors.yellow;
  
  return color + '▓'.repeat(filled) + colors.dim + '░'.repeat(empty) + colors.reset;
}

// Format time remaining in a human-readable way
export function formatTimeRemaining(minutes) {
  if (minutes <= 0) return "Time's up!";
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m left`;
  }
  return `${mins}m left`;
}

// Format account type display
export function formatAccountType(version) {
  return version?.includes('api') ? 'API' : 'Pro Plan';
}

// Format currency display
export function formatCurrency(amount) {
  return `💰 $${amount.toFixed(2)}`;
}

// Create the complete status line
export function createStatusLine(petState, usagePercent, timeRemaining, cost, accountType) {
  const parts = [
    `${petState.emoji} ${petState.text}`,
    `5h: ${usagePercent}% ${createProgressBar(usagePercent)}`,
    formatTimeRemaining(timeRemaining),
    formatCurrency(cost),
    accountType
  ];
  
  return parts.join(' | ');
}