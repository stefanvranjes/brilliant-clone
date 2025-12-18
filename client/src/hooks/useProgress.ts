import { useState, useEffect } from 'react';

interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  problemsSolved: number;
  timeSpent: number;
}

export const useProgress = (userId: string) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(\`/api/progress/\${userId}\`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!progress) return;
    
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    
    try {
      await fetch(\`/api/progress/\${userId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
      setProgress(progress); // Revert on error
    }
  };

  const addXP = (xp: number) => {
    if (!progress) return;
    const newTotalXP = progress.totalXP + xp;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    updateProgress({ totalXP: newTotalXP, level: newLevel });
  };

  const incrementProblemsSolved = () => {
    if (!progress) return;
    updateProgress({ problemsSolved: progress.problemsSolved + 1 });
  };

  return {
    progress,
    loading,
    error,
    addXP,
    incrementProblemsSolved,
    updateProgress,
    refresh: fetchProgress
  };
};