import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import communityService, { Comment } from '../../services/community.service';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface DiscussionSectionProps {
    problemId: string;
}

const DiscussionSection: React.FC<DiscussionSectionProps> = ({ problemId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await communityService.getComments(problemId);
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [problemId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const comment = await communityService.postComment(problemId, newComment);
            setComments([comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        if (!user) return;
        try {
            const updatedComment = await communityService.toggleLike(commentId);
            setComments(comments.map(c => c._id === commentId ? updatedComment : c));
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900">Discussion</h3>
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-bold">
                    {comments.length} Comments
                </span>
            </div>

            {/* Post Comment */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-10">
                    <div className="bg-white rounded-2xl border-2 border-gray-100 focus-within:border-black transition-all p-1 shadow-sm">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts or ask a question..."
                            className="w-full p-4 rounded-xl outline-none resize-none min-h-[100px] text-gray-700 font-medium"
                        />
                        <div className="flex justify-end p-2 border-t border-gray-50">
                            <Button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                variant="primary"
                                size="sm"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-center mb-10 border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium mb-4">Join the community to participate in the discussion.</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
                        Log in to post
                    </Button>
                </div>
            )}

            {/* Comment List */}
            <div className="space-y-6">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-black text-sm border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                    {comment.author.avatar ? (
                                        <img src={comment.author.avatar} alt={comment.author.username} className="w-full h-full object-cover" />
                                    ) : (
                                        comment.author.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900">{comment.author.displayName || comment.author.username}</span>
                                        <span className="text-xs text-gray-400 font-medium">•</span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed font-normal">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pl-14">
                                <button
                                    onClick={() => handleLike(comment._id)}
                                    className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${user && comment.likes.includes(user.id)
                                        ? 'text-pink-600'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <span className="text-lg">♥</span>
                                    <span>{comment.likes.length}</span>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 text-sm font-bold">
                                    Reply
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {comments.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-400 font-medium italic">No comments yet. Be the first to start the conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionSection;
