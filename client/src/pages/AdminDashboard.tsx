import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { apiService } from '../services/api.service';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProblems: 0,
        totalCourses: 0,
        recentSolves: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app, this would be a dedicated analytics endpoint
                // For now, we fetch lists and count them or use mock values
                const problems = await apiService.getAllProblems();
                const courses = await apiService.getAllModules();

                setStats({
                    totalUsers: 1250, // Mock for now
                    totalProblems: problems.length,
                    totalCourses: courses.length,
                    recentSolves: 450 // Mock for now
                });
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <PageTransition className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Admin CMS</h1>
                    <p className="text-gray-500 font-medium">Manage platform content and monitor activity</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="primary" size="sm">Create New Problem</Button>
                    <Button variant="outline" size="sm">New Course</Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Learners', value: stats.totalUsers, icon: '👥', color: 'blue' },
                    { label: 'Active Problems', value: stats.totalProblems, icon: '🧩', color: 'purple' },
                    { label: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'green' },
                    { label: 'Solve Count (24h)', value: stats.recentSolves, icon: '⚡', color: 'orange' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{stat.icon}</span>
                            <div>
                                <div className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-2xl font-black text-gray-900">{stat.value.toLocaleString()}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <span>📚</span> Course Catalog
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-500 mb-6">Create chapters, reorder lessons, and manage course categories.</p>
                        <Link to="/admin/courses">
                            <Button variant="outline" className="w-full justify-between group">
                                <span>Manage All Courses</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Button>
                        </Link>
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <span>🧩</span> Problem Bank
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-500 mb-6">Author new challenges with interactive visualizations and multi-step hints.</p>
                        <Link to="/admin/problems">
                            <Button variant="outline" className="w-full justify-between group">
                                <span>Open Problem Editor</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
