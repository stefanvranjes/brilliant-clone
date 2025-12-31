import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Course } from '../../mockData';

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

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                position: 'absolute',
                                left: node.x - 80,
                                top: node.y - 40,
                                width: '160px'
                            }}
                        >
                            <Link
                                to={isLocked ? '#' : `/module/${node.id}`}
                                className={`block p-4 rounded-2xl border-4 text-center transition-all shadow-lg ${isCompleted
                                        ? 'bg-blue-600 border-blue-400 text-white'
                                        : isLocked
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed grayscale'
                                            : 'bg-white border-blue-100 text-gray-900 hover:border-blue-500'
                                    }`}
                            >
                                <div className="text-2xl mb-1">
                                    {isCompleted ? '✓' : isLocked ? '🔒' : '⭐'}
                                </div>
                                <div className="text-sm font-black leading-tight">
                                    {node.course.title}
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
