import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Problem } from '../../mockData';
import { Button } from './Button';
import { Calendar, Flame, CheckCircle2 } from 'lucide-react';

interface DailyChallengeCardProps {
    challenge: Problem | null;
    isCompleted: boolean;
    streak: number;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
    challenge,
    isCompleted,
    streak
}) => {
    const navigate = useNavigate();

    if (!challenge) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl p-8 mb-12 border-2 transition-all ${isCompleted
                ? 'bg-green-50 border-green-200'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-xl shadow-indigo-200'
                }`}
        >
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'bg-green-200 text-green-700' : 'bg-white/20 text-white'
                            }`}>
                            Daily Challenge
                        </div>
                        {isCompleted && (
                            <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                                <CheckCircle2 size={16} />
                                <span>Completed</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className={`text-4xl font-black mb-2 ${isCompleted ? 'text-gray-900' : 'text-white'}`}>
                            {challenge.title}
                        </h2>
                        <p className={`text-lg font-medium max-w-xl ${isCompleted ? 'text-gray-600' : 'text-indigo-50'}`}>
                            {isCompleted
                                ? "Excellent work! You've sharpened your mind for today. Come back tomorrow for a new challenge."
                                : "A new puzzle awaits. Solve today's challenge to maintain your streak and earn bonus XP."}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-white/10 text-white'}`}>
                                <Flame size={20} fill={isCompleted ? "currentColor" : "none"} />
                            </div>
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-tighter ${isCompleted ? 'text-gray-400' : 'text-indigo-200'}`}>Streak</p>
                                <p className={`text-xl font-black ${isCompleted ? 'text-gray-900' : 'text-white'}`}>{streak} Days</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-white/10 text-white'}`}>
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-tighter ${isCompleted ? 'text-gray-400' : 'text-indigo-200'}`}>Reward</p>
                                <p className={`text-xl font-black ${isCompleted ? 'text-gray-900' : 'text-white'}`}>+{challenge.xpReward} XP</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <Button
                        size="lg"
                        variant={isCompleted ? 'outline' : 'secondary'}
                        onClick={() => navigate(`/problem/${challenge.id}`)}
                        className={isCompleted ? 'border-green-200 text-green-700 hover:bg-green-100' : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'}
                    >
                        {isCompleted ? 'Review Challenge' : 'Solve Challenge'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
