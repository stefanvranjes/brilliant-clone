import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/ui/PageTransition';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/api.service';
import { Link } from 'react-router-dom';
import { Course } from '../../../../shared/types';

const CourseManager: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await apiService.getAllModules();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <PageTransition className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Course Catalog</h1>
                    <p className="text-gray-500">Manage curriculum hierarchy and enrollment</p>
                </div>
                <Button variant="primary">Create New Course</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <motion.div
                        key={course.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">{course.title}</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{course.category}</p>
                            </div>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
                                {course.chapters.length} Chapters
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2">{course.description}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">Edit Course</Button>
                            <Button variant="outline" size="sm" className="flex-1">Manage Chapters</Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </PageTransition>
    );
};

export default CourseManager;
