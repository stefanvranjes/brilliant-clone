import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  category: string;
  hints: string[];
  options?: string[];
  solution?: any;
  xpReward: number;
}

export const useProblem = (problemId?: string) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblem = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProblem(id);
      setProblem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) {
      fetchProblem(problemId);
    }
  }, [problemId]);

  return { problem, loading, error, refresh: () => problemId && fetchProblem(problemId) };
};

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    apiService.getAllProblems().then(setProblems).finally(() => setLoading(false));
  }, []);

  return { problems, loading };
};
