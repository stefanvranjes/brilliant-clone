import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api.service';
import { Achievement } from '../../mockData';

interface AchievementGalleryProps {
    unlockedAchievements?: Array<{ id: string, unlockedAt: string }>;
}

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({ unlockedAchievements = [] }) => {
    const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const data = await apiService.getAllAchievements();
                setAllAchievements(data);
            } catch (err) {
                console.error('Failed to fetch all achievements', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    const unlockedIds = unlockedAchievements.map(a => a.id);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading gallery...</div>;

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Achievement Gallery</h2>
                <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                    {unlockedIds.length} / {allAchievements.length} Unlocked
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {allAchievements.map((achievement) => {
                    const isUnlocked = unlockedIds.includes(achievement.id);
                    const unlockedInfo = unlockedAchievements.find(a => a.id === achievement.id);

                    return (
                        <motion.div
                            key={achievement.id}
                            whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
                            className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center ${isUnlocked
                                    ? 'border-yellow-100 bg-gradient-to-br from-yellow-50/50 to-white shadow-lg shadow-yellow-100/20'
                                    : 'border-gray-50 bg-gray-50/30 opacity-40 grayscale pointer-events-none'
                                }`}
                        >
                            <div className={`text-5xl mb-4 transition-transform duration-500 ${isUnlocked ? 'group-hover:rotate-12 group-hover:scale-110' : ''}`}>
                                {achievement.icon}
                            </div>
                            <h3 className="text-sm font-black text-gray-900 mb-1 leading-tight">{achievement.title}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                {isUnlocked && unlockedInfo
                                    ? new Date(unlockedInfo.unlockedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                    : 'Locked'}
                            </p>

                            {isUnlocked && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] shadow-md border-2 border-white">
                                    ✨
                                </div>
                            )}

                            {/* Tooltip on hover for description */}
                            {isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-2xl p-4 z-10">
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">{achievement.description}</p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
