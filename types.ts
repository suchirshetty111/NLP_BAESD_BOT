
export enum EmotionType {
  CONFIDENT = 'Confident',
  NEUTRAL = 'Neutral',
  NERVOUS = 'Nervous',
  HESITANT = 'Hesitant',
  ENTHUSIASTIC = 'Enthusiastic'
}

export interface Question {
  id: string;
  text: string;
}

export type QuestionSet = Question[];

export interface UserAnswer {
  questionId: string;
  questionText: string;
  answerText: string;
}

export interface EvaluationItem {
  questionId: string;
  questionText: string;
  answerText: string;
  score: number;
  feedback: string;
  suggestions: string;
  emotion: EmotionType;
}

export interface InterviewResult {
  overallScore: number;
  items: EvaluationItem[];
  timestamp: string;
}
