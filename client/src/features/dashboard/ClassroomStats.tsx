import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Award,
    Zap,
    CheckCircle,
    ChevronLeft,
    Download,
    Trash2,
    Plus,
    Calendar,
    Target
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

interface Student {
    _id: string;
    displayName: string;
    username: string;
    totalXP: number;
    level: number;
    problemsSolved: number;
    history: any[];
}

interface ClassroomData {
    classroom: {
        name: string;
        inviteCode: string;
    };
    aggregate: {
        totalStudents: number;
        averageXP: number;
        totalProblemsSolved: number;
        averageProblems: number;
    };
    students: Student[];
}

const ClassroomStats: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<ClassroomData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'roster' | 'assignments'>('roster');

    useEffect(() => {
        fetchClassroomStats();
    }, [id]);

    const fetchClassroomStats = async () => {
        try {
            const response = await fetch(`/api/classrooms/${id}/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Error fetching classroom stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data) return <div className="text-center py-20">Classroom not found</div>;

    const { classroom, aggregate, students } = data;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link
                to="/teacher-dashboard"
                className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{classroom.name}</h1>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                            {classroom.inviteCode}
                        </span>
                    </div>
                    <p className="text-lg text-gray-500 font-medium">Performance tracking and classroom management</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="w-5 h-5 mr-2" />
                        Export Data
                    </button>
                    <button className="flex items-center px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    label="Total Students"
                    value={aggregate.totalStudents}
                    icon={<Users className="w-6 h-6" />}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    label="Average XP"
                    value={Math.round(aggregate.averageXP)}
                    icon={<Zap className="w-6 h-6" />}
                    color="bg-amber-50 text-amber-600"
                />
                <StatCard
                    label="Total Solved"
                    value={aggregate.totalProblemsSolved}
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    label="Avg. Problems"
                    value={aggregate.averageProblems}
                    icon={<Award className="w-6 h-6" />}
                    color="bg-purple-50 text-purple-600"
                />
            </div>

            {/* Main Content Sections */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('roster')}
                        className={`px-8 py-6 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'roster' ? 'text-black border-b-4 border-black' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Student Roster
                    </button>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`px-8 py-6 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'assignments' ? 'text-black border-b-4 border-black' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Assignments
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'roster' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left py-4 border-b border-gray-50">
                                        <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Student Name</th>
                                        <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Level</th>
                                        <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Total XP</th>
                                        <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Problems Solved</th>
                                        <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {students.map((student) => (
                                        <tr key={student._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 font-black text-gray-900">{student.displayName || student.username}</td>
                                            <td className="py-5">
                                                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg font-bold">Lvl {student.level}</span>
                                            </td>
                                            <td className="py-5 font-bold text-gray-600">{student.totalXP.toLocaleString()}</td>
                                            <td className="py-5 font-bold text-gray-600">{student.problemsSolved}</td>
                                            <td className="py-5 min-w-[150px]">
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${Math.min(100, (student.totalXP / 2000) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Target className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-800">Assignment Management</h3>
                            <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
                                Create and track assignments for this classroom to guide your students' learning.
                            </p>
                            <button className="flex items-center mx-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl">
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Assignment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }: any) => (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6`}>
            {icon}
        </div>
        <div>
            <div className="text-3xl font-black text-gray-900 leading-none mb-2">{value}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</div>
        </div>
    </div>
);

export default ClassroomStats;
