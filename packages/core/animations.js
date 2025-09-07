import { CAT_STATES, SPECIAL_STATES } from './pet-states.js';

// Pet animation and state management based on usage percentage
export class PetStateManager {
  constructor() {
    this.startTime = Date.now();
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
    // 3% chance every call (reduced from 5% for less frequent special states)
    if (Math.random() < 0.03) {
      const specialKeys = Object.keys(SPECIAL_STATES);
      const randomSpecial = specialKeys[Math.floor(Math.random() * specialKeys.length)];
      return SPECIAL_STATES[randomSpecial];
    }
    return null;
  }

  // Get pet state based purely on usage percentage
  getPetState(usagePercent, timestamp = Date.now()) {
    // Check for special states first (3% chance)
    const specialState = this.getSpecialState(timestamp);
    if (specialState) {
      return specialState;
    }

    // Determine state based on usage percentage
    let selectedState;
    
    for (const [stateName, stateConfig] of Object.entries(CAT_STATES)) {
      const [min, max] = stateConfig.usageRange;
      if (usagePercent >= min && usagePercent < max) {
        selectedState = stateConfig;
        break;
      }
    }
    
    // Fallback to the highest state if usage is 100%+
    if (!selectedState) {
      selectedState = CAT_STATES.NEARLY_EXHAUSTED;
    }

    return this.getAnimationFrame(selectedState, timestamp);
  }
}

// Global state manager instance
export const petStateManager = new PetStateManager();

// Get pet state based purely on usage percentage (simplified)
export function getPetState(usagePercent) {
  // Script being called means the application is active, so pet is always animated
  // State is determined purely by usage percentage
  return petStateManager.getPetState(usagePercent);
}