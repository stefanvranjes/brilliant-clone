import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BinaryExplorer: React.FC = () => {
    const [bits, setBits] = useState([1, 0, 1, 1]); // 4-bit explorer for now

    const toggleBit = (index: number) => {
        const newBits = [...bits];
        newBits[index] = newBits[index] === 1 ? 0 : 1;
        setBits(newBits);
    };

    const decimalValue = bits.reduce((acc: number, bit: number, idx: number) => {
        return acc + bit * Math.pow(2, bits.length - 1 - idx);
    }, 0);

    return (
        <div className="bg-gray-50 rounded-2xl p-8 my-8 border border-gray-100 shadow-inner">
            <div className="text-center mb-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Interactive Visualization</h4>
                <p className="text-gray-600 font-medium">Toggle the bits to see how the decimal value changes.</p>
            </div>

            <div className="flex justify-center items-center gap-4 mb-10">
                {bits.map((bit: number, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-3">
                        <span className="text-xs font-bold text-gray-400">2^{bits.length - 1 - idx} ({Math.pow(2, bits.length - 1 - idx)})</span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleBit(idx)}
                            className={`w-16 h-20 rounded-xl flex items-center justify-center text-3xl font-black transition-all shadow-lg ${bit === 1
                                ? 'bg-black text-white shadow-black/20'
                                : 'bg-white text-gray-300 border-2 border-gray-100 shadow-gray-200/50'
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={bit}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {bit}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center">
                <div className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Decimal Output</div>
                <div className="flex items-baseline gap-2">
                    <motion.span
                        key={decimalValue}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-black text-gray-900"
                    >
                        {decimalValue}
                    </motion.span>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-4 text-xs font-bold text-gray-500 italic">
                    <span>Calculation: </span>
                    {bits.map((bit: number, idx: number) => (
                        <span key={idx} className={bit === 1 ? "text-blue-600" : "text-gray-300"}>
                            ({bit} × {Math.pow(2, bits.length - 1 - idx)})
                            {idx < bits.length - 1 ? " + " : ""}
                        </span>
                    ))}
                    <span> = {decimalValue}</span>
                </div>
            </div>
        </div>
    );
};
