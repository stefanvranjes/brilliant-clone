import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';

interface SortingInteractionProps {
    items: { id: string; content: string }[];
    isSubmitted: boolean;
    correctOrderIds: string[];
    onOrderChange: (newOrderIds: string[]) => void;
}

export const SortingInteraction: React.FC<SortingInteractionProps> = ({
    items: initialItems,
    isSubmitted,
    correctOrderIds,
    onOrderChange
}) => {
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        onOrderChange(items.map(item => item.id));
    }, [items, onOrderChange]);

    return (
        <div className="space-y-4">
            <p className="text-gray-500 text-sm font-medium mb-2 italic">
                Drag items to reorder them correctly:
            </p>

            <Reorder.Group
                axis="y"
                values={items}
                onReorder={setItems}
                className="space-y-2"
            >
                {items.map((item) => {
                    const isCorrect = isSubmitted && correctOrderIds.indexOf(item.id) === items.indexOf(item);
                    const currentPos = items.indexOf(item);
                    const targetPos = correctOrderIds.indexOf(item.id);

                    return (
                        <Reorder.Item
                            key={item.id}
                            value={item}
                            dragListener={!isSubmitted}
                            className={`
                p-4 rounded-xl border-2 flex items-center justify-between transition-colors
                ${isSubmitted
                                    ? (isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500')
                                    : 'bg-white border-gray-200 cursor-grab active:cursor-grabbing hover:border-gray-300 shadow-sm'
                                }
              `}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                  ${isSubmitted
                                        ? (isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
                                        : 'bg-gray-100 text-gray-500'
                                    }
                `}>
                                    {currentPos + 1}
                                </span>
                                <span className="font-medium text-gray-800">{item.content}</span>
                            </div>

                            {isSubmitted && (
                                <div className="flex items-center gap-2">
                                    {isCorrect ? (
                                        <span className="text-green-600 font-black">✓</span>
                                    ) : (
                                        <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                                            Should be #{targetPos + 1}
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isSubmitted && (
                                <div className="text-gray-300">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="7" x2="17" y2="7" />
                                        <line x1="3" y1="13" x2="17" y2="13" />
                                    </svg>
                                </div>
                            )}
                        </Reorder.Item>
                    );
                })}
            </Reorder.Group>
        </div>
    );
};
