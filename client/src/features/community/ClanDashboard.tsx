import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Shield,
    TrendingUp,
    Plus,
    Search,
    ChevronRight,
    Crown,
    Zap,
    Target,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Clan {
    _id: string;
    name: string;
    description: string;
    insignia: string;
    leader: {
        _id: string;
        displayName: string;
        username: string;
    };
    members: any[];
    totalXP: number;
    weeklyGoal: number;
    privacy: string;
}

const ClanDashboard: React.FC = () => {
    const { user } = useAuth();
    const [clans, setClans] = useState<Clan[]>([]);
    const [myClan, setMyClan] = useState<Clan | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'browse' | 'my-clan'>('browse');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchClans();
    }, []);

    const fetchClans = async () => {
        try {
            const response = await fetch('/api/clans', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            if (data.success) {
                setClans(data.data);

                // Check if user is in any of these clans
                const found = data.data.find((c: Clan) =>
                    c.members.some(m => (m._id || m) === user?._id)
                );
                if (found) {
                    setMyClan(found);
                    setActiveTab('my-clan');
                }
            }
        } catch (error) {
            console.error('Error fetching clans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClan = async (id: string) => {
        try {
            const response = await fetch(`/api/clans/${id}/join`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) fetchClans();
        } catch (error) {
            console.error('Error joining clan:', error);
        }
    };

    const handleLeaveClan = async (id: string) => {
        try {
            const response = await fetch(`/api/clans/${id}/leave`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                setMyClan(null);
                setActiveTab('browse');
                fetchClans();
            }
        } catch (error) {
            console.error('Error leaving clan:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Shield className="w-10 h-10 text-blue-600" />
                        Clan Hub
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">Join a learning squad and climb the global leaderboards.</p>
                </div>
                {!myClan && (
                    <button className="flex items-center px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl">
                        <Plus className="w-6 h-6 mr-2" />
                        Create Clan
                    </button>
                )}
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-10 bg-gray-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('browse')}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${activeTab === 'browse' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Browse Clans
                </button>
                {myClan && (
                    <button
                        onClick={() => setActiveTab('my-clan')}
                        className={`px-8 py-3 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${activeTab === 'my-clan' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        My Squad
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'browse' ? (
                    <motion.div
                        key="browse"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="relative mb-8 max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for clans by name or goal..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clans.map((clan) => (
                                <ClanCard
                                    key={clan._id}
                                    clan={clan}
                                    isMember={myClan?._id === clan._id}
                                    onJoin={() => handleJoinClan(clan._id)}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    myClan && (
                        <motion.div
                            key="my-clan"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100"
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                                <div className="flex-1">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-blue-100">
                                            {myClan.insignia}
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{myClan.name}</h2>
                                            <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-sm">Founded by {myClan.leader.displayName}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                                        <div className="bg-gray-50 p-6 rounded-3xl">
                                            <TrendingUp className="w-6 h-6 text-blue-600 mb-3" />
                                            <div className="text-2xl font-black text-gray-900">{myClan.totalXP.toLocaleString()}</div>
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Lifetime XP</div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-3xl">
                                            <Users className="w-6 h-6 text-purple-600 mb-3" />
                                            <div className="text-2xl font-black text-gray-900">{myClan.members.length}</div>
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Squad Members</div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-3xl">
                                            <Target className="w-6 h-6 text-green-600 mb-3" />
                                            <div className="text-2xl font-black text-gray-900">Rank #12</div>
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Ranking</div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 mb-6">Top Contributors</h3>
                                    <div className="space-y-4">
                                        {myClan.members.slice(0, 5).map((member, idx) => (
                                            <div key={member._id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-black text-gray-300 w-5">{idx + 1}</span>
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black">
                                                        {member.displayName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                                            {member.displayName}
                                                            {member._id === myClan.leader._id && <Crown className="w-3 h-3 text-amber-500" />}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Level {member.level}</div>
                                                    </div>
                                                </div>
                                                <div className="font-black text-blue-600">{member.totalXP.toLocaleString()} XP</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full lg:w-80 space-y-6">
                                    <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl">
                                        <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-yellow-500" />
                                            Weekly Goal
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>Progress</span>
                                                <span>65%</span>
                                            </div>
                                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-500 w-[65%]" />
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed pt-2">
                                                Complete tasks as a team to unlock the weekly bonus chest!
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleLeaveClan(myClan._id)}
                                        className="w-full flex items-center justify-center p-4 text-red-500 border-2 border-red-500/10 hover:bg-red-50 rounded-2xl font-bold transition-all"
                                    >
                                        <LogOut className="w-5 h-5 mr-2" />
                                        Leave Clan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

const ClanCard = ({ clan, isMember, onJoin }: { clan: Clan, isMember: boolean, onJoin: () => void }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group"
    >
        <div>
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    {clan.insignia}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{clan.members.length} Members</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-1">{clan.privacy}</span>
                </div>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{clan.name}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">{clan.description}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Squad XP</span>
                <span className="font-black text-gray-900">{clan.totalXP.toLocaleString()}</span>
            </div>
            {isMember ? (
                <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-sm">Joined</span>
            ) : (
                <button
                    onClick={onJoin}
                    className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
                >
                    Join Squad
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            )}
        </div>
    </motion.div>
);

export default ClanDashboard;
