import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';

// Sync this interface with the one in mockData/apiService to avoid confusion
interface UserProgress {
  totalXP: number;
  xpBalance: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  problemsSolved: number;
  timeSpent: number;
  lastActiveDate: string;
  dailyChallengeCompleted: boolean;
  unlockedAchievementIds: string[];
  purchasedItemIds: string[];
}

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = React.useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.getUserProgress();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [user, fetchProgress]);

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!progress || !user) return;

    try {
      const updatedData = await apiService.updateProgress(updates);
      setProgress(updatedData);
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  const purchaseItem = async (itemId: string) => {
    if (!progress || !user) return;
    try {
      const updatedData = await apiService.purchaseItem(itemId);
      setProgress(updatedData);
      return updatedData;
    } catch (err) {
      console.error('Purchase failed', err);
      throw err;
    }
  };

  return { progress, loading, error, updateProgress, purchaseItem, fetchProgress };
};
