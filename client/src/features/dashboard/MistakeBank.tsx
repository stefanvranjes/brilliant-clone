import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCw, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { apiService } from '../../services/api.service';
import { Link } from 'react-router-dom';

interface Mistake {
    problemId: {
        _id: string;
        title: string;
        difficulty: string;
        category: string;
    };
    retryCount: number;
    nextRetryDate: string;
}

export const MistakeBank: React.FC = () => {
    const [mistakes, setMistakes] = useState<Mistake[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMistakes = async () => {
            try {
                const data = await apiService.getMistakeBank();
                setMistakes(data);
            } catch (error) {
                console.error('Error fetching mistake bank:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMistakes();
    }, []);

    const isReadyForRetry = (date: string) => {
        return new Date(date) <= new Date();
    };

    if (loading) return null;

    const readyMistakes = mistakes.filter(m => isReadyForRetry(m.nextRetryDate));
    const upcomingMistakes = mistakes.filter(m => !isReadyForRetry(m.nextRetryDate));

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-red-50/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 leading-tight">Mistake Bank</h2>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Master your weak areas</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-gray-900">{readyMistakes.length}</span>
                    <span className="text-xs font-bold text-gray-400 block uppercase">Ready to Review</span>
                </div>
            </div>

            <div className="p-6">
                {mistakes.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <BookOpen size={32} />
                        </div>
                        <p className="text-gray-500 font-medium italic">Your mistake bank is empty. Great job!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {readyMistakes.map((mistake) => (
                            <Link
                                key={mistake.problemId._id}
                                to={`/problem/${mistake.problemId._id}`}
                                className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-red-500 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                        <RefreshCw size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{mistake.problemId.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase text-gray-400">{mistake.problemId.category}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="text-[10px] font-black uppercase text-red-500">Failed {mistake.retryCount} times</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}

                        {upcomingMistakes.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Locked (Next Review Following Soon)</h4>
                                <div className="space-y-2">
                                    {upcomingMistakes.map((mistake) => (
                                        <div key={mistake.problemId._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl opacity-60">
                                            <div className="flex items-center gap-3">
                                                <Clock size={14} className="text-gray-400" />
                                                <span className="text-xs font-bold text-gray-600">{mistake.problemId.title}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 italic">
                                                Available in {Math.ceil((new Date(mistake.nextRetryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))}d
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
