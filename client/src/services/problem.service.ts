interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  explanation?: string;
}

export class ProblemService {
  validateNumericalAnswer(userAnswer: string | number, correctAnswer: string | number): ValidationResult {
    const normalize = (val: string | number) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? null : num;
    };

    const userNum = normalize(userAnswer);
    const correctNum = normalize(correctAnswer);

    if (userNum === null) {
      return {
        isCorrect: false,
        feedback: 'Please enter a valid number'
      };
    }

    if (correctNum === null) {
      return {
        isCorrect: false,
        feedback: 'Invalid correct answer configured'
      };
    }

    const tolerance = 0.01;
    const isCorrect = Math.abs(userNum - correctNum) < tolerance;

    return {
      isCorrect,
      feedback: isCorrect ? 'Correct!' : 'Not quite right. Try again!'
    };
  }

  validateTextAnswer(userAnswer: string, correctAnswer: string): ValidationResult {
    const normalize = (text: string) => 
      text.toLowerCase().trim().replace(/\\s+/g, ' ');

    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);

    return {
      isCorrect,
      feedback: isCorrect ? 'Correct!' : 'Not quite right. Try again!'
    };
  }

  validateMultipleChoice(userAnswer: string, correctAnswer: string): ValidationResult {
    const isCorrect = userAnswer === correctAnswer;

    return {
      isCorrect,
      feedback: isCorrect ? 'Correct!' : 'Not quite right. Try again!'
    };
  }

  calculateXPReward(
    baseXP: number, 
    hintsUsed: number, 
    attempts: number, 
    timeSpent: number
  ): number {
    let xp = baseXP;

    // Penalty for hints (10% per hint)
    xp -= hintsUsed * (baseXP * 0.1);

    // Penalty for multiple attempts (5% per additional attempt)
    if (attempts > 1) {
      xp -= (attempts - 1) * (baseXP * 0.05);
    }

    // Bonus for fast completion (under 60 seconds = 20% bonus)
    if (timeSpent < 60) {
      xp += baseXP * 0.2;
    }

    // Ensure minimum of 10% of base XP
    return Math.max(Math.floor(xp), Math.floor(baseXP * 0.1));
  }
}

export const problemService = new ProblemService();