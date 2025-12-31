import {
  Problem,
  UserProgress,
  Achievement,
  ShopItem,
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
    const response = await fetch(`${API_URL}/courses/${id}`);
    return handleResponse(response);
  },

  getProblemsByModule: async (moduleId: string): Promise<Problem[]> => {
    const course = await apiService.getModuleById(moduleId);
    return course.chapters.flatMap((ch: any) => ch.problems);
  },

  getDailyChallenge: async (): Promise<Problem | null> => {
    const problems = await apiService.getAllProblems();
    return (problems as any).find((p: any) => p.isDaily) || problems[0];
  },

  getAllAchievements: async (): Promise<Achievement[]> => {
    const response = await fetch(`${API_URL}/achievements`);
    return handleResponse(response).catch(() => []);
  },

  getUserProgress: async (): Promise<UserProgress> => {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateProgress: async (updates: Partial<UserProgress>): Promise<UserProgress> => {
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
  },

  get: async (endpoint: string): Promise<any> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, data?: any): Promise<any> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    return handleResponse(response);
  },

  createProblem: async (problemData: any): Promise<Problem> => {
    return apiService.post('/admin/problems', problemData);
  },

  updateProblem: async (id: string, problemData: any): Promise<Problem> => {
    const response = await fetch(`${API_URL}/admin/problems/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(problemData)
    });
    return handleResponse(response);
  },

  deleteProblem: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/problems/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createCourse: async (courseData: any): Promise<any> => {
    return apiService.post('/admin/courses', courseData);
  },

  updateCourse: async (id: string, courseData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/admin/courses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(courseData)
    });
    return handleResponse(response);
  },

  createChapter: async (courseId: string, chapterData: any): Promise<any> => {
    return apiService.post(`/admin/courses/${courseId}/chapters`, chapterData);
  },

  // Shop Methods
  getShopItems: async (): Promise<ShopItem[]> => {
    try {
      const response = await fetch(`${API_URL}/shop/items`);
      return handleResponse(response);
    } catch {
      const { MOCK_SHOP_ITEMS } = await import('../mockData');
      return MOCK_SHOP_ITEMS;
    }
  },

  purchaseItem: async (itemId: string): Promise<UserProgress> => {
    return apiService.post('/users/purchase', { itemId });
  }
};
