export type AppView = 'home' | 'somatic' | 'calm' | 'intake' | 'plan' | 'insights' | 'settings' | 'safety';
export type WOTState = 'too-fast' | 'too-slow' | 'balanced'; // window of tolerance

export interface TriggerEntry {
  id: string;
  timestamp: number;
  intensity: number;
  intensityAfterCalm?: number;
  wot?: WOTState; // hyperarousal vs hypoarousal
  description?: string;
}

export interface PeacePlan {
  openWith: string;       // amber card — the opening line
  nameYourNeed: string;   // teal card — naming the need
  offerAStep: string;     // sage card — one concrete action
  bridgeNow: string;      // the co-regulation sentence to say RIGHT NOW
  patternNote?: string;   // if AI detected a pattern from history
  /** true when the model could not be reached and these are the built-in generic words.
      Surfaced in the UI — a silent fallback that looks personal is worse than an honest one. */
  isFallback?: boolean;
}

export interface UserPrefs {
  privacyEnabled: boolean;
  passcode: string | null;
  safetyAcknowledged: boolean;
  attachmentStyle?: 'anxious' | 'avoidant' | 'secure' | null;
}
