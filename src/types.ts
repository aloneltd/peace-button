export type AppView = 'home' | 'somatic' | 'calm' | 'intake' | 'plan' | 'insights' | 'settings';
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
}

export interface UserPrefs {
  privacyEnabled: boolean;
  passcode: string | null;
  safetyAcknowledged: boolean;
  attachmentStyle?: 'anxious' | 'avoidant' | 'secure' | null;
}
