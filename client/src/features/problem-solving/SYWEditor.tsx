import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface AICritique {
    logicGrade: 'excellent' | 'good' | 'needs-improvement' | 'incorrect';
    feedback: string;
    suggestions: [string];
}

interface SYWEditorProps {
    problemId: string;
    onSubmit: (content: string) => Promise<any>;
}

export const SYWEditor: React.FC<SYWEditorProps> = ({ problemId, onSubmit }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [critique, setCritique] = useState<AICritique | null>(null);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            const result = await onSubmit(content);
            setCritique(result.aiCritique);
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-600" size={18} />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Show Your Work</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400">
                    Explain your reasoning in detail
                </div>
            </div>

            {!critique ? (
                <div className="p-6">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Step 1: I modeled the problem as... 
Step 2: Therefore..."
                        className="w-full h-48 p-4 rounded-2xl border-2 border-gray-100 focus:border-black focus:ring-0 text-gray-700 font-medium leading-relaxed resize-none transition-all outline-none"
                    />
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-[10px] font-bold text-gray-400">
                            Keep it clear and logical.
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all active:scale-95 ${isSubmitting || !content.trim()
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Submit for Critique</span>
                                    <Send size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-purple-50/30"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${critique.logicGrade === 'excellent' ? 'bg-green-100 text-green-600' :
                            critique.logicGrade === 'good' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {critique.logicGrade === 'excellent' ? <CheckCircle /> : <Sparkles />}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-tighter text-lg">AI Logic Tutor</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grade:</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${critique.logicGrade === 'excellent' ? 'text-green-600' :
                                    critique.logicGrade === 'good' ? 'text-blue-600' : 'text-orange-600'
                                    }`}>{critique.logicGrade.replace('-', ' ')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-sm max-w-none mb-6">
                        <p className="text-gray-700 font-medium leading-relaxed italic">
                            "{critique.feedback}"
                        </p>
                    </div>

                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Suggestions for improvement:</span>
                        {critique.suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600 flex-shrink-0">
                                    {i + 1}
                                </div>
                                <span className="text-xs font-bold text-gray-600">{s}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setCritique(null)}
                        className="mt-8 text-xs font-black text-purple-600 hover:underline uppercase tracking-widest"
                    >
                        Try another explanation
                    </button>
                </motion.div>
            )}
        </div>
    );
};
