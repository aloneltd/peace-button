
export type AppView = 'home' | 'intake' | 'calm' | 'output' | 'log' | 'dotmap' | 'settings' | 'safety';

export type TopicCategory = 'money' | 'chores' | 'intimacy' | 'family' | 'jealousy' | 'time' | 'respect' | 'other';

export type UserNeed = 'be heard' | 'reassurance' | 'solution' | 'space' | 'apology' | 'clarity' | 'fairness' | 'transparency' | 'support' | 'connection' | 'safety';

export type RiskFactor = 'regret' | 'spiraling' | 'blamed' | 'shutting down';

export type TriggerTiming = 'before' | 'already';

export interface TriggerEntry {
  id: string;
  timestamp: number;
  intensity: number;
  category: TopicCategory;
  need: UserNeed;
  riskFactors: RiskFactor[];
  description: string;
  isText: boolean;
  isInPerson: boolean;
  timing: TriggerTiming;
  intensityAfterCalm?: number;
}

export interface PeacePlan {
  textMessage: {
    soft: string;
    direct: string;
  };
  spokenScript: string;
  connectionQuestion: string;
  boundaryOption: string;
  repairLater: {
    prompts: string[];
    plan: string;
  };
}

export interface UserPrefs {
  privacyEnabled: boolean;
  passcode: string | null;
  age: number | null;
  relationshipStart: string | null;
  name?: string;
  safetyAcknowledged?: boolean;
}
