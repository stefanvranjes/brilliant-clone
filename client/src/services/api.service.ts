import {
  Problem,
  UserProgress,
  Achievement,
  INITIAL_USER_PROGRESS
} from '../mockData';

const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const apiService = {
  getProblem: async (id: string): Promise<Problem> => {
    const response = await fetch(`${API_URL}/problems/${id}`);
    return handleResponse(response);
  },

  getAllProblems: async (): Promise<Problem[]> => {
    const response = await fetch(`${API_URL}/problems`);
    return handleResponse(response);
  },

  getAllModules: async (): Promise<any[]> => {
    // Current backend doesn't have courses/modules yet, so we still use mock
    return (await import('../mockData')).MOCK_COURSES;
  },

  getModuleById: async (id: string): Promise<any> => {
    const modules = (await import('../mockData')).MOCK_COURSES;
    const module = modules.find(m => m.id === id);
    if (!module) throw new Error('Module not found');
    return module;
  },

  getProblemsByModule: async (moduleId: string): Promise<Problem[]> => {
    // Current backend doesn't support moduleId filtering yet, 
    // we might need more problems in DB and map them.
    // For now, return all and filter
    const problems = await apiService.getAllProblems();
    return problems.filter((p: any) => p.moduleId === moduleId);
  },

  getDailyChallenge: async (): Promise<Problem | null> => {
    const problems = await apiService.getAllProblems();
    return (problems as any).find((p: any) => p.isDaily) || problems[0];
  },

  getAllAchievements: async (): Promise<Achievement[]> => {
    return (await import('../mockData')).MOCK_ACHIEVEMENTS;
  },

  getUserProgress: async (userId: string): Promise<UserProgress> => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.warn('Backend unavailable, using initial progress');
      return INITIAL_USER_PROGRESS;
    }
  },

  updateProgress: async (userId: string, updates: Partial<UserProgress>): Promise<UserProgress> => {
    // If it's a problem solve update, we use a specific endpoint
    if (updates.problemsSolved && (updates as any).lastProblemId) {
      const response = await fetch(`${API_URL}/users/${userId}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: (updates as any).lastProblemId,
          timeSpent: updates.timeSpent || 0
        })
      });
      return handleResponse(response);
    }

    // Otherwise use generic update
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  checkAnswer: async (problemId: string, answer: string): Promise<{ correct: boolean, explanation: string }> => {
    const response = await fetch(`${API_URL}/problems/${problemId}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    });
    return handleResponse(response);
  }
};
