import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { PageTransition } from '../../components/ui/PageTransition';
import { MOCK_PROBLEMS } from '../../mockData';

const SOCKET_URL = 'http://localhost:5000';

export const LearningDuels = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [duelState, setDuelState] = useState<'lobby' | 'waiting' | 'battle' | 'results'>('lobby');
    const [duelId, setDuelId] = useState<string | null>(null);
    const [opponent, setOpponent] = useState<any>(null);
    const [invitation, setInvitation] = useState<any>(null);

    // Battle state
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [problems] = useState(MOCK_PROBLEMS.slice(0, 3));

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('duel-invitation', (data) => {
            setInvitation(data);
        });

        newSocket.on('duel-player-joined', (data) => {
            if (data.user.id !== user?.id) {
                setOpponent(data.user);
                setDuelState('battle');
            }
        });

        newSocket.on('duel-update', (data) => {
            if (data.user.id !== user?.id) {
                setOpponentScore(data.score);
            }
        });

        newSocket.on('duel-player-finished', (data) => {
            if (data.user.id !== user?.id) {
                // Opponent finished
            }
        });

        return () => {
            newSocket.close();
        };
    }, [user]);

    const sendInvite = () => {
        if (!socket || !user) return;
        socket.emit('duel-invite', { inviter: user });
        setDuelState('waiting');
    };

    const acceptInvite = () => {
        if (!socket || !user || !invitation) return;
        setDuelId(invitation.duelId);
        setOpponent(invitation.inviter);
        socket.emit('duel-join', { duelId: invitation.invitationId, user });
        setDuelState('battle');
        setInvitation(null);
    };

    const handleAnswer = (correct: boolean) => {
        const newScore = score + (correct ? 100 : 0);
        setScore(newScore);

        if (socket && duelId) {
            socket.emit('duel-progress', {
                duelId,
                user,
                score: newScore,
                progress: (currentProblemIndex + 1) / problems.length
            });
        }

        if (currentProblemIndex < problems.length - 1) {
            setCurrentProblemIndex(currentProblemIndex + 1);
        } else {
            setDuelState('results');
            if (socket && duelId) {
                socket.emit('duel-finish', { duelId, user, score: newScore });
            }
        }
    };

    return (
        <PageTransition className="max-w-4xl mx-auto p-6">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black text-gray-900 mb-2">Learning Duels ⚔️</h1>
                <p className="text-gray-600">Challenge your peers to a real-time problem sprint.</p>
            </header>

            <AnimatePresence mode="wait">
                {duelState === 'lobby' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-12 rounded-3xl border-2 border-gray-100 shadow-xl text-center"
                    >
                        <div className="text-6xl mb-8">🤺</div>
                        <h2 className="text-2xl font-black mb-6">Ready for a challenge?</h2>
                        <Button onClick={sendInvite} size="lg" className="px-12 py-6 text-xl">
                            Find a Match
                        </Button>

                        {invitation && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-center justify-between"
                            >
                                <div className="text-left">
                                    <div className="text-xs font-black text-yellow-700 uppercase tracking-widest mb-1">Incoming Duel</div>
                                    <div className="font-bold text-lg">{invitation.inviter.displayName} challenged you!</div>
                                </div>
                                <Button onClick={acceptInvite} variant="primary">Accept ⚔️</Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {duelState === 'waiting' && (
                    <motion.div
                        key="waiting"
                        className="text-center py-20"
                    >
                        <div className="animate-spin text-4xl mb-6">⚔️</div>
                        <h2 className="text-2xl font-black mb-2">Searching for a rival...</h2>
                        <p className="text-gray-500">Wait for someone to accept your challenge.</p>
                    </motion.div>
                )}

                {duelState === 'battle' && (
                    <motion.div
                        key="battle"
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-center gap-8">
                            <div className="flex-1 bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-sm relative overflow-hidden">
                                <div className="text-xs font-black text-blue-600 uppercase mb-2">You</div>
                                <div className="text-3xl font-black">{score}</div>
                                <div className="h-2 bg-gray-100 mt-4 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${(currentProblemIndex / problems.length) * 100}%` }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="text-4xl font-black text-gray-300">VS</div>
                            <div className="flex-1 bg-white p-6 rounded-2xl border-2 border-red-100 shadow-sm relative overflow-hidden">
                                <div className="text-xs font-black text-red-600 uppercase mb-2">{opponent?.displayName || 'Opponent'}</div>
                                <div className="text-3xl font-black">{opponentScore}</div>
                                <div className="h-2 bg-gray-100 mt-4 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${(opponentScore / 300) * 100}%` }}
                                        className="h-full bg-red-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-xl">
                            <h3 className="text-2xl font-black mb-6">{problems[currentProblemIndex].title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Answer A', 'Answer B', 'Answer C', 'Answer D'].map((ans, i) => (
                                    <button
                                        key={ans}
                                        onClick={() => handleAnswer(i === 0)}
                                        className="p-6 text-left border-2 border-gray-100 rounded-2xl hover:border-black hover:bg-gray-50 transition-all font-bold"
                                    >
                                        {ans}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {duelState === 'results' && (
                    <motion.div
                        key="results"
                        className="text-center bg-white p-12 rounded-3xl border-2 border-gray-100 shadow-xl"
                    >
                        <div className="text-6xl mb-8">{score >= opponentScore ? '👑' : '💀'}</div>
                        <h2 className="text-4xl font-black mb-2">{score >= opponentScore ? 'Victory!' : 'Defeat'}</h2>
                        <p className="text-lg text-gray-600 mb-8">Final Score: {score} vs {opponentScore}</p>
                        <Button onClick={() => setDuelState('lobby')} variant="primary" size="lg">Back to Lobby</Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};
