import React from 'react';
import { AlgebraBalance } from './AlgebraBalance';
import { BinaryExplorer } from './BinaryExplorer';
import { LogicScenarioTester } from './LogicScenarioTester';
import CoordinatePlane from './components/CoordinatePlane';
import { LogicCircuitSim } from './LogicCircuitSim';

interface VisualizationEngineProps {
    visualizationId: string;
    config?: any;
    onInteraction?: (data: any) => void;
}

const VisualizationEngine: React.FC<VisualizationEngineProps> = ({
    visualizationId,
    config,
    onInteraction
}) => {
    switch (visualizationId) {
        case 'algebra-balance':
            return <AlgebraBalance {...config} />;
        case 'binary-explorer':
            return <BinaryExplorer initialBits={config?.initialBits} />;
        case 'logic-scenario':
            return <LogicScenarioTester {...config} />;
        case 'coordinate-plane':
            return <CoordinatePlane config={config} onInteraction={onInteraction} />;
        case 'logic-circuit-sim':
            return <LogicCircuitSim {...config} />;
        default:
            return (
                <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                    <p className="text-gray-400 font-medium">Visualization "{visualizationId}" not implemented yet.</p>
                </div>
            );
    }
};

export default VisualizationEngine;
