import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Module } from '../../mockData';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Target, Download, CloudOff, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { offlineService } from '../../services/offlineService';
import { apiService } from '../../services/api.service';

interface ModuleCardProps {
    module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [classrooms, setClassrooms] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [assigning, setAssigning] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [isDownloaded, setIsDownloaded] = React.useState(false);
    const [downloading, setDownloading] = React.useState(false);

    React.useEffect(() => {
        checkOfflineStatus();
    }, [module.id]);

    const checkOfflineStatus = async () => {
        const content = await offlineService.getContent(module.id);
        setIsDownloaded(!!content);
    };

    const handleDownload = async () => {
        if (isDownloaded) {
            await offlineService.removeContent(module.id);
            for (const pid of (module.problemIds || [])) {
                await offlineService.removeContent(pid);
            }
            setIsDownloaded(false);
            return;
        }

        setDownloading(true);
        try {
            await offlineService.saveContent(module.id, module);
            for (const pid of (module.problemIds || [])) {
                const problemData = await apiService.getProblem(pid);
                if (problemData) {
                    await offlineService.saveContent(pid, problemData);
                }
            }
            setIsDownloaded(true);
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    const fetchClassrooms = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/classrooms', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) setClassrooms(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (classroomId: string) => {
        setAssigning(true);
        try {
            const res = await fetch(`/api/classrooms/${classroomId}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    problemId: module.id, // Using course ID here, controller should handle if it's course or problem
                    title: `Master ${module.title}`
                })
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccess(false);
                }, 2000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAssigning(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        fetchClassrooms();
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
            <div className="p-8 pb-4">
                <div className="relative w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-gray-100">
                    {module.icon}
                    {isDownloaded && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                            <CheckCircle2 className="w-3 h-3" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {module.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {module.problemIds?.length || module.chapters?.reduce((acc: number, ch: any) => acc + (ch.problems?.length || 0), 0) || 0} Lessons
                    </span>
                </div>
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight flex-1">{module.title}</h3>
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className={`p-2 rounded-lg transition-all ${isDownloaded ? 'text-blue-600 bg-blue-50' : 'text-gray-300 hover:bg-gray-50 hover:text-gray-400'
                            }`}
                        title={isDownloaded ? 'Remove from Offline' : 'Download for Offline'}
                    >
                        {downloading ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                        ) : isDownloaded ? (
                            <CloudOff className="w-5 h-5" />
                        ) : (
                            <Download className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                    {module.description}
                </p>
            </div>

            <div className="mt-auto p-8 pt-0">
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-6">
                    <div className="bg-green-500 h-full w-0 transition-all duration-1000" />
                </div>

                <Link
                    to={`/module/${module.id}`}
                    className="block w-full text-center py-3.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 active:scale-95 duration-200"
                >
                    Explore Course
                </Link>

                {user?.role === 'teacher' && (
                    <button
                        onClick={openModal}
                        className="mt-3 w-full flex items-center justify-center py-3 border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-500 hover:text-blue-600 rounded-xl font-bold text-xs transition-all uppercase tracking-widest"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Assign to Class
                    </button>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Assign Course"
                >
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">Successfully Assigned!</h4>
                            <p className="text-gray-500 mt-1">Your students will see this in their dashboard.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 mb-6">Which classroom should receive this assignment?</p>
                            {loading ? (
                                <div className="text-center py-4">Loading your classes...</div>
                            ) : classrooms.length === 0 ? (
                                <div className="text-center py-4 text-gray-400">No classrooms found. Create one in the Teacher Dashboard!</div>
                            ) : (
                                classrooms.map(c => (
                                    <button
                                        key={c._id}
                                        onClick={() => handleAssign(c._id)}
                                        disabled={assigning}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all text-left group"
                                    >
                                        <div>
                                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{c.name}</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{c.students.length} Students</div>
                                        </div>
                                        <PlusCircle className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </motion.div>
    );
};
