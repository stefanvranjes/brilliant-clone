import { apiService } from './api.service';
import { MOCK_USER } from '../mockData';

// Mock LocalStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('API Service (Logic Tests)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should initialize default user if storage is empty', async () => {
    const user = await apiService.getUserProgress('test-user');
    expect(user.level).toBe(5); // Default mock level
    expect(user.totalXP).toBe(1250);
  });

  test('should increase level when XP threshold is crossed', async () => {
    // Setup initial user with 900 XP (Level 1)
    const initialUser = { ...MOCK_USER, totalXP: 900, level: 1 };
    window.localStorage.setItem('brilliant_clone_user', JSON.stringify(initialUser));

    // Add 200 XP -> 1100 XP (Should be Level 2)
    const updated = await apiService.updateProgress('test-user', { totalXP: 200 });
    
    expect(updated.totalXP).toBe(1100);
    expect(updated.level).toBe(2); // Math.floor(1100 / 1000) + 1
  });

  test('should increment streak if active yesterday', async () => {
    // Mock Date to "Today"
    const today = new Date('2023-10-15T12:00:00Z');
    jest.setSystemTime(today);

    // Setup user active "Yesterday"
    const yesterdayUser = { 
      ...MOCK_USER, 
      currentStreak: 5, 
      lastActiveDate: '2023-10-14' 
    };
    window.localStorage.setItem('brilliant_clone_user', JSON.stringify(yesterdayUser));

    const updated = await apiService.updateProgress('test-user', { problemsSolved: 1 });
    
    expect(updated.currentStreak).toBe(6);
    expect(updated.lastActiveDate).toBe('2023-10-15');
  });

  test('should reset streak if missed a day', async () => {
    // Mock Date to "Today"
    const today = new Date('2023-10-15T12:00:00Z');
    jest.setSystemTime(today);

    // Setup user active 2 days ago
    const oldUser = { 
      ...MOCK_USER, 
      currentStreak: 10, 
      lastActiveDate: '2023-10-13' 
    };
    window.localStorage.setItem('brilliant_clone_user', JSON.stringify(oldUser));

    const updated = await apiService.updateProgress('test-user', { problemsSolved: 1 });
    
    expect(updated.currentStreak).toBe(1); // Reset
  });

  test('should not increment streak twice on same day', async () => {
    // Mock Date to "Today"
    const today = new Date('2023-10-15T12:00:00Z');
    jest.setSystemTime(today);

    // Setup user active "Today" already
    const sameDayUser = { 
      ...MOCK_USER, 
      currentStreak: 5, 
      lastActiveDate: '2023-10-15' 
    };
    window.localStorage.setItem('brilliant_clone_user', JSON.stringify(sameDayUser));

    const updated = await apiService.updateProgress('test-user', { problemsSolved: 1 });
    
    expect(updated.currentStreak).toBe(5); // Unchanged
  });
});
