import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
    text: string;
    user: string;
    timestamp: string;
}

export const StudyRoom: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [participants, setParticipants] = useState<string[]>([]);

    useEffect(() => {
        const newSocket = io('http://localhost:5000'); // Replace with your server URL
        setSocket(newSocket);

        if (roomId) {
            newSocket.emit('join-room', roomId);
        }

        newSocket.on('receive-message', (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on('user-joined', (data: { userId: string }) => {
            setParticipants(prev => [...prev, data.userId]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !socket || !roomId) return;

        socket.emit('send-message', {
            roomId,
            message: input,
            user: user?.username || 'Guest'
        });
        setInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black">Study Room: {roomId}</h1>
                    <p className="text-gray-500">Collaborate in real-time</p>
                </div>
                <div className="flex -space-x-2">
                    {participants.map((p, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                            {p.substring(0, 2).toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex flex-col ${msg.user === user?.username ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-400">{msg.user}</span>
                                    <span className="text-[10px] text-gray-300">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl text-sm ${msg.user === user?.username
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Send a message..."
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button type="submit">Send</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
