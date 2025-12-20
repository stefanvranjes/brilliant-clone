import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AlgebraBalance: React.FC = () => {
    // Variables for the specific problem 2x + 5 = 15
    const [xValue, setXValue] = useState(0);
    const constant = 5;
    const target = 15;

    const currentLeft = (xValue * 2) + constant;
    const isBalanced = currentLeft === target;
    const tilt = Math.min(Math.max((target - currentLeft) * 2, -15), 15);

    return (
        <div className="bg-gray-50 rounded-2xl p-8 my-8 border border-gray-100 shadow-inner overflow-hidden">
            <div className="text-center mb-10">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Algebra Balance</h4>
                <p className="text-gray-600 font-medium">Find the value of <span className="text-blue-600 font-bold">x</span> that balances the scale.</p>
            </div>

            <div className="relative h-64 flex flex-col items-center justify-end mb-12">
                {/* Scale Beam */}
                <motion.div
                    animate={{ rotate: tilt }}
                    transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    className="w-full h-2 bg-gray-800 rounded-full relative flex justify-between px-12"
                >
                    {/* Left Pan */}
                    <div className="absolute left-10 top-2 flex flex-col items-center">
                        <div className="w-0.5 h-20 bg-gray-400" />
                        <div className="w-40 h-4 bg-gray-800 rounded-md shadow-xl flex items-end justify-center pb-8 relative">
                            <div className="absolute bottom-4 flex gap-1 items-end">
                                {/* Visualizing 2x */}
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <motion.div
                                        key={`x-${i}`}
                                        animate={{ height: xValue * 10 + 20 }}
                                        className="w-8 bg-blue-500 rounded-t-lg border-2 border-blue-600 flex items-center justify-center text-white font-black text-xs"
                                    >
                                        X
                                    </motion.div>
                                ))}
                                {/* Visualizing +5 */}
                                <div className="w-12 h-10 bg-yellow-400 rounded-t-lg border-2 border-yellow-500 flex items-center justify-center text-yellow-900 font-black text-xs text-center leading-none">
                                    +5
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Pan */}
                    <div className="absolute right-10 top-2 flex flex-col items-center">
                        <div className="w-0.5 h-20 bg-gray-400" />
                        <div className="w-40 h-4 bg-gray-800 rounded-md shadow-xl flex items-end justify-center pb-8 relative">
                            <div className="absolute bottom-4 w-24 h-30 bg-gray-200 rounded-t-lg border-2 border-gray-300 flex items-center justify-center text-gray-500 font-black text-2xl">
                                15
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Scale Base */}
                <div className="w-4 h-32 bg-gray-300 rounded-t-full -mt-2" />
                <div className="w-32 h-4 bg-gray-800 rounded-full" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center gap-6">
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Value of X</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setXValue(Math.max(0, xValue - 1))}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black hover:bg-gray-200 transition-colors"
                            >-</button>
                            <span className="text-4xl font-black w-12">{xValue}</span>
                            <button
                                onClick={() => setXValue(xValue + 1)}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black hover:bg-gray-200 transition-colors"
                            >+</button>
                        </div>
                    </div>
                </div>

                <div className="text-2xl font-black flex items-center gap-4 italic">
                    <span className="text-blue-600">2({xValue})</span>
                    <span>+</span>
                    <span className="text-yellow-500">5</span>
                    <span className={isBalanced ? "text-green-500" : "text-gray-300"}>=</span>
                    <span className="text-gray-900">15</span>
                </div>

                <AnimatePresence>
                    {isBalanced && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-600 font-bold flex items-center gap-2"
                        >
                            ✨ Correct! The equation is balanced.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
