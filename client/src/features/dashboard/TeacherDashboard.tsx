import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Award, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';

interface Classroom {
    _id: string;
    name: string;
    description: string;
    inviteCode: string;
    students: any[];
    isActive: boolean;
}

const TeacherDashboard: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newClassroomName, setNewClassroomName] = useState('');

    useEffect(() => {
        fetchMyClassrooms();
    }, []);

    const fetchMyClassrooms = async () => {
        try {
            const response = await fetch('/api/classrooms', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setClassrooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const createClassroom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/classrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: newClassroomName })
            });
            const data = await response.json();
            if (data.success) {
                setClassrooms([...classrooms, data.data]);
                setShowCreateModal(false);
                setNewClassroomName('');
            }
        } catch (error) {
            console.error('Error creating classroom:', error);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
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
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">Teacher Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">Manage your classrooms and track student progress.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Classroom
                </button>
            </header>

            {classrooms.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">No classrooms yet</h2>
                    <p className="text-gray-500 mt-2">Create your first classroom to start inviting students!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {classrooms.map((classroom) => (
                        <motion.div
                            key={classroom._id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <span className="px-4 py-1.5 bg-green-50 text-green-600 text-sm font-bold rounded-full">
                                        {classroom.students.length} Students
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{classroom.name}</h3>
                                <p className="text-gray-500 line-clamp-2 mb-6">{classroom.description || 'No description provided.'}</p>

                                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Invite Code</span>
                                        <span className="text-xl font-mono font-bold text-blue-600">{classroom.inviteCode}</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(classroom.inviteCode)}
                                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Copy invite code"
                                    >
                                        {copiedCode === classroom.inviteCode ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button className="w-full flex items-center justify-center p-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all group">
                                    View Detailed Stats
                                    <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Modal (Minimalist) */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">New Classroom</h2>
                        <form onSubmit={createClassroom}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Classroom Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newClassroomName}
                                    onChange={(e) => setNewClassroomName(e.target.value)}
                                    placeholder="e.g. Creative Problem Solving 101"
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-4 text-gray-600 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
