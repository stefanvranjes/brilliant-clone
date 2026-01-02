import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Shield, Crown, Medal } from 'lucide-react';
import { apiService } from '../../services/api.service';

interface Competitor {
    displayName: string;
    weeklyXP: number;
}

interface LeagueStatus {
    user: {
        currentLeague: string;
        weeklyXP: number;
    };
    competitors: Competitor[];
}

export const LeagueProgress = () => {
    const [status, setStatus] = useState<LeagueStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // We'll need to add this to apiService
                const res = await fetch('http://localhost:5000/api/leagues/status', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await res.json();
                setStatus(data);
            } catch (err) {
                console.error('Failed to fetch league status:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const leagueConfig: any = {
        'Bronze': { color: 'text-orange-600', bg: 'bg-orange-50', icon: <Medal />, next: 'Silver', threshold: 2000 },
        'Silver': { color: 'text-gray-400', bg: 'bg-gray-50', icon: <Shield />, next: 'Gold', threshold: 5000 },
        'Gold': { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <Trophy />, next: 'Diamond', threshold: 10000 },
        'Diamond': { color: 'text-blue-500', bg: 'bg-blue-50', icon: <Sparkles />, next: 'Master', threshold: 20000 },
        'Master': { color: 'text-purple-600', bg: 'bg-purple-50', icon: <Crown />, next: 'Legend', threshold: 50000 }
    };

    if (loading || !status) return <div className="animate-pulse h-64 bg-gray-100 rounded-3xl" />;

    const current = leagueConfig[status.user.currentLeague] || leagueConfig['Bronze'];
    const progress = Math.min((status.user.weeklyXP / current.threshold) * 100, 100);

    return (
        <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden">
            <div className="p-8 pb-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${current.bg} ${current.color} flex items-center justify-center text-3xl shadow-lg border border-white`}>
                            {current.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                {status.user.currentLeague} League
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                <TrendingUp size={14} />
                                <span>Weekly Ranking</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-gray-900">{status.user.weeklyXP}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weekly XP</div>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-gray-400">Progress to {current.next}</span>
                        <span className="text-gray-900">{status.user.weeklyXP} / {current.threshold}</span>
                    </div>
                    <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full rounded-full ${current.color.replace('text', 'bg')}`}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">League Standings</span>
                    {status.competitors.slice(0, 5).map((comp, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${comp.displayName === 'Stefan' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50/50 border-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-gray-300 w-4">{i + 1}</span>
                                <span className="text-sm font-bold text-gray-700">{comp.displayName}</span>
                            </div>
                            <span className="text-sm font-black text-gray-900">{comp.weeklyXP} XP</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 p-4 text-center">
                <button className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest transition-colors">
                    View Full Standings
                </button>
            </div>
        </div>
    );
};

// Add Sparkles icon missing in imports
const Sparkles = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
);
