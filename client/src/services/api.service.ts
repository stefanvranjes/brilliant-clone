const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] =`Bearer \${token}\`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${API_BASE_URL}\${endpoint}\`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || \`HTTP error! status: \${response.status}\`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, username: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Problem endpoints
  async getProblems(params?: { category?: string; difficulty?: string; page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(\`/problems?\${query}\`);
  }

  async getProblem(id: string) {
    return this.request(\`/problems/\${id}\`);
  }

  async validateAnswer(problemId: string, answer: any) {
    return this.request(\`/problems/\${problemId}/validate\`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    });
  }

  // Progress endpoints
  async getProgress(userId: string) {
    return this.request(\`/progress/\${userId}\`);
  }

  async updateProgress(userId: string, updates: any) {
    return this.request(\`/progress/\${userId}\`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async completeProblem(userId: string, problemId: string, data: any) {
    return this.request(\`/progress/\${userId}/complete\`, {
      method: 'POST',
      body: JSON.stringify({ problemId, ...data }),
    });
  }

  // Course endpoints
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id: string) {
    return this.request(\`/courses/\${id}\`);
  }

  async enrollCourse(courseId: string) {
    return this.request(\`/courses/\${courseId}/enroll\`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();