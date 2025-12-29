import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import communityService, { PublicProfile } from '../services/community.service';
import { PageTransition } from '../components/ui/PageTransition';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            try {
                const data = await communityService.getPublicProfile(userId);
                setProfile(data);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('User not found or profile is private.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) return <LoadingSpinner />;
    if (error || !profile) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <Button onClick={() => navigate('/leaderboard')}>Back to Leaderboard</Button>
            </div>
        );
    }

    return (
        <PageTransition className="max-w-4xl mx-auto p-6 md:p-10">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                <div className="px-8 pb-8 flex flex-col items-center -mt-16 sm:flex-row sm:items-end sm:gap-6">
                    <div className="w-32 h-32 rounded-3xl bg-white p-1 border-4 border-white shadow-xl flex-shrink-0">
                        <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-gray-300">{profile.username.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-center sm:text-left grow">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profile.displayName || profile.username}</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">@{profile.username}</p>
                    </div>
                    <div className="mt-6 sm:mt-0 flex gap-3">
                        <Button variant="outline" size="sm" onClick={() => navigate('/leaderboard')}>View Rankings</Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total XP', value: profile.totalXP.toLocaleString(), icon: '⭐', color: 'bg-yellow-50 text-yellow-600' },
                    { label: 'Current Streak', value: `${profile.currentStreak} Days`, icon: '🔥', color: 'bg-orange-50 text-orange-600' },
                    { label: 'Learner Level', value: `Level ${profile.level}`, icon: '🎓', color: 'bg-blue-50 text-blue-600' },
                    { label: 'Solved', value: profile.problemsSolved, icon: '✅', color: 'bg-green-50 text-green-600' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center"
                    >
                        <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl mx-auto mb-3 shadow-inner`}>
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-gray-900 mb-4">About</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">📅</span>
                                <div className="text-sm">
                                    <div className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Member Since</div>
                                    <div className="text-gray-700 font-bold">{new Date(profile.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">🏆</span>
                                <div className="text-sm">
                                    <div className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Longest Streak</div>
                                    <div className="text-gray-700 font-bold">{profile.longestStreak} Days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-dashed border-gray-200">
                            🔒
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Detailed Activity is Private</h3>
                        <p className="text-gray-500 font-medium">Detailed problem history and progress charts are only visible to the user.</p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default UserProfilePage;
