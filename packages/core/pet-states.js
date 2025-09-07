// Pet states based on 5h usage percentage (internationalized)
export const CAT_STATES = {
  JUST_STARTED: {
    emojis: ['😸', '😌', '🐱'],
    texts: ['Just getting started', 'Warming up...', 'Taking it easy'],
    animationSpeed: 8000, // 8 seconds per frame  
    usageRange: [0, 10] // 0-10% usage
  },
  LIGHT_WORK: {
    emojis: ['🐱', '😽', '😻'],
    texts: ['Working casually', 'Staying relaxed', 'Nice and steady'],
    animationSpeed: 6000, // 6 seconds per frame
    usageRange: [10, 30] // 10-30% usage
  },
  GETTING_BUSY: {
    emojis: ['🙀', '😺', '😻'],
    texts: ['Getting busy now', 'Picking up steam', 'Pace is quickening'],
    animationSpeed: 5000, // 5 seconds per frame
    usageRange: [30, 60] // 30-60% usage
  },
  VERY_ACTIVE: {
    emojis: ['😺', '😼', '😻'],
    texts: ['Very active!', 'Deeply focused', 'Full of energy!'],
    animationSpeed: 4000, // 4 seconds per frame
    usageRange: [60, 80] // 60-80% usage
  },
  INTENSE_MODE: {
    emojis: ['🤪', '😼', '😾'],
    texts: ['High intensity!', 'Going full throttle!', 'Super focused!'],
    animationSpeed: 3000, // 3 seconds per frame
    usageRange: [80, 95] // 80-95% usage
  },
  NEARLY_EXHAUSTED: {
    emojis: ['😵', '😿', '😰'],
    texts: ['Nearly exhausted...', 'Pushing the limits', 'Hang in there!'],
    animationSpeed: 5000, // 5 seconds per frame  
    usageRange: [95, 100] // 95-100% usage
  }
};

// Special states that appear randomly
export const SPECIAL_STATES = {
  STRETCHING: { emoji: '😽', text: 'Stretching~' },
  GROOMING: { emoji: '😻', text: 'Grooming' },
  YAWNING: { emoji: '🥱', text: 'Yawning~' },
  CONTENT: { emoji: '😌', text: 'Content purring' },
  ALERT: { emoji: '🙀', text: 'Alert!' }
};