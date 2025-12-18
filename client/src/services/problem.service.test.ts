import { problemService } from '../services/problem.service';

describe('ProblemService', () => {
  describe('validateNumericalAnswer', () => {
    it('should validate correct numerical answers', () => {
      const result = problemService.validateNumericalAnswer('42', 42);
      expect(result.isCorrect).toBe(true);
    });

    it('should accept answers within tolerance', () => {
      const result = problemService.validateNumericalAnswer('3.14159', 3.14);
      expect(result.isCorrect).toBe(true);
    });

    it('should reject incorrect answers', () => {
      const result = problemService.validateNumericalAnswer('10', 20);
      expect(result.isCorrect).toBe(false);
    });
  });

  describe('calculateXPReward', () => {
    it('should return base XP with no penalties', () => {
      const xp = problemService.calculateXPReward(100, 0, 1, 120);
      expect(xp).toBe(100);
    });

    it('should apply hint penalties', () => {
      const xp = problemService.calculateXPReward(100, 2, 1, 120);
      expect(xp).toBe(80); // 10% penalty per hint
    });

    it('should apply attempt penalties', () => {
      const xp = problemService.calculateXPReward(100, 0, 3, 120);
      expect(xp).toBe(90); // 5% penalty per extra attempt
    });

    it('should apply speed bonus', () => {
      const xp = problemService.calculateXPReward(100, 0, 1, 45);
      expect(xp).toBe(120); // 20% bonus for under 60s
    });
  });
});