import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Module } from '../../mockData';

interface ModuleCardProps {
    module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
            <div className="p-8 pb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-gray-100">
                    {module.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {module.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {module.problemIds.length} Lessons
                    </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{module.title}</h3>
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
            </div>
        </motion.div>
    );
};
