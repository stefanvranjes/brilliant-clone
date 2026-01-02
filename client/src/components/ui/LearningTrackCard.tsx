import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
    _id: string;
    title: string;
}

interface Track {
    _id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    difficulty: string;
    courses: Course[];
    badgeId?: string;
}

interface LearningTrackCardProps {
    track: Track;
    progress?: number;
}

export const LearningTrackCard: React.FC<LearningTrackCardProps> = ({ track, progress = 0 }) => {
    return (
        <Link to={`/track/${track._id}`} className="group block">
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl border-2 border-gray-100 p-6 hover:border-black hover:shadow-2xl transition-all h-full flex flex-col"
            >
                <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-black group-hover:text-white transition-colors">
                        {track.icon}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                            {track.category}
                        </span>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                            <div className={`w-1.5 h-1.5 rounded-full ${track.difficulty === 'beginner' ? 'bg-green-500' :
                                    track.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                            <span className="text-[10px] font-bold text-gray-500 capitalize">{track.difficulty}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-black leading-tight">
                        {track.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium">
                        {track.description}
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                            <Layers size={14} />
                            <span>{track.courses.length} Courses</span>
                        </div>
                        <span className="text-xs font-black text-gray-900">{progress}%</span>
                    </div>

                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-black rounded-full"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-black text-yellow-600 uppercase tracking-tighter bg-yellow-50 px-2 py-1 rounded">
                            <Award size={12} />
                            Special Badge
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all transform group-hover:translate-x-1">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};
