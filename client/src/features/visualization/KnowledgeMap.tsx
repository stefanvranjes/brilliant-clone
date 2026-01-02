import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface Node extends d3.SimulationNodeDatum {
    id: string;
    title: string;
    category: string;
    status: 'locked' | 'available' | 'completed';
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string;
    target: string;
}

interface KnowledgeMapProps {
    data: {
        nodes: Node[];
        links: Link[];
    };
    onNodeClick?: (nodeId: string) => void;
}

export const KnowledgeMap: React.FC<KnowledgeMapProps> = ({ data, onNodeClick }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data.nodes.length) return;

        const width = 800;
        const height = 500;

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('width', '100%')
            .attr('height', '100%');

        svg.selectAll('*').remove();

        const simulation = d3.forceSimulation<Node>(data.nodes)
            .force('link', d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(50));

        const container = svg.append('g');

        const gLinks = container.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(data.links)
            .enter().append('line')
            .attr('stroke', '#E5E7EB')
            .attr('stroke-width', 2);

        const nodes = container.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(data.nodes)
            .enter().append('g')
            .style('cursor', 'pointer')
            .on('click', (event, d) => onNodeClick?.(d.id));

        // Background circle
        nodes.append('circle')
            .attr('r', 25)
            .attr('fill', d => {
                const colors: Record<string, string> = {
                    'Computer Science': '#10B981',
                    'Mathematics': '#3B82F6',
                    'Logic': '#F59E0B'
                };
                return colors[d.category] || '#6B7280';
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))');

        // Status indicator
        nodes.append('circle')
            .attr('r', 6)
            .attr('cx', 18)
            .attr('cy', -18)
            .attr('fill', d => d.status === 'completed' ? '#10B981' : d.status === 'available' ? '#3B82F6' : '#D1D5DB')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Labels
        nodes.append('text')
            .text(d => d.title)
            .attr('dy', 45)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('font-weight', '900')
            .style('fill', '#374151')
            .style('text-transform', 'uppercase')
            .style('letter-spacing', '0.05em');

        simulation.on('tick', () => {
            gLinks
                .attr('x1', d => (d.source as any).x)
                .attr('y1', d => (d.source as any).y)
                .attr('x2', d => (d.target as any).x)
                .attr('y2', d => (d.target as any).y);

            nodes
                .attr('transform', d => `translate(${d.x}, ${d.y})`);
        });

        // Zoom & Drag
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            });

        svg.call(zoom);

        return () => {
            simulation.stop();
        };
    }, [data, onNodeClick]);

    return (
        <div className="relative w-full aspect-video bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-inner group">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tighter">Neural Knowledge Map</h3>
                <p className="text-[10px] font-bold text-gray-400">Drag to navigate • Click to explore</p>
            </div>
            <div className="absolute bottom-6 left-6 z-10 flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase">Math</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase">CS</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase">Logic</span>
                </div>
            </div>
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};
