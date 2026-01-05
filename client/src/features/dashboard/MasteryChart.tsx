import React, { useEffect, useState } from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import { Target, Brain, Info } from 'lucide-react';

interface MasteryData {
    subject: string;
    score: number;
    fullMark: number;
}

const MasteryChart: React.FC = () => {
    const [data, setData] = useState<MasteryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMastery = async () => {
            try {
                const response = await fetch('/api/analytics/mastery', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error('Error fetching mastery stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMastery();
    }, []);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden relative">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Brain className="text-blue-600 w-6 h-6" />
                        Skill Mastery
                    </h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Adaptive Insights</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Target className="w-5 h-5" />
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#f3f4f6" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 800 }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '1rem',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                fontWeight: 800
                            }}
                        />
                        <Radar
                            name="Mastery"
                            dataKey="score"
                            stroke="#2563eb"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-xs text-gray-500">
                <Info className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <p>
                    Your Skill Mastery is calculated using a weighted average of solves, accuracy, and difficulty level. Keep solving to refine your profile!
                </p>
            </div>
        </section>
    );
};

export default MasteryChart;
