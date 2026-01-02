import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { Button } from '../../components/ui/Button';

interface InteractiveLabProps {
    roomId: string;
    socket: Socket | null;
}

interface LabObject {
    id: string;
    x: number;
    y: number;
    color: string;
    type: 'circle' | 'square';
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ roomId, socket }) => {
    const [objects, setObjects] = useState<LabObject[]>([]);
    const [gravity, setGravity] = useState(9.8);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket) return;

        // Rebroadcast our state occasionally if we are the "host" 
        // (Simple host logic: first one in room, but for this prototype just sync on action)

        socket.on('lab-state-sync', (newState: any) => {
            setObjects(newState.objects);
            setGravity(newState.gravity);
        });

        socket.on('lab-action-broadcast', (action: any) => {
            if (action.type === 'move') {
                setObjects(prev => prev.map(obj =>
                    obj.id === action.id ? { ...obj, x: action.x, y: action.y } : obj
                ));
            } else if (action.type === 'spawn') {
                setObjects(prev => [...prev, action.object]);
            }
        });

        return () => {
            socket.off('lab-state-sync');
            socket.off('lab-action-broadcast');
        };
    }, [socket]);

    const handleSpawn = (type: 'circle' | 'square') => {
        const newObj: LabObject = {
            id: `obj_${Math.random().toString(36).substr(2, 9)}`,
            x: Math.random() * 80 + 10,
            y: 20,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            type
        };

        setObjects(prev => [...prev, newObj]);
        socket?.emit('lab-action', {
            roomId,
            action: { type: 'spawn', object: newObj }
        });
    };

    const handleDragEnd = (id: string, info: any) => {
        // In a real app, we'd calculate relative position to container
        // For now, just a simple sync
        const x = info.point.x; // This is absolute, but works for demo
        const y = info.point.y;

        socket?.emit('lab-action', {
            roomId,
            action: { type: 'move', id, x, y }
        });
    };

    const updateGravity = (val: number) => {
        setGravity(val);
        socket?.emit('lab-state-update', {
            roomId,
            state: { objects, gravity: val }
        });
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800">
            <header className="p-4 bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Physics Lab v1.0</span>
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Gravity: {gravity}m/s²</label>
                        <input
                            type="range"
                            min="0" max="20" step="0.1"
                            value={gravity}
                            onChange={(e) => updateGravity(parseFloat(e.target.value))}
                            className="w-24 accent-blue-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleSpawn('circle')}>+ Circle</Button>
                    <Button size="sm" variant="outline" onClick={() => handleSpawn('square')}>+ Square</Button>
                </div>
            </header>

            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px]"
            >
                {objects.map((obj) => (
                    <motion.div
                        key={obj.id}
                        drag
                        dragMomentum={false}
                        onDragEnd={(_, info) => handleDragEnd(obj.id, info)}
                        initial={{ x: `${obj.x}%`, y: `${obj.y}%` }}
                        animate={{ x: `${obj.x}%`, y: `${obj.y}%` }}
                        className={`absolute w-12 h-12 cursor-grab active:cursor-grabbing shadow-lg ${obj.type === 'circle' ? 'rounded-full' : 'rounded-lg'
                            }`}
                        style={{ backgroundColor: obj.color }}
                    >
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </div>
                    </motion.div>
                ))}

                {objects.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 pointer-events-none">
                        <p className="font-bold text-sm tracking-widest uppercase">Spawn objects to begin collaborating</p>
                    </div>
                )}
            </div>
        </div>
    );
};
