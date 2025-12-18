// Shared types across the application
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple-choice' | 'numerical' | 'code' | 'interactive';
  category: string;
  tags: string[];
  hints: Hint[];
  solution: Solution;
  xpReward: number;
  estimatedTime: number; // in minutes
}

export interface Hint {
  id: string;
  content: string;
  order: number;
  xpCost: number;
}

export interface Solution {
  answer: string | number | string[];
  explanation: string;
  visualizations?: Visualization[];
}

export interface Visualization {
  type: 'graph' | 'animation' | '3d' | 'chart';
  data: any;
  config?: any;
}

export interface Progress {
  userId: string;
  problemId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  attempts: number;
  hintsUsed: number;
  completedAt?: Date;
  timeSpent: number; // in seconds
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chapters: Chapter[];
  estimatedHours: number;
  enrollmentCount: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  problems: string[]; // Problem IDs
  isLocked: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpRequired?: number;
  problemsRequired?: number;
  streakRequired?: number;
  unlockedAt?: Date;
}

export interface UserStats {
  userId: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  problemsSolved: number;
  timeSpent: number;
  achievements: Achievement[];
  level: number;
}