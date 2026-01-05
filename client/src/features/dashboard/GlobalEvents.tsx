import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Trophy,
    Clock,
    Zap,
    Users,
    Target,
    ArrowRight
} from 'lucide-react';

interface Participant {
    user: string;
    xpContributed: number;
    joinedAt: string;
}

interface Event {
    _id: string;
    title: string;
    description: string;
    type: string;
    startTime: string;
    endTime: string;
    participants: Participant[];
    targetXP: number;
    status: 'upcoming' | 'active' | 'completed';
}

const GlobalEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId: string) => {
        try {
            const response = await fetch(`/api/events/${eventId}/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) fetchEvents();
        } catch (error) {
            console.error('Error registering for event:', error);
        }
    };

    if (loading) return null; // Or a skeleton

    const activeEvents = events.filter(e => e.status === 'active');
    const upcomingEvents = events.filter(e => e.status === 'upcoming');

    if (events.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Global Events</h2>
                    <p className="text-gray-600 font-medium">Join time-limited challenges and earn exclusive rewards.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
                    <Trophy className="w-4 h-4" />
                    <span>{events.length} Live Events</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activeEvents.map(event => (
                    <ActiveEventCard
                        key={event._id}
                        event={event}
                        onRegister={() => handleRegister(event._id)}
                    />
                ))}
            </div>

            {upcomingEvents.length > 0 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map(event => (
                        <div
                            key={event._id}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-tight">{event.title}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">Starts {new Date(event.startTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

const ActiveEventCard = ({ event, onRegister }: { event: Event, onRegister: () => void }) => {
    const isParticipating = event.participants.some(p => p.user === localStorage.getItem('userId'));

    // Calculate total community progress
    const communityXP = event.participants.reduce((acc, p) => acc + p.xpContributed, 0);
    const progressPercent = Math.min(100, (communityXP / event.targetXP) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gray-900 rounded-[2.5rem] p-10 text-white overflow-hidden shadow-2xl"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="px-4 py-1.5 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                        <Zap className="w-3 h-3 fill-current" />
                        Live Event: {event.type}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                        <Clock className="w-4 h-4" />
                        Ends in 3 days
                    </div>
                </div>

                <h3 className="text-3xl font-black mb-4 tracking-tight">{event.title}</h3>
                <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                    {event.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-white/5 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-blue-400 mb-1">
                            <Users className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Participants</span>
                        </div>
                        <div className="text-xl font-black">{event.participants.length.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-green-400 mb-1">
                            <Target className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-400/60">Target XP</span>
                        </div>
                        <div className="text-xl font-black">{event.targetXP.toLocaleString()}</div>
                    </div>
                </div>

                <div className="space-y-4 mb-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                        <span>Community Progress</span>
                        <span className="text-white">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        />
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                    {isParticipating ? (
                        <div className="flex-1 w-full bg-white/5 border border-white/10 py-4 px-8 rounded-2xl font-black text-center text-sm tracking-widest text-green-400 flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4 fill-current" />
                            PARTICIPATING
                        </div>
                    ) : (
                        <button
                            onClick={onRegister}
                            className="flex-1 w-full bg-white text-black py-4 px-8 rounded-2xl font-black shadow-xl hover:bg-gray-100 transition-all transition-colors active:scale-95"
                        >
                            Join Challenge
                        </button>
                    )}
                    <button className="flex-none p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default GlobalEvents;
