import { Problem } from '../mockData';

export interface ProblemState {
  currentProblem: Problem | null;
  userAnswer: string | number | string[] | null;
  hintsRevealed: string[];
  showSolution: boolean;
  attempts: number;
  startTime: number;
  isCorrect: boolean | null;
}

export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  partialCredit?: number;
}