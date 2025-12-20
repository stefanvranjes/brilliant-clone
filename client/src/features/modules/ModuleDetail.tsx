import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api.service';
import { Module, Problem } from '../../mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ChevronLeft, Play, CheckCircle2 } from 'lucide-react';

const ModuleDetail = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const [module, setModule] = useState<Module | null>(null);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!moduleId) return;
            try {
                const [modData, probData] = await Promise.all([
                    apiService.getModuleById(moduleId),
                    apiService.getProblemsByModule(moduleId)
                ]);
                setModule(modData);
                setProblems(probData);
            } catch (error) {
                console.error('Error fetching module details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [moduleId]);

    if (loading) return <LoadingSpinner />;
    if (!module) return <div className="p-8 text-center text-red-500">Module not found</div>;

    return (
        <PageTransition className="max-w-4xl mx-auto p-6">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-black font-semibold mb-8 transition-colors group">
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Learning Path
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-xl border border-gray-100 shrink-0">
                    {module.icon}
                </div>
                <div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2 block">
                        {module.category} Course
                    </span>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{module.title}</h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                        {module.description}
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Curriculum</h2>
                {problems.map((prob, index) => (
                    <Link
                        key={prob.id}
                        to={`/problem/${prob.id}`}
                        className="group block p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-black text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{prob.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${prob.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                            prob.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {prob.difficulty}
                                        </span>
                                        <span className="text-xs font-bold text-blue-600">+{prob.xpReward} XP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all transform group-hover:scale-110">
                                <Play className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </PageTransition>
    );
};

export default ModuleDetail;
