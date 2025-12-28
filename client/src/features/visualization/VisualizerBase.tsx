import React, { useRef, useEffect, useState } from 'react';

interface VisualizerBaseProps {
    children: (width: number, height: number) => React.ReactNode;
    aspectRatio?: number;
    className?: string;
}

const VisualizerBase: React.FC<VisualizerBaseProps> = ({
    children,
    aspectRatio = 1.6,
    className = ""
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width,
                    height: width / aspectRatio
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [aspectRatio]);

    return (
        <div
            ref={containerRef}
            className={`w-full overflow-hidden bg-white rounded-3xl border-2 border-gray-100 shadow-sm ${className}`}
            style={{ minHeight: dimensions.height || '300px' }}
        >
            {dimensions.width > 0 && children(dimensions.width, dimensions.height)}
        </div>
    );
};

export default VisualizerBase;
