import React, { useState } from 'react';
import { Lightbulb, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  hints: Array<{ id: string; content: string; xpCost: number }>;
  solution: { answer: string | number; explanation: string };
  xpReward: number;
  estimatedTime: number;
}

interface InteractiveProblemProps {
  problem: Problem;
  onComplete: (correct: boolean, timeSpent: number) => void;
}

export const InteractiveProblem: React.FC<InteractiveProblemProps> = ({
  problem,
  onComplete
}) => {
  const [answer, setAnswer] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);
    
    // Validate answer
    const correct = answer.toLowerCase().trim() === 
                    String(problem.solution.answer).toLowerCase().trim();
    
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => onComplete(true, timeSpent), 2000);
    }
  };

  const revealHint = () => {
    if (hintsRevealed < problem.hints.length) {
      setHintsRevealed(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
              {problem.difficulty}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{problem.estimatedTime} min</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
        </div>

        <div className="p-6">
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed">{problem.description}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your answer"
            />
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Correct! +{problem.xpReward} XP
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      Not quite. Try again!
                    </span>
                  </>
                )}
              </div>
              {isCorrect && (
                <p className="text-sm text-green-700 mt-2">
                  {problem.solution.explanation}
                </p>
              )}
            </div>
          )}

          {hintsRevealed > 0 && (
            <div className="mb-6 space-y-3">
              {problem.hints.slice(0, hintsRevealed).map((hint, index) => (
                <div key={hint.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-yellow-900">Hint {index + 1}</span>
                      <p className="text-yellow-800 mt-1">{hint.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!answer}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
            {hintsRevealed < problem.hints.length && (
              <button
                onClick={revealHint}
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Get Hint (-{problem.hints[hintsRevealed]?.xpCost || 0} XP)
              </button>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600 text-center">
            Attempts: {attempts} | XP Reward: {problem.xpReward}
          </div>
        </div>
      </div>
    </div>
  );
};