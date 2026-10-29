export type EngineerLevel = 'junior' | 'senior';
export type EngineerRole = 'backend' | 'sre';
export type PrimaryGoal = 'zero_loss' | 'fast_recovery';

export interface EngineerProfile {
  level: EngineerLevel;
  role: EngineerRole;
  goal: PrimaryGoal;
}

export interface MetricState {
  systemHealth: number; // 0 to 100%
  errorRate: number; // e.g., 42.8%
  activeTps: number; // requests per sec
  p99LatencyMs: number; // ms
  dataIntegrity: number; // 0 to 100%
  concurrentPlayers: number; // in millions/thousands
}

export interface DecisionChoice {
  id: 'A' | 'B';
  title: string;
  badge: string;
  summary: string;
  tradeOffs: {
    pros: string[];
    cons: string[];
  };
  technicalDetails: string;
  isRecommendedByBestPractice: boolean;
  metricsImpact: {
    healthDelta: number;
    errorRateDelta: number;
    latencyDelta: number;
    dataIntegrityDelta: number;
  };
  outcome: {
    whatHappened: string;
    whyItHappened: string;
    rootCauseArchitecture: string;
    metricsSummary: string;
  };
}

export interface StageScenario {
  stageNumber: number;
  phaseCode: string;
  title: string;
  subtitle: string;
  loreContext: string;
  technicalBriefing: string;
  affectedComponents: string[];
  suggestedQuestions: string[];
  choices: [DecisionChoice, DecisionChoice];
  defaultChoiceId: 'A' | 'B'; // triggered if Senior timer hits 0
}

export interface DecisionRecord {
  stageNumber: number;
  chosenId: 'A' | 'B';
  choice: DecisionChoice;
  timeSpentSeconds: number;
  wasAutoTriggered: boolean;
}

export type SimulationEndState = 'STABILIZED' | 'COLLAPSE';

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  source?: 'gemini-3.8-flash' | 'local_deterministic';
}
