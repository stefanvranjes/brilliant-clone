import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Course } from '../../mockData';
import { aiService, AiRecommendation } from '../../services/ai.service';

interface Node {
    id: string;
    course: Course;
    x: number;
    y: number;
}

interface SkillForestProps {
    courses: Course[];
    completedCourseIds: string[];
}

export const SkillForest: React.FC<SkillForestProps> = ({ courses, completedCourseIds }) => {
    const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const data = await aiService.getRecommendations();
            setRecommendations(data);
        };
        fetchRecommendations();
    }, []);

    // Basic layout algorithm: Group by "depth" in the prerequisite tree
    const graphData = useMemo(() => {
        const nodes: Node[] = [];
        const levels: { [key: number]: string[] } = {};

        // Calculate depths
        const getDepth = (id: string, visited = new Set<string>()): number => {
            if (visited.has(id)) return 0; // Prevent cycles
            visited.add(id);

            const course = courses.find(c => c.id === id);
            if (!course || !course.prerequisites || course.prerequisites.length === 0) return 0;

            return 1 + Math.max(...course.prerequisites.map(p => getDepth(p, visited)));
        };

        courses.forEach(course => {
            const depth = getDepth(course.id);
            if (!levels[depth]) levels[depth] = [];
            levels[depth].push(course.id);
        });

        // Assign positions
        const levelYSpacing = 200;
        const nodeXSpacing = 220;

        Object.keys(levels).forEach((depthStr) => {
            const depth = parseInt(depthStr);
            const levelNodes = levels[depth];
            const totalWidth = (levelNodes.length - 1) * nodeXSpacing;

            levelNodes.forEach((id, index) => {
                const course = courses.find(c => c.id === id)!;
                nodes.push({
                    id,
                    course,
                    x: (index * nodeXSpacing) - (totalWidth / 2) + 400, // Center around 400
                    y: depth * levelYSpacing + 100
                });
            });
        });

        return nodes;
    }, [courses]);

    const connections = useMemo(() => {
        const paths: { from: Node; to: Node }[] = [];
        graphData.forEach(toNode => {
            if (toNode.course.prerequisites) {
                toNode.course.prerequisites.forEach(preId => {
                    const fromNode = graphData.find(n => n.id === preId);
                    if (fromNode) {
                        paths.push({ from: fromNode, to: toNode });
                    }
                });
            }
        });
        return paths;
    }, [graphData]);

    return (
        <div className="relative w-full overflow-x-auto py-12 bg-white rounded-3xl border-2 border-gray-100 shadow-sm min-h-[600px] flex justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '800px' }}>
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#e2e8f0" />
                    </marker>
                </defs>
                {connections.map((conn, i) => {
                    const isUnlocked = completedCourseIds.includes(conn.from.id);
                    return (
                        <motion.line
                            key={i}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            x1={conn.from.x}
                            y1={conn.from.y + 40}
                            x2={conn.to.x}
                            y2={conn.to.y - 40}
                            stroke={isUnlocked ? '#3b82f6' : '#e2e8f0'}
                            strokeWidth="4"
                            strokeDasharray="8 8"
                            markerEnd="url(#arrowhead)"
                        />
                    );
                })}
            </svg>

            <div className="relative z-10" style={{ width: '800px', height: '600px' }}>
                {graphData.map((node) => {
                    const isCompleted = completedCourseIds.includes(node.id);
                    const isLocked = node.course.prerequisites?.some(preId => !completedCourseIds.includes(preId));
                    const recommendation = recommendations.find(r => r.courseId === node.id);
                    const isHovered = hoveredNode === node.id;

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            style={{
                                position: 'absolute',
                                left: node.x - 80,
                                top: node.y - 40,
                                width: '160px'
                            }}
                        >
                            {/* AI Glow Effect */}
                            {recommendation && !isCompleted && !isLocked && (
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-yellow-400 rounded-2xl blur-xl -z-10"
                                />
                            )}

                            <Link
                                to={isLocked ? '#' : `/module/${node.id}`}
                                className={`block p-4 rounded-2xl border-4 text-center transition-all shadow-lg relative ${isCompleted
                                        ? 'bg-blue-600 border-blue-400 text-white'
                                        : isLocked
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed grayscale'
                                            : recommendation
                                                ? 'bg-white border-yellow-400 text-gray-900 shadow-yellow-100'
                                                : 'bg-white border-blue-100 text-gray-900 hover:border-blue-500'
                                    }`}
                            >
                                <div className="text-2xl mb-1">
                                    {isCompleted ? '✓' : isLocked ? '🔒' : recommendation ? '✨' : '⭐'}
                                </div>
                                <div className="text-sm font-black leading-tight">
                                    {node.course.title}
                                </div>
                                {recommendation && !isCompleted && !isLocked && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-[10px] font-black px-2 py-0.5 rounded-full text-yellow-900 uppercase tracking-tighter">
                                        Top Pick
                                    </div>
                                )}
                            </Link>

                            {/* AI Tooltip */}
                            <AnimatePresence>
                                {isHovered && recommendation && !isCompleted && !isLocked && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 z-50 pointer-events-none"
                                    >
                                        <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl relative">
                                            <div className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <span>🤖</span> AI RECOMMENDATION
                                            </div>
                                            <p className="text-xs font-medium leading-relaxed opacity-90">
                                                {recommendation.reason}
                                            </p>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-900" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
