import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/ui/PageTransition';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/api.service';
import { Link } from 'react-router-dom';
import { Problem } from '../../../../shared/types';

const ProblemList: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const data = await apiService.getAllProblems();
                setProblems(data);
            } catch (error) {
                console.error('Failed to fetch problems:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return;
        try {
            await apiService.deleteProblem(id);
            setProblems(problems.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete problem');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <PageTransition className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Problem Bank</h1>
                    <p className="text-gray-500">Manage all interactive challenges</p>
                </div>
                <Link to="/admin/problems/new">
                    <Button variant="primary">Create New Problem</Button>
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Title</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Difficulty</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {problems.map((problem) => (
                            <tr key={problem.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{problem.title}</td>
                                <td className="px-6 py-4 text-gray-500">{problem.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${problem.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                        problem.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                                            'bg-purple-100 text-purple-700'
                                        }`}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{problem.type}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link to={`/admin/problems/edit/${problem.id}`}>
                                        <button className="text-blue-600 font-bold hover:underline">Edit</button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(problem.id)}
                                        className="text-red-600 font-bold hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageTransition>
    );
};

export default ProblemList;
