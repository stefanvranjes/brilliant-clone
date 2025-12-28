import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import communityService, { LeaderboardUser } from '../services/community.service';
import { PageTransition } from '../components/ui/PageTransition';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Leaderboard: React.FC = () => {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await communityService.getLeaderboard();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <PageTransition className="max-w-4xl mx-auto p-6 md:p-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Global Rankings</h1>
                <p className="text-gray-500 font-medium text-lg">Top contributors in the Brilliant community</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Rank</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Learner</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Streak</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Level</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Total XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`group hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0 ${idx < 3 ? 'bg-gradient-to-r from-white to-transparent' : ''}`}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            {idx < 3 ? (
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-sm ${idx === 0 ? 'bg-yellow-400 text-yellow-900 rotate-3' :
                                                    idx === 1 ? 'bg-gray-200 text-gray-600 -rotate-2' :
                                                        'bg-orange-300 text-orange-900 rotate-1'
                                                    }`}>
                                                    {idx === 0 ? '👑' : idx + 1}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 font-black w-8 text-center">{idx + 1}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 border-2 border-white shadow-inner flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-black text-gray-400">{user.username.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-base">{user.displayName || user.username}</div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xl">🔥</span>
                                            <span className="font-black text-gray-700">{user.currentStreak}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black border border-blue-100">
                                            Lvl {user.level}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-lg font-black text-gray-900 tabular-nums">
                                            {user.totalXP.toLocaleString()}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageTransition>
    );
};

export default Leaderboard;
