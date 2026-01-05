import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity as ActivityIcon,
    Heart,
    MessageCircle,
    Share2,
    Award,
    TrendingUp,
    CheckCircle2,
    Zap,
    Users
} from 'lucide-react';

interface Activity {
    _id: string;
    user: {
        _id: string;
        displayName: string;
        username: string;
        avatar: string;
        level: number;
    };
    type: 'LEVEL_UP' | 'ACHIEVEMENT_UNLOCKED' | 'COURSE_COMPLETED' | 'STREAK_MILESTONE' | 'CLAN_JOINED';
    content: string;
    metadata: any;
    kudos: string[];
    createdAt: string;
}

const SocialFeed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('/api/activities', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            if (data.success) {
                setActivities(data.data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKudos = async (activityId: string) => {
        try {
            const response = await fetch(`/api/activities/${activityId}/kudos`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) fetchActivities();
        } catch (error) {
            console.error('Error giving kudos:', error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-pulse">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-24" />
                                <div className="h-3 bg-gray-100 rounded w-16" />
                            </div>
                        </div>
                        <div className="h-4 bg-gray-100 rounded w-3/4 mb-4" />
                        <div className="flex gap-4">
                            <div className="h-8 bg-gray-100 rounded w-20" />
                            <div className="h-8 bg-gray-100 rounded w-20" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <ActivityIcon className="text-blue-600 w-6 h-6" />
                Community Feed
            </h3>

            <AnimatePresence>
                {activities.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 border-dashed">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">No community activity yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Be the first to share a milestone!</p>
                    </div>
                ) : (
                    activities.map((activity, idx) => (
                        <ActivityCard
                            key={activity._id}
                            activity={activity}
                            onKudos={() => handleKudos(activity._id)}
                            delay={idx * 0.05}
                        />
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};

const ActivityCard = ({ activity, onKudos, delay }: { activity: Activity, onKudos: () => void, delay: number }) => {
    const userId = localStorage.getItem('userId');
    const hasKudosed = activity.kudos.includes(userId || '');

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'LEVEL_UP':
                return { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600', label: 'Rank Up' };
            case 'ACHIEVEMENT_UNLOCKED':
                return { icon: <Award className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600', label: 'Achievement' };
            case 'COURSE_COMPLETED':
                return { icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-green-100 text-green-600', label: 'Graduated' };
            case 'STREAK_MILESTONE':
                return { icon: <Zap className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600', label: 'Momentum' };
            default:
                return { icon: <ActivityIcon className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600', label: 'Milestone' };
        }
    };

    const config = getTypeConfig(activity.type);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
        >
            <div className="flex items-start gap-4">
                <div className="relative">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {activity.user.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${config.color} border-2 border-white rounded-full flex items-center justify-center shadow-sm`}>
                        {config.icon}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {activity.user.displayName}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        <span className="font-bold text-gray-800">{activity.content}</span> in their learning journey.
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onKudos}
                            disabled={hasKudosed}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all ${hasKudosed
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-3.5 h-3.5 ${hasKudosed ? 'fill-current' : ''}`} />
                            {activity.kudos.length || 'Kudos'}
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-full text-xs font-black transition-all">
                            <MessageCircle className="w-3.5 h-3.5" />
                            Comment
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full text-xs font-black transition-all">
                            <Share2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SocialFeed;
