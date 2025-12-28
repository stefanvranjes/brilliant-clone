import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTransition } from '../../components/ui/PageTransition';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/api.service';
import { Problem, Hint } from '../../../../shared/types';

const ProblemEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [problem, setProblem] = useState<Partial<Problem>>({
        title: '',
        description: '',
        difficulty: 'beginner',
        type: 'multiple-choice',
        category: 'Logic',
        tags: [],
        hints: [],
        solution: { answer: '', explanation: '' },
        xpReward: 100,
        estimatedTime: 5,
        options: []
    });

    useEffect(() => {
        if (isEdit && id) {
            const fetchProblem = async () => {
                try {
                    const data = await apiService.getProblem(id);
                    setProblem(data);
                } catch (error) {
                    console.error('Failed to fetch problem:', error);
                    alert('Problem not found');
                    navigate('/admin/problems');
                } finally {
                    setLoading(false);
                }
            };
            fetchProblem();
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEdit && id) {
                await apiService.updateProblem(id, problem);
            } else {
                await apiService.createProblem(problem);
            }
            navigate('/admin/problems');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save problem');
        } finally {
            setSubmitting(false);
        }
    };

    const handleHintChange = (idx: number, content: string) => {
        const newHints = [...(problem.hints || [])];
        newHints[idx] = { ...newHints[idx], content };
        setProblem({ ...problem, hints: newHints });
    };

    const addHint = () => {
        const newHints = [...(problem.hints || [])];
        newHints.push({ id: Math.random().toString(), content: '', order: newHints.length, xpCost: 0 });
        setProblem({ ...problem, hints: newHints });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <PageTransition className="max-w-4xl mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black text-gray-900">
                    {isEdit ? 'Edit Problem' : 'Create New Problem'}
                </h1>
                <Button variant="outline" onClick={() => navigate('/admin/problems')}>Cancel</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                    <h2 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4">Basic Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Title</label>
                            <input
                                required
                                value={problem.title}
                                onChange={e => setProblem({ ...problem, title: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Category</label>
                            <input
                                required
                                value={problem.category}
                                onChange={e => setProblem({ ...problem, category: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={problem.description}
                            onChange={e => setProblem({ ...problem, description: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Difficulty</label>
                            <select
                                value={problem.difficulty}
                                onChange={e => setProblem({ ...problem, difficulty: e.target.value as any })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-bold"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Type</label>
                            <select
                                value={problem.type}
                                onChange={e => setProblem({ ...problem, type: e.target.value as any })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-bold"
                            >
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="numerical">Numerical</option>
                                <option value="interactive">Interactive</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">XP Reward</label>
                            <input
                                type="number"
                                value={problem.xpReward}
                                onChange={e => setProblem({ ...problem, xpReward: Number(e.target.value) })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                    <h2 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4">Solution & Hints</h2>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Correct Answer</label>
                        <input
                            required
                            value={problem.solution?.answer as string}
                            onChange={e => setProblem({
                                ...problem,
                                solution: { ...problem.solution!, answer: e.target.value }
                            })}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Hints</label>
                            <button type="button" onClick={addHint} className="text-blue-600 font-bold text-sm">+ Add Hint</button>
                        </div>
                        {problem.hints?.map((hint: Hint, idx: number) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <span className="mt-4 font-black text-gray-300">#{idx + 1}</span>
                                <textarea
                                    value={hint.content}
                                    onChange={e => handleHintChange(idx, e.target.value)}
                                    placeholder="Hint content..."
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-6 text-xl"
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : 'Save Problem'}
                </Button>
            </form>
        </PageTransition>
    );
};

export default ProblemEditor;
