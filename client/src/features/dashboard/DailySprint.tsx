import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDailySprint } from '../../hooks/useDailySprint';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const DailySprint = () => {
    const { sprint, loading, error } = useDailySprint();

    if (loading) return <div className="h-48 flex items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-100"><LoadingSpinner /></div>;
    if (error || sprint.length === 0) return null;

    return (
        <section className="mb-12">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Your Daily Sprint <span className="text-sm bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">AI Guided</span>
                    </h2>
                    <p className="text-gray-500 font-medium">A personalized path just for you.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sprint.map((problem, index) => (
                    <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                    >
                        <Link to={`/problem/${problem.id}`}>
                            <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-black transition-all group-hover:shadow-xl group-hover:shadow-black/5 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {problem.difficulty}
                                    </div>
                                </div>
                                <h3 className="font-black text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {problem.title}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4 grow">
                                    {problem.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-auto pt-4 border-t border-gray-50">
                                    <span>⚡ {problem.xpReward} XP</span>
                                    <span>•</span>
                                    <span>{problem.estimatedTime} min</span>
                                </div>
                            </div>
                        </Link>
                        {index < sprint.length - 1 && (
                            <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-200">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5 19 10m0 0-5.5 5.5M19 10H5" />
                                </svg>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
