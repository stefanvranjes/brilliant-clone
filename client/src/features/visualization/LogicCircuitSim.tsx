import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogicGate {
    id: string;
    type: 'AND' | 'OR' | 'NOT' | 'XOR';
    inputA: string; // ID of source (input or other gate)
    inputB?: string;
    label: string;
}

interface LogicCircuitSimProps {
    inputs: { id: string; label: string; initialValue: boolean }[];
    gates: LogicGate[];
    outputs: { id: string; label: string; source: string }[];
}

export const LogicCircuitSim: React.FC<LogicCircuitSimProps> = ({
    inputs: initialInputs,
    gates,
    outputs: initialOutputs
}) => {
    const [inputStates, setInputStates] = useState<Record<string, boolean>>(
        Object.fromEntries(initialInputs.map(i => [i.id, i.initialValue]))
    );
    const [gateStates, setGateStates] = useState<Record<string, boolean>>({});
    const [outputStates, setOutputStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const calculateStates = () => {
            const newGateStates: Record<string, boolean> = {};

            // Since gates might depend on each other, we might need multiple passes or a topological sort.
            // For simplicity in this mock, we'll do up to 3 passes (small circuits).
            for (let pass = 0; pass < 3; pass++) {
                gates.forEach(gate => {
                    const valA = inputStates[gate.inputA] ?? newGateStates[gate.inputA] ?? false;
                    const valB = gate.inputB ? (inputStates[gate.inputB] ?? newGateStates[gate.inputB] ?? false) : false;

                    let result = false;
                    switch (gate.type) {
                        case 'AND': result = valA && valB; break;
                        case 'OR': result = valA || valB; break;
                        case 'NOT': result = !valA; break;
                        case 'XOR': result = valA !== valB; break;
                    }
                    newGateStates[gate.id] = result;
                });
            }

            setGateStates(newGateStates);

            const newOutputStates: Record<string, boolean> = {};
            initialOutputs.forEach(out => {
                newOutputStates[out.id] = inputStates[out.source] ?? newGateStates[out.source] ?? false;
            });
            setOutputStates(newOutputStates);
        };

        calculateStates();
    }, [inputStates, gates, initialOutputs]);

    const toggleInput = (id: string) => {
        setInputStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl overflow-hidden border border-slate-700">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full" />
                    Logic Circuit Simulator
                </h3>
                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> High (1)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700" /> Low (0)</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 relative">
                {/* INPUTS */}
                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Inputs</h4>
                    {initialInputs.map(input => (
                        <div key={input.id} className="flex items-center gap-3">
                            <button
                                onClick={() => toggleInput(input.id)}
                                className={`
                  w-12 h-6 rounded-full transition-all relative
                  ${inputStates[input.id] ? 'bg-blue-500' : 'bg-slate-700'}
                `}
                            >
                                <motion.div
                                    animate={{ x: inputStates[input.id] ? 24 : 4 }}
                                    className="w-4 h-4 bg-white rounded-full mt-1"
                                />
                            </button>
                            <span className="font-bold text-sm tracking-tight">{input.label}</span>
                        </div>
                    ))}
                </div>

                {/* GATES */}
                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Logic Gates</h4>
                    {gates.map(gate => (
                        <div
                            key={gate.id}
                            className={`
                p-4 rounded-xl border-2 transition-all relative
                ${gateStates[gate.id] ? 'border-blue-400 bg-blue-400/10 shadow-[0_0_15px_rgba(96,165,250,0.2)]' : 'border-slate-700 bg-slate-800/50'}
              `}
                        >
                            <div className="text-[10px] font-black text-slate-500 mb-1">{gate.type} GATE</div>
                            <div className="font-black text-lg leading-tight">{gate.label}</div>

                            {/* Output Indicator */}
                            <div className={`
                absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-900
                ${gateStates[gate.id] ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-700'}
              `} />
                        </div>
                    ))}
                </div>

                {/* OUTPUTS */}
                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Outputs</h4>
                    {initialOutputs.map(output => (
                        <div key={output.id} className="flex flex-col items-center justify-center p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
                            <div className="text-xs font-bold text-slate-400 mb-3">{output.label}</div>
                            <motion.div
                                animate={{
                                    scale: outputStates[output.id] ? 1.2 : 1,
                                    backgroundColor: outputStates[output.id] ? '#60A5FA' : '#1E293B'
                                }}
                                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black shadow-inner"
                            >
                                {outputStates[output.id] ? '1' : '0'}
                            </motion.div>
                            <AnimatePresence>
                                {outputStates[output.id] && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="mt-2 text-[10px] font-black text-blue-400 tracking-widest"
                                    >
                                        ACTIVE
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Connection visualization would go here if we wanted SVG lines */}
            </div>

            <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400 leading-relaxed">
                <strong>Tip:</strong> Toggle the input switches on the left to observe how the binary logic flows through the system. High signals (1) enable gates according to their truth tables.
            </div>
        </div>
    );
};
