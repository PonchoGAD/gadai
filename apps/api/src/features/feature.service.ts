const FEATURES = {
  free: {
    deepAnalysis: false,
    aiDialog: false
  },
  pro: {
    deepAnalysis: true,
    aiDialog: true
  }
} as const;

export function getFeatures(plan: string) {
  return FEATURES[plan as keyof typeof FEATURES] || FEATURES.free;
}
