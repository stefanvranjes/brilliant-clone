import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const LogicScenarioTester: React.FC = () => {
    const [selectedDoor, setSelectedDoor] = useState<number | null>(null);

    const signs = [
        { id: 1, text: "This is the door", condition: (door: number) => door === 1 },
        { id: 2, text: "The door to freedom is to the right", condition: (door: number) => door === 2 }, // Assuming "to the right" means door 2 if you are at door 1? Wait, "right" usually means next index.
        // Let's stick to the problem's actual text logic: 
        // Door 1: "This is the door" (True if D1 is freedom)
        // Door 2: "The door to freedom is to the right" (True if D3 is freedom? Or D2? Usually Door 2's right is Door 3)
        // Door 3: "The door to freedom is not here" (True if D1 or D2 is freedom)
    ];

    // Refined based on the puzzle:
    // D1 sign: T if D1 is freedom
    // D2 sign: T if D3 is freedom (to the right of D2 is D3) -- Wait, the puzzle says "freedom is to the right" on D2. 
    // D3 sign: T if D3 is NOT freedom (D1 or D2 is freedom)

    const testScenario = (freedomDoor: number) => {
        const s1 = freedomDoor === 1;
        const s2 = freedomDoor === 3;
        const s3 = freedomDoor !== 3;
        return [s1, s2, s3];
    };

    const results = selectedDoor !== null ? testScenario(selectedDoor) : [null, null, null];
    const trueCount = results.filter(r => r === true).length;

    return (
        <div className="bg-gray-50 rounded-2xl p-8 my-8 border border-gray-100 shadow-inner">
            <div className="text-center mb-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Scenario Tester</h4>
                <p className="text-gray-600 font-medium">Test what happens if each door were the freedom door.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((num) => (
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
