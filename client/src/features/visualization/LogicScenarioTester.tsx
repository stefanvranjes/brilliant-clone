import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Sign {
    id: number;
    text: string;
    trueIfDoorIs: number[]; // Array of door numbers that make this sign true
}

interface LogicScenarioTesterProps {
    doorCount?: number;
    signs?: Sign[];
}

export const LogicScenarioTester: React.FC<LogicScenarioTesterProps> = ({
    doorCount = 3,
    signs = [
        { id: 1, text: "This is the door", trueIfDoorIs: [1] },
        { id: 2, text: "The door to freedom is to the right", trueIfDoorIs: [3] },
        { id: 3, text: "The door to freedom is not here", trueIfDoorIs: [1, 2] },
    ]
}) => {
    const [selectedDoor, setSelectedDoor] = useState<number | null>(null);

    const testScenario = (freedomDoor: number) => {
        return signs.map(sign => sign.trueIfDoorIs.includes(freedomDoor));
    };

    const results = selectedDoor !== null ? testScenario(selectedDoor) : signs.map(() => null);
    const trueCount = results.filter(r => r === true).length;

    const doorArray = Array.from({ length: doorCount }, (_, i) => i + 1);

    return (
        <div className="bg-gray-50 rounded-2xl p-8 my-8 border border-gray-100 shadow-inner">
            <div className="text-center mb-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Scenario Tester</h4>
                <p className="text-gray-600 font-medium">Test what happens if each door were the freedom door.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {doorArray.map((num) => (
                    <button
                        key={num}
                        onClick={() => setSelectedDoor(num)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedDoor === num
                            ? 'bg-blue-50 border-blue-500 shadow-md scale-105'
                            : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                            }`}
                    >
                        <span className="text-3xl">🚪</span>
                        <span className="font-bold text-gray-600">Assume Door {num}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {signs.map((sign, idx) => (
                    <div
                        key={sign.id}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${selectedDoor === null
                            ? 'bg-white border-gray-100 opacity-50'
                            : results[idx]
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-gray-400">Sign on Door {sign.id}</span>
                            <span className="text-sm font-bold text-gray-800">"{sign.text}"</span>
                        </div>
                        {selectedDoor !== null && (
                            <span className={`text-xs font-black uppercase tracking-widest ${results[idx] ? 'text-green-600' : 'text-red-600'}`}>
                                {results[idx] ? 'TRUE' : 'FALSE'}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {selectedDoor !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 rounded-xl bg-gray-900 text-white text-center"
                >
                    <p className="text-sm font-medium">
                        In this scenario, <span className="text-yellow-400 font-black">{trueCount}</span> sign(s) are true.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {trueCount === 1
                            ? "✅ This satisfies the condition 'Only one sign is true'."
                            : "❌ This contradicts the condition 'Only one sign is true'."}
                    </p>
                </motion.div>
            )}
        </div>
    );
};
