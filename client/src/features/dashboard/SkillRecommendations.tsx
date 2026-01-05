import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecommendedProblem {
    _id: string;
    title: string;
    category: string;
    difficulty: string;
    xpReward: number;
}

const SkillRecommendations: React.FC = () => {
    const [recommendations, setRecommendations] = useState<RecommendedProblem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('/api/analytics/recommendations', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const result = await response.json();
                if (result.success) {
                    setRecommendations(result.data);
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return null;
    if (recommendations.length === 0) return null;

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-amber-500 w-6 h-6" />
                        Recommended for You
                    </h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Based on your growth areas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((problem, idx) => (
                    <motion.div
                        key={problem._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Zap className="w-5 h-5 text-amber-500" />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {problem.category}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                {problem.difficulty}
                            </span>
                        </div>

                        <h3 className="text-lg font-black text-gray-800 mb-4 line-clamp-2 leading-tight">
                            {problem.title}
                        </h3>

                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm font-bold text-gray-400">+{problem.xpReward} XP</span>
                            <Link
                                to={`/problem/${problem._id}`}
                                className="flex items-center gap-1 text-sm font-black text-blue-600 hover:gap-2 transition-all"
                            >
                                Solve Now <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SkillRecommendations;
