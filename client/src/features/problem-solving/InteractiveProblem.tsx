import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProblem } from '../../hooks/useProblem';
import { useProgress } from '../../hooks/useProgress';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { PageTransition } from '../../components/ui/PageTransition';

const InteractiveProblem = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { problem, loading, error } = useProblem(problemId);
  const { updateProgress } = useProgress();

  // State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if (!problem) return;
    
    let userAnswer = '';
    let correct = false;

    if (problem.type === 'multiple-choice') {
      if (!selectedOption) return;
      userAnswer = selectedOption;
      correct = selectedOption === problem.correctAnswer;
    } else if (problem.type === 'fill-in-the-blank') {
      if (!textInput.trim()) return;
      userAnswer = textInput.trim();
      correct = userAnswer.toLowerCase() === String(problem.correctAnswer).toLowerCase();
    }
    
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      updateProgress({
        totalXP: (problem.xpReward || 0), 
        problemsSolved: 1 
      });
      setShowModal(true);
    }
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
    (problem.type === 'multiple-choice' && !selectedOption) ||
    (problem.type === 'fill-in-the-blank' && !textInput.trim()) || 
    isSubmitted;

  return (
    <PageTransition className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">
            {problem.category}
          </span>
          <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
            {problem.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">{problem.title}</h1>
        <div className="prose prose-lg text-gray-700">
          <p>{problem.description}</p>
        </div>
      </div>

      {/* Interaction Area */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
        
        {/* MULTIPLE CHOICE */}
        {problem.type === 'multiple-choice' && problem.options && (
          <div className="space-y-3">
            {problem.options.map((option) => (
              <motion.div 
                key={option}
                whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                onClick={() => !isSubmitted && setSelectedOption(option)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-between ${
                  isSubmitted && option === problem.correctAnswer
                    ? 'bg-green-50 border-green-500 text-green-900'
                    : isSubmitted && option === selectedOption && option !== problem.correctAnswer
                    ? 'bg-red-50 border-red-500 text-red-900'
                    : selectedOption === option
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-200'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-lg">{option}</span>
                {isSubmitted && option === problem.correctAnswer && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600">✓</motion.span>
                )}
                {isSubmitted && option === selectedOption && option !== problem.correctAnswer && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-600">✕</motion.span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* FILL IN THE BLANK */}
        {problem.type === 'fill-in-the-blank' && (
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
                 className={`w-full p-4 text-lg border-2 rounded-xl outline-none transition-all ${
                   isSubmitted 
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
                     <><span>✕</span> Incorrect. The answer is {problem.correctAnswer}</>
                   )}
                 </motion.div>
               )}
             </div>
          </div>
        )}

        {/* GENERIC FALLBACK */}
        {problem.type !== 'multiple-choice' && problem.type !== 'fill-in-the-blank' && (
          <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
            Interactive component placeholder for type: {problem.type}
          </div>
        )}
      </div>

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
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              View Stats
            </Button>
            <Button onClick={() => navigate('/')}>
              Next Problem
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};

export default InteractiveProblem;
