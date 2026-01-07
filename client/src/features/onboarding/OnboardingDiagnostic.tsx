import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Brain, Rocket, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import InteractiveProblem from '../problem-solving/InteractiveProblem';
import DiagnosticResults from './DiagnosticResults';

const OnboardingDiagnostic: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [problems, setProblems] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [diagnosing, setDiagnosing] = useState(false);

    useEffect(() => {
        const fetchSet = async () => {
            try {
                const response = await fetch('/api/onboarding/diagnostic', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const result = await response.json();
                if (result.success) {
                    setProblems(result.data);
                }
            } catch (error) {
                console.error('Error fetching diagnostic set:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSet();
    }, []);

    const handleProblemComplete = (isCorrect: boolean) => {
        const newResults = [...results, {
            problemId: problems[currentIndex]._id,
            isCorrect,
            category: problems[currentIndex].category
        }];
        setResults(newResults);

        if (currentIndex < problems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishOnboarding(newResults);
        }
    };

    const finishOnboarding = async (finalResults: any[]) => {
        setDiagnosing(true);
        try {
            const response = await fetch('/api/onboarding/finish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ results: finalResults })
            });
            const result = await response.json();
            if (result.success) {
                setIsFinished(true);
            }
        } catch (error) {
            console.error('Error finishing diagnostic:', error);
        } finally {
            setDiagnosing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-black text-gray-900">{t('onboarding.preparing')}</h2>
                </div>
            </div>
        );
    }

    if (isFinished) {
        return <DiagnosticResults results={results} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <Target className="w-4 h-4" />
                        {t('onboarding.accuracy')}
                    </motion.div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">{t('onboarding.title')}</h1>
                    <p className="text-gray-600 font-medium max-w-lg mx-auto">
                        {t('onboarding.subtitle')}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                            {t('onboarding.problem_count', { current: currentIndex + 1, total: problems.length })}
                        </span>
                        <span className="text-sm font-black text-blue-600">
                            {t('onboarding.percent_complete', { percent: Math.round(((currentIndex) / problems.length) * 100) })}
                        </span>
                    </div>
                    <div className="h-4 bg-white rounded-full p-1 border border-gray-100 shadow-inner overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
                            className="h-full bg-blue-600 rounded-full"
                        />
                    </div>
                </div>

                {/* Problem Container */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative"
                    >
                        <InteractiveProblem
                            problemData={problems[currentIndex]}
                            onComplete={handleProblemComplete}
                        />
                    </motion.div>
                </AnimatePresence>

                {diagnosing && (
                    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="text-center">
                            <Brain className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-gray-900">{t('onboarding.diagnosing')}</h2>
                            <p className="text-gray-500 font-bold mt-2">Almost there!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingDiagnostic;
