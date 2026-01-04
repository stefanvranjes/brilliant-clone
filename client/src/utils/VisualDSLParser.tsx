import React from 'react';
import { BarChart3, LineChart, Cpu, Info } from 'lucide-react';

interface DSLTag {
    type: 'chart' | 'logic' | 'info';
    props: Record<string, string>;
}

export const parseDSL = (text: string): (string | DSLTag)[] => {
    const parts: (string | DSLTag)[] = [];
    const regex = /\[v-(\w+)\s+([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before the tag
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const tagType = match[1] as any;
        const propsString = match[2];
        const props: Record<string, string> = {};

        // Match prop="value"
        const propRegex = /(\w+)="([^"]+)"/g;
        let propMatch;
        while ((propMatch = propRegex.exec(propsString)) !== null) {
            props[propMatch[1]] = propMatch[2];
        }

        parts.push({ type: tagType, props });
        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
};

export const DSLRenderer: React.FC<{ tag: DSLTag }> = ({ tag }) => {
    switch (tag.type) {
        case 'chart':
            return (
                <div className="my-8 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-6">
                        {tag.props.chartType === 'line' ? <LineChart className="w-6 h-6 text-blue-500" /> : <BarChart3 className="w-6 h-6 text-blue-500" />}
                        <h4 className="font-bold text-gray-700">{tag.props.title || 'Dynamic Data Visualization'}</h4>
                    </div>
                    <div className="w-full h-48 bg-white/50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                        <p className="text-sm font-mono text-gray-400">
                            [ Rendering {tag.props.chartType || 'bar'} chart with data: {tag.props.data} ]
                        </p>
                    </div>
                    {tag.props.caption && (
                        <p className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-widest">{tag.props.caption}</p>
                    )}
                </div>
            );
        case 'logic':
            return (
                <div className="my-8 p-8 bg-slate-900 rounded-3xl text-white flex flex-col items-center shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Cpu className="w-6 h-6 text-blue-400" />
                        <h4 className="font-bold text-blue-100">{tag.props.gate || 'Logic Gate Simulation'}</h4>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center font-bold text-blue-400">A</div>
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center font-bold text-blue-400">B</div>
                        </div>
                        <div className="w-20 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black">
                            {tag.props.gate?.toUpperCase() || 'AND'}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center font-bold text-green-400">Q</div>
                    </div>
                    <p className="mt-6 text-xs text-blue-300/50 uppercase tracking-widest font-bold">Interactive {tag.props.gate} Simulator</p>
                </div>
            );
        case 'info':
            return (
                <div className="my-6 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl flex gap-4">
                    <Info className="w-6 h-6 text-blue-500 shrink-0" />
                    <p className="text-blue-800 text-sm leading-relaxed font-medium">
                        {tag.props.content}
                    </p>
                </div>
            );
        default:
            return null;
    }
};
