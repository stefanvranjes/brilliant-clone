import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, Clock, ChevronRight, Search, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Assignment {
    problemId: {
        _id: string;
        title: string;
        category: string;
        difficulty: string;
    };
    title: string;
    dueDate: string;
    assignedAt: string;
}

interface Classroom {
    _id: string;
    name: string;
    description: string;
    teacher: {
        displayName: string;
        username: string;
    };
    inviteCode: string;
    assignments: Assignment[];
}

const MyClassrooms: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteCode, setInviteCode] = useState('');
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchJoinedClassrooms();
    }, []);

    const fetchJoinedClassrooms = async () => {
        try {
            const response = await fetch('/api/classrooms/my-joined', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setClassrooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching joined classrooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClassroom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode) return;

        setJoining(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/classrooms/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Successfully joined ${data.data.name}!`);
                setInviteCode('');
                fetchJoinedClassrooms();
            } else {
                setError(data.message || 'Failed to join classroom');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Classrooms</h1>
                <p className="mt-2 text-lg text-gray-600">Learning is better together. Manage your joined classes and assignments.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: List of Classrooms */}
                <div className="lg:col-span-2 space-y-8">
                    {classrooms.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 shadow-sm">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-800">No joined classrooms</h2>
                            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                You haven't joined any classrooms yet. Use an invite code from your teacher to get started.
                            </p>
                        </div>
                    ) : (
                        classrooms.map((classroom) => (
                            <motion.div
                                key={classroom._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:border-blue-100 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {classroom.name}
                                        </h3>
                                        <p className="text-gray-500 font-bold mt-1">Teacher: {classroom.teacher.displayName}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                        <Users className="w-6 h-6" />
                                    </div>
                                </div>

                                {classroom.assignments.length > 0 && (
                                    <div className="mt-8">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Active Assignments</h4>
                                        <div className="space-y-3">
                                            {classroom.assignments.map((assignment, index) => (
                                                <Link
                                                    key={index}
                                                    to={`/problem/${assignment.problemId._id}`}
                                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100 group/item"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                                                            <Clock className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">
                                                                {assignment.title || assignment.problemId.title}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-0.5">
                                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover/item:text-blue-400 transform group-hover/item:translate-x-1 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Right Column: Join Sidebar */}
                <div className="space-y-8">
                    <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                            <PlusCircle className="text-blue-400 w-6 h-6" />
                            Join a Classroom
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Enter the 8-character code shared by your teacher to join their class and access exclusive assignments.
                        </p>

                        <form onSubmit={handleJoinClassroom} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Code (e.g. A1B2C3D4)"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    className="w-full bg-white/10 border-2 border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-center tracking-widest text-lg uppercase"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={joining || !inviteCode}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-900/20"
                            >
                                {joining ? 'Joining...' : 'Join Class'}
                            </button>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-bold">{error}</p>
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-3 text-green-400"
                                >
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-bold">{success}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-bold">Total Classes</span>
                                <span className="text-2xl font-black text-gray-900">{classrooms.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-bold">Active Tasks</span>
                                <span className="text-2xl font-black text-blue-600">
                                    {classrooms.reduce((acc, c) => acc + c.assignments.length, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyClassrooms;
