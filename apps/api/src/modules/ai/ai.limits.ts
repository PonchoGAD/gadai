export const AI_LIMITS = {
  free: {
    messagesPerDay: 10,
    messagesPerMonth: 100,
    memoryDepth: 3
  },
  pro: {
    messagesPerDay: 100,
    messagesPerMonth: 10000,
    memoryDepth: 20
  },
  premium: {
    messagesPerDay: 1000,
    messagesPerMonth: 100000,
    memoryDepth: 100
  }
};

export function getAiLimits(plan: string) {
  return AI_LIMITS[plan as keyof typeof AI_LIMITS] || AI_LIMITS.free;
}
