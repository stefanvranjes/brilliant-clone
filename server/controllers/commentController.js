import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Get comments for a problem
// @route   GET /api/comments/:problemId
// @access  Public
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ problemId: req.params.problemId })
            .populate('author', 'username displayName avatar')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Post a comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res) => {
    try {
        const { problemId, content, parentComment } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const comment = await Comment.create({
            problemId,
            author: req.user._id,
            content,
            parentComment: parentComment || null
        });

        const populatedComment = await comment.populate('author', 'username displayName avatar');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike a comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const likeIndex = comment.likes.indexOf(req.user._id);

        if (likeIndex > -1) {
            comment.likes.splice(likeIndex, 1);
        } else {
            comment.likes.push(req.user._id);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
