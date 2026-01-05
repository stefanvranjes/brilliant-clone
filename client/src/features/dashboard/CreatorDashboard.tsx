import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Send,
    CheckCircle,
    XCircle,
    Plus,
    Edit3,
    Clock,
    ChevronRight,
    AlertCircle,
    Trash2,
    BarChart3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Problem {
    _id: string;
    title: string;
    status: 'draft' | 'pending_review' | 'published' | 'rejected';
    category: string;
    difficulty: string;
    reviewFeedback?: string;
    createdAt: string;
}

const CreatorDashboard: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'review' | 'published'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyProblems();
    }, []);

    const fetchMyProblems = async () => {
        try {
            const response = await fetch('/api/creator/problems', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setProblems(data.data);
            }
        } catch (error) {
            console.error('Error fetching creator problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitForReview = async (id: string) => {
        try {
            const response = await fetch(`/api/creator/problems/${id}/submit`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                fetchMyProblems();
            }
        } catch (error) {
            console.error('Error submitting for review:', error);
        }
    };

    const deleteProblem = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this draft?')) return;
        try {
            const response = await fetch(`/api/creator/problems/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                fetchMyProblems();
            }
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };

    const filteredProblems = problems.filter(p => {
        if (activeTab === 'all') return true;
        if (activeTab === 'draft') return p.status === 'draft' || p.status === 'rejected';
        if (activeTab === 'review') return p.status === 'pending_review';
        if (activeTab === 'published') return p.status === 'published';
        return true;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'pending_review': return <Clock className="w-5 h-5 text-amber-500" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Content Creator Hub</h1>
                    <p className="mt-2 text-lg text-gray-600">Draft, refine, and publish your interactive challenges.</p>
                </div>
                <Link
                    to="/admin/problems/new"
                    className="flex items-center px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                    <Plus className="w-6 h-6 mr-2" />
                    New Problem
                </Link>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Drafts</span>
                    </div>
                    <div className="text-3xl font-black text-gray-900">{problems.filter(p => p.status === 'draft').length}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">In Review</span>
                    </div>
                    <div className="text-3xl font-black text-gray-900">{problems.filter(p => p.status === 'pending_review').length}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Published</span>
                    </div>
                    <div className="text-3xl font-black text-gray-900">{problems.filter(p => p.status === 'published').length}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                {(['all', 'draft', 'review', 'published'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                            : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        {tab === 'review' ? 'In Review' : tab}
                    </button>
                ))}
            </div>

            {filteredProblems.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Edit3 className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">No problems found</h2>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Switch tabs or start creating your first masterpiece to see it here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProblems.map((problem) => (
                            <motion.div
                                key={problem._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-blue-200 transition-all hover:shadow-md"
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`p-4 rounded-2xl ${problem.status === 'published' ? 'bg-green-50' :
                                        problem.status === 'pending_review' ? 'bg-amber-50' :
                                            problem.status === 'rejected' ? 'bg-red-50' : 'bg-gray-50'
                                        }`}>
                                        {getStatusIcon(problem.status)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{problem.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{problem.category}</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                            <span className={`text-sm font-bold capitalize ${problem.difficulty === 'advanced' ? 'text-red-500' :
                                                problem.difficulty === 'intermediate' ? 'text-amber-500' : 'text-green-500'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {problem.status === 'rejected' && problem.reviewFeedback && (
                                    <div className="flex-1 max-w-md bg-red-50 p-4 rounded-2xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700 leading-relaxed italic">
                                            " {problem.reviewFeedback} "
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {(problem.status === 'draft' || problem.status === 'rejected') && (
                                        <>
                                            <Link
                                                to={`/admin/problems/edit/${problem._id}`}
                                                className="flex-1 md:flex-none flex items-center justify-center p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold"
                                            >
                                                <Edit3 className="w-5 h-5 mr-2" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => submitForReview(problem._id)}
                                                className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                                            >
                                                <Send className="w-5 h-5 mr-2" />
                                                Submit
                                            </button>
                                        </>
                                    )}
                                    {problem.status === 'published' && (
                                        <Link
                                            to={`/problem/${problem._id}`}
                                            className="flex-1 md:flex-none flex items-center justify-center p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all font-bold"
                                        >
                                            View Live
                                            <ChevronRight className="w-5 h-5 ml-1" />
                                        </Link>
                                    )}
                                    {problem.status === 'pending_review' && (
                                        <span className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-bold cursor-default">
                                            Under Review
                                        </span>
                                    )}
                                    {(problem.status === 'draft' || problem.status === 'rejected') && (
                                        <button
                                            onClick={() => deleteProblem(problem._id)}
                                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete Draft"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default CreatorDashboard;
