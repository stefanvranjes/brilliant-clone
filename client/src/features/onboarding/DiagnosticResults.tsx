import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BarChart3, Rocket, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Result {
    problemId: string;
    isCorrect: boolean;
    category: string;
}

const DiagnosticResults: React.FC<{ results: Result[] }> = ({ results }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const correctCount = results.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctCount / results.length) * 100);

    const categories = Array.from(new Set(results.map(r => r.category)));
    const masteryData = categories.map(cat => {
        const catResults = results.filter(r => r.category === cat);
        const correct = catResults.filter(r => r.isCorrect).length;
        return {
            category: cat,
            score: Math.round((correct / catResults.length) * 100)
        };
    });

    return (
        <div className="min-h-screen bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>

                <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">{t('onboarding.complete')}</h1>
                <p className="text-xl text-gray-500 font-bold mb-12 max-w-xl mx-auto leading-relaxed">
                    Great job! Our systems have created a custom learning path based on your performance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Overall Accuracy */}
                    <div className="glass-card p-10 rounded-[3rem] border border-gray-100 shadow-xl bg-gray-50/50">
                        <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">{t('onboarding.accuracy')}</div>
                        <div className="text-6xl font-black text-blue-600 mb-4">{accuracy}%</div>
                        <div className="flex justify-center gap-1">
                            {results.map((r, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${r.isCorrect ? 'bg-green-500' : 'bg-red-300'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="glass-card p-10 rounded-[3rem] border border-gray-100 shadow-xl bg-gray-50/50">
                        <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">{t('onboarding.breakdown')}</div>
                        <div className="space-y-4">
                            {masteryData.map(data => (
                                <div key={data.category}>
                                    <div className="flex justify-between text-xs font-black text-gray-600 uppercase mb-1">
                                        <span>{data.category}</span>
                                        <span>{data.score}%</span>
                                    </div>
                                    <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data.score}%` }}
                                            className="h-full bg-gray-900"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        onClick={() => navigate('/')}
                        className="h-16 px-10 rounded-2xl text-lg font-black group"
                    >
                        {t('onboarding.start_learning')}
                        <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="h-16 px-10 rounded-2xl text-lg font-black border-2"
                    >
                        View Dashboard
                        <BarChart3 className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticResults;
