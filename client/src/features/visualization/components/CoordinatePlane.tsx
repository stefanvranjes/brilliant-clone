import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import VisualizerBase from '../VisualizerBase';

interface Point {
    x: number;
    y: number;
    label?: string;
    color?: string;
}

interface CoordinatePlaneProps {
    config?: {
        points?: Point[];
        lines?: { start: Point; end: Point; color?: string }[];
        gridRange?: number; // default +/- 10
    };
    onInteraction?: (data: any) => void;
}

const CoordinatePlane: React.FC<CoordinatePlaneProps> = ({ config, onInteraction }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const gridRange = config?.gridRange || 10;

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = +svg.attr("width");
        const height = +svg.attr("height");
        const margin = 40;

        // Scales
        const xScale = d3.scaleLinear()
            .domain([-gridRange, gridRange])
            .range([margin, width - margin]);

        const yScale = d3.scaleLinear()
            .domain([-gridRange, gridRange])
            .range([height - margin, margin]);

        // Grid lines
        const gridData = d3.range(-gridRange, gridRange + 1);

        svg.append("g")
            .attr("class", "grid")
            .selectAll("line")
            .data(gridData)
            .enter()
            .append("line")
            .attr("x1", (d: number) => xScale(d))
            .attr("y1", margin)
            .attr("x2", (d: number) => xScale(d))
            .attr("y2", height - margin)
            .attr("stroke", "#f0f0f0")
            .attr("stroke-width", 1);

        svg.append("g")
            .attr("class", "grid")
            .selectAll("line")
            .data(gridData)
            .enter()
            .append("line")
            .attr("x1", margin)
            .attr("y1", (d: number) => yScale(d))
            .attr("x2", width - margin)
            .attr("y2", (d: number) => yScale(d))
            .attr("stroke", "#f0f0f0")
            .attr("stroke-width", 1);

        // Axes
        const xAxis = d3.axisBottom(xScale).ticks(gridRange * 2);
        const yAxis = d3.axisLeft(yScale).ticks(gridRange * 2);

        svg.append("g")
            .attr("transform", `translate(0, ${yScale(0)})`)
            .call(xAxis)
            .attr("color", "#999")
            .selectAll("text")
            .attr("font-size", "10px")
            .style("display", (d: any) => d === 0 ? "none" : null);

        svg.append("g")
            .attr("transform", `translate(${xScale(0)}, 0)`)
            .call(yAxis)
            .attr("color", "#999")
            .selectAll("text")
            .attr("font-size", "10px")
            .style("display", (d: any) => d === 0 ? "none" : null);

        // Origin point
        svg.append("circle")
            .attr("cx", xScale(0))
            .attr("cy", yScale(0))
            .attr("r", 3)
            .attr("fill", "#666");

        // Plot Lines
        if (config?.lines) {
            config.lines.forEach(line => {
                svg.append("line")
                    .attr("x1", xScale(line.start.x))
                    .attr("y1", yScale(line.start.y))
                    .attr("x2", xScale(line.end.x))
                    .attr("y2", yScale(line.end.y))
                    .attr("stroke", line.color || "#3b82f6")
                    .attr("stroke-width", 3)
                    .attr("stroke-linecap", "round");
            });
        }

        // Plot Points
        if (config?.points) {
            config.points.forEach(point => {
                const g = svg.append("g")
                    .attr("class", "point-group")
                    .style("cursor", onInteraction ? "pointer" : "default");

                g.append("circle")
                    .attr("cx", xScale(point.x))
                    .attr("cy", yScale(point.y))
                    .attr("r", 6)
                    .attr("fill", point.color || "#2563eb")
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .attr("class", "shadow-lg");

                if (point.label) {
                    g.append("text")
                        .attr("x", xScale(point.x) + 10)
                        .attr("y", yScale(point.y) - 10)
                        .text(point.label)
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "#374151");
                }

                if (onInteraction) {
                    g.on("click", () => onInteraction(point));
                }
            });
        }

    }, [config, gridRange, onInteraction]);

    return (
        <VisualizerBase>
            {(width, height) => (
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    className="mx-auto"
                />
            )}
        </VisualizerBase>
    );
};

export default CoordinatePlane;
