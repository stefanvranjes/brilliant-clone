import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface ConceptCard {
    front: string;
    back: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

interface FlashcardReviewProps {
    cards: ConceptCard[];
    onClose: () => void;
    title: string;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({ cards, onClose, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        } else {
            setIsFinished(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-3xl border-2 border-gray-100 shadow-2xl text-center max-w-xl mx-auto"
            >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Review Complete!</h2>
                <p className="text-gray-500 font-medium mb-8">You've mastered these concepts. Come back soon to keep them fresh!</p>
                <Button onClick={onClose} size="lg" className="px-12">Back to Course</Button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto py-12">
            <div className="flex items-center justify-between w-full mb-8">
                <h2 className="text-xl font-black text-gray-900">{title} Review</h2>
                <span className="text-sm font-bold text-gray-400">
                    {currentIndex + 1} of {cards.length}
                </span>
            </div>

            <div className="relative w-full aspect-[3/2] perspective-1000 mb-12">
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-full h-full relative preserve-3d cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] border-4 border-gray-100 shadow-xl p-12 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4">Question</span>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{currentCard.front}</h3>
                        <div className="absolute bottom-6 flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <RotateCw size={14} /> Click to reveal answer
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden bg-black rounded-[2rem] border-4 border-black shadow-xl p-12 flex flex-col items-center justify-center text-center text-white"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Answer</span>
                        <p className="text-xl font-bold leading-relaxed">{currentCard.back}</p>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`p-4 rounded-2xl border-2 transition-all ${currentIndex === 0 ? 'border-gray-50 text-gray-200' : 'border-gray-100 text-gray-900 hover:border-black'
                        }`}
                >
                    <ChevronLeft size={24} />
                </button>

                <Button onClick={handleNext} size="lg" className="px-12 py-6 rounded-2xl text-lg font-black min-w-[200px]">
                    {currentIndex === cards.length - 1 ? 'Finish Review' : 'Next Card'}
                </Button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className={`p-4 rounded-2xl border-2 transition-all ${currentIndex === cards.length - 1 ? 'border-gray-50 text-gray-200' : 'border-gray-100 text-gray-900 hover:border-black'
                        }`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};
