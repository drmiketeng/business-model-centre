export type AppStep =
  | 'disclaimer'
  | 'landing'
  | 'statement'
  | 'generating_questions'
  | 'toolkit_intro'
  | 'questionnaire'
  | 'generating_report'
  | 'report'
  | 'feedback'
  | 'training_scenarios';

export interface StatementData {
  customer: string;
  problem: string;
  solution: string;
  benefit: string;
  revenueModel: string;
  challenge: string;
  industry: string;
  country: string;
}

export interface Question {
  text: string;
  options: string[];
  answer?: string;
}

export interface Toolkit {
    name: string;
    description: string;
    source: string;
    measures: string;
}

export interface PrayerData {
  script: string;
  audio: string; // base64 encoded audio
}

export interface ScenarioOption {
  text: string;
  analysis: string;
}

export interface InteractiveScenario {
  scenario: string;
  options: ScenarioOption[];
}