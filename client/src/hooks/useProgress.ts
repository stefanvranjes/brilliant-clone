import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

// Sync this interface with the one in mockData/apiService to avoid confusion
interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  problemsSolved: number;
  timeSpent: number;
  lastActiveDate: string;
  dailyChallengeCompleted: boolean;
  unlockedAchievementIds: string[];
}

export const useProgress = (userId: string = 'user-123') => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getUserProgress(userId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProgress();
  }, [userId, fetchProgress]);

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!progress) return;

    try {
      const updatedData = await apiService.updateProgress(userId, updates);
      setProgress(updatedData);
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  return { progress, loading, error, updateProgress };
};
