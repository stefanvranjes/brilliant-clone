import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../mockData';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
    return (
        <motion.div
            whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
            className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center group ${isUnlocked
                    ? 'bg-white border-yellow-200 shadow-md hover:shadow-xl hover:border-yellow-400'
                    : 'bg-gray-50 border-gray-100 opacity-60'
                }`}
        >
            {/* Badge Circle */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 transition-all ${isUnlocked
                    ? 'bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg shadow-yellow-100 group-hover:rotate-12'
                    : 'bg-gray-200 grayscale'
                }`}>
                {achievement.icon}
            </div>

            <h3 className={`font-black text-lg mb-1 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.title}
            </h3>
            <p className={`text-sm font-medium ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {achievement.description}
            </p>

            {!isUnlocked && (
                <div className="absolute top-2 right-2 opacity-20">
                    🔒
                </div>
            )}

            {isUnlocked && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg border-2 border-white"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </motion.div>
            )}
        </motion.div>
    );
};
