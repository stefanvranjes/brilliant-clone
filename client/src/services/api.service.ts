import {
  Problem,
  UserProgress,
  Achievement,
  INITIAL_USER_PROGRESS
} from '../mockData';

const API_URL = 'http://localhost:5000/api';

let authToken: string | null = localStorage.getItem('token');

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    authToken = null;
    // Potentially trigger a redirect to login here if not in a hook
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

const getHeaders = (contentType = 'application/json') => {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
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
    const response = await fetch(`${API_URL}/courses`);
    return handleResponse(response);
  },

  getModuleById: async (id: string): Promise<any> => {
    // We try to find by ID first, the backend route expects mongo ID
    const response = await fetch(`${API_URL}/courses/${id}`);
    return handleResponse(response);
  },

  getProblemsByModule: async (moduleId: string): Promise<Problem[]> => {
    // Now we can fetch the course and it will have populated problems
    const course = await apiService.getModuleById(moduleId);
    return course.chapters.flatMap((ch: any) => ch.problems);
  },

  getDailyChallenge: async (): Promise<Problem | null> => {
    const problems = await apiService.getAllProblems();
    return (problems as any).find((p: any) => p.isDaily) || problems[0];
  },

  getAllAchievements: async (): Promise<Achievement[]> => {
    const response = await fetch(`${API_URL}/achievements`); // Assuming I'll add this route too
    return handleResponse(response).catch(() => []); // Fallback to empty if not implemented
  },

  getUserProgress: async (): Promise<UserProgress> => {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateProgress: async (updates: Partial<UserProgress>): Promise<UserProgress> => {
    // If it's a problem solve update, we use a specific endpoint
    if (updates.problemsSolved && (updates as any).lastProblemId) {
      const response = await fetch(`${API_URL}/users/solve`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          problemId: (updates as any).lastProblemId,
          timeSpent: updates.timeSpent || 0
        })
      });
      return handleResponse(response);
    }

    // Otherwise use generic update
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  checkAnswer: async (problemId: string, answer: string): Promise<{ correct: boolean, explanation: string }> => {
    const response = await fetch(`${API_URL}/problems/${problemId}/check`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answer })
    });
    return handleResponse(response);
  },

  // Auth Methods
  login: async (credentials: any): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    if (data.token) {
      authToken = data.token;
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  register: async (userData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await handleResponse(response);
    if (data.token) {
      authToken = data.token;
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  logout: () => {
    authToken = null;
    localStorage.removeItem('token');
  },

  getMe: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};
