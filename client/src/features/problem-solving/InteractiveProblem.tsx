import React, { useState } from 'react';
import { Problem } from '../../mockData';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProblem } from '../../hooks/useProblem';
import { useProgress } from '../../hooks/useProgress';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { PageTransition } from '../../components/ui/PageTransition';
import VisualizationEngine from '../visualization/VisualizationEngine';
import DiscussionSection from '../community/DiscussionSection';
import { useAuth } from '../../context/AuthContext';
import { SortingInteraction } from './SortingInteraction';
import { AiTutor } from '../ai-tutor/AiTutor';
import { apiService } from '../../services/api.service';
import { SYWEditor } from './SYWEditor';
import { parseDSL, DSLRenderer } from '../../utils/VisualDSLParser';

const InteractiveProblem = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { problem: problemRaw, loading, error } = useProblem(problemId);
  const { updateProgress } = useProgress();
  const { user } = useAuth();

  // Safeguard: cast problem to any to avoid persistent type errors in environment
  const problem = problemRaw as any;

  // State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [revealedHintIndices, setRevealedHintIndices] = useState<number[]>([]);
  const [currentSortingOrder, setCurrentSortingOrder] = useState<string[]>([]);

  const toggleHint = (index: number) => {
    if (!revealedHintIndices.includes(index)) {
      setRevealedHintIndices([...revealedHintIndices, index]);
    }
  };

  const handleSubmit = () => {
    if (!problem) return;

    let userAnswer = '';
    let correct = false;

    if (problem.type === 'multiple-choice') {
      if (!selectedOption) return;
      userAnswer = selectedOption;
      correct = selectedOption === String(problem.solution.answer);
    } else if (problem.type === 'numerical') {
      if (!textInput.trim()) return;
      userAnswer = textInput.trim();
      correct = userAnswer.toLowerCase() === String(problem.solution.answer).toLowerCase();
    } else if (problem.type === 'sorting') {
      userAnswer = JSON.stringify(currentSortingOrder);
      const correctOrder = problem.solution.answer as string[];
      correct = currentSortingOrder.length === correctOrder.length &&
        currentSortingOrder.every((id, idx) => id === correctOrder[idx]);
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      updateProgress({
        totalXP: (problem.xpReward || 0),
        problemsSolved: 1,
        dailyChallengeCompleted: (problem as any).isDaily || false
      });
      setShowModal(true);
    } else {
      // Register mistake in bank
      apiService.registerMistake(problemId || '');
    }
  };

  const handleShare = () => {
    const text = `I just solved "${problem.title}" on BrilliantClone and earned ${problem.xpReward} XP! 🚀`;
    navigator.clipboard.writeText(text);
    alert('Progress summary copied to clipboard!');
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setTextInput('');
  };

  if (loading) return <LoadingSpinner />;
  if (error || !problem) return <div className="text-center p-10 text-red-600">Problem not found</div>;

  const isSubmitDisabled =
    (problem.type === 'multiple-choice' || problem.type === 'choice-with-image') ? !selectedOption :
      ((problem.type === 'numerical' || (problem.type as string) === 'fill-in-the-blank') && !textInput.trim()) ||
      isSubmitted;

  return (
    <PageTransition className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">
            {problem.category}
          </span>
          <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded capitalize">
            {problem.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">{problem.title}</h1>
        <div className="prose prose-lg text-gray-700">
          {parseDSL(problem.description).map((part, i) => (
            typeof part === 'string' ? (
              <p key={i}>{part}</p>
            ) : (
              <DSLRenderer key={i} tag={part} />
            )
          ))}
          {isSubmitted && isCorrect && (problem.category === 'Logic' || problem.category === 'Computer Science') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <SYWEditor
                problemId={problemId!}
                onSubmit={(content) => apiService.submitSolution(problemId!, content)}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* VISUALIZATION AREA */}
      {problem.visualizationId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <VisualizationEngine
            visualizationId={problem.visualizationId}
            config={problem.visualizationConfig}
          />
        </motion.div>
      )}

      {/* Interaction Area */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">

        {/* MULTIPLE CHOICE */}
        {problem.type === 'multiple-choice' && problem.options && (
          <div className="space-y-3">
            {problem.options.map((option: string) => (
              <motion.div
                key={option}
                whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                onClick={() => !isSubmitted && setSelectedOption(option)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-between ${isSubmitted && option === problem.solution.answer
                  ? 'bg-green-50 border-green-500 text-green-900'
                  : isSubmitted && option === selectedOption && option !== problem.solution.answer
                    ? 'bg-red-50 border-red-500 text-red-900'
                    : selectedOption === option
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="font-medium text-lg">{option}</span>
                {isSubmitted && option === problem.solution.answer && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600">✓</motion.span>
                )}
                {isSubmitted && option === selectedOption && option !== problem.solution.answer && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-600">✕</motion.span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* CHOICE WITH IMAGE */}
        {problem.type === 'choice-with-image' && problem.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problem.options.map((option: any) => (
              <motion.div
                key={option.id || option.text}
                whileHover={!isSubmitted ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                onClick={() => !isSubmitted && setSelectedOption(option.text)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 ${isSubmitted && option.text === problem.solution.answer
                  ? 'bg-green-50 border-green-500 shadow-sm'
                  : isSubmitted && option.text === selectedOption && option.text !== problem.solution.answer
                    ? 'bg-red-50 border-red-500'
                    : selectedOption === option.text
                      ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-100'
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
              >
                {option.image && (
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={option.image}
                      alt={option.text}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between px-1">
                  <span className="font-bold text-gray-700">{option.text}</span>
                  {isSubmitted && option.text === problem.solution.answer && (
                    <span className="text-green-600 bg-green-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">✓</span>
                  )}
                  {isSubmitted && option.text === selectedOption && option.text !== problem.solution.answer && (
                    <span className="text-red-600 bg-red-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">✕</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* FILL IN THE BLANK / NUMERICAL */}
        {(problem.type === 'numerical' || (problem.type as string) === 'fill-in-the-blank') && (
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Answer
            </label>
            <div className="relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => !isSubmitted && setTextInput(e.target.value)}
                disabled={isSubmitted}
                placeholder="Type your answer here..."
                className={`w-full p-4 text-lg border-2 rounded-xl outline-none transition-all ${isSubmitted
                  ? (isCorrect ? 'border-green-500 bg-green-50 text-green-900' : 'border-red-500 bg-red-50 text-red-900')
                  : 'border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-100'
                  }`}
              />
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 font-bold flex items-center gap-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isCorrect ? (
                    <><span>✓</span> Correct!</>
                  ) : (
                    <><span>✕</span> Incorrect. The answer is {problem.solution.answer}</>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* SORTING */}
        {problem.type === 'sorting' && problem.options && (
          <SortingInteraction
            items={problem.options}
            isSubmitted={isSubmitted}
            correctOrderIds={problem.solution.answer as string[]}
            onOrderChange={setCurrentSortingOrder}
          />
        )}

        {/* GENERIC FALLBACK */}
        {problem.type !== 'multiple-choice' && problem.type !== 'numerical' && problem.type !== 'sorting' && (
          <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
            Interactive component placeholder for type: {problem.type}
          </div>
        )}
      </div>

      {/* HINT SYSTEM */}
      {problem.hints && problem.hints.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-black text-gray-900 leading-none">Hints</h3>
            <div className="h-1 grow bg-gray-100 rounded-full" />
          </div>

          <div className="space-y-4">
            {problem.hints.map((hint: any, idx: number) => {
              const isRevealed = revealedHintIndices.includes(idx);
              const isLocked = idx > 0 && !revealedHintIndices.includes(idx - 1);

              return (
                <motion.div
                  key={hint.id || idx}
                  initial={false}
                  animate={{ opacity: isLocked ? 0.6 : 1 }}
                  className={`rounded-2xl border-2 transition-all p-6 ${isRevealed
                    ? 'bg-blue-50/30 border-blue-100 ring-1 ring-blue-50'
                    : 'bg-white border-gray-100'
                    }`}
                >
                  {isRevealed ? (
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white mt-1">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed font-medium text-lg">
                        {hint.content}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-black text-gray-400 border border-gray-100">
                          {idx + 1}
                        </div>
                        <span className="text-gray-400 font-bold tracking-tight">
                          {isLocked ? 'Complete previous hint to unlock' : 'Need a little help?'}
                        </span>
                      </div>
                      {!isLocked && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleHint(idx)}
                          className="font-black"
                        >
                          Show Hint
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {problem && <DiscussionSection problemId={problem.id} />}

      {/* Footer / Actions */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/')}>
          Back to Path
        </Button>
        <Button
          size="lg"
          onClick={isSubmitted && !isCorrect ? handleRetry : handleSubmit}
          disabled={!isSubmitted && isSubmitDisabled}
          variant={isSubmitted ? (isCorrect ? 'primary' : 'secondary') : 'primary'}
        >
          {isSubmitted ? (isCorrect ? 'Correct!' : 'Try Again') : 'Submit Answer'}
        </Button>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Problem Solved!</h2>
          <p className="text-gray-600 mb-6">You earned <span className="font-bold text-yellow-600">+{problem.xpReward} XP</span></p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleShare}>
              Share 🔗
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              View Stats
            </Button>
            <Button onClick={() => navigate('/')}>
              Next Problem
            </Button>
          </div>
        </div>
      </Modal>

      <AiTutor
        problemContext={{
          title: problem.title,
          description: problem.description,
          category: problem.category,
          topic: (problem as any).topic
        }}
      />
    </PageTransition>
  );
};

export default InteractiveProblem;
