import Problem from '../models/Problem.js';

// @desc    Get current user's problems (drafts, pending, etc.)
// @route   GET /api/creator/problems
// @access  Private
export const getMyProblems = async (req, res, next) => {
    try {
        const problems = await Problem.find({ creator: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: problems.length,
            data: problems
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new problem draft
// @route   POST /api/creator/problems
// @access  Private
export const createProblemDraft = async (req, res, next) => {
    try {
        const { title, description, type, category, difficulty, hints, options, solution, visualizationId } = req.body;

        // Generate slug from title
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const problem = await Problem.create({
            title,
            slug,
            description,
            type,
            category,
            difficulty,
            hints,
            options,
            solution,
            visualizationId,
            creator: req.user._id,
            status: 'draft',
            isCommunityContributed: req.user.role !== 'admin'
        });

        res.status(201).json({
            success: true,
            data: problem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a problem draft
// @route   PUT /api/creator/problems/:id
// @access  Private
export const updateProblemDraft = async (req, res, next) => {
    try {
        let problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        // Ensure user is the creator
        if (problem.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to edit this problem' });
        }

        // Only allow editing if in draft or rejected status
        if (problem.status === 'published' && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot edit published problems' });
        }

        problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: problem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit a problem for review
// @route   PATCH /api/creator/problems/:id/submit
// @access  Private
export const submitForReview = async (req, res, next) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        if (problem.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        problem.status = 'pending_review';
        await problem.save();

        res.status(200).json({
            success: true,
            message: 'Problem submitted for review',
            data: problem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Review a problem (Admin only)
// @route   POST /api/creator/problems/:id/review
// @access  Private/Admin
export const reviewProblem = async (req, res, next) => {
    try {
        const { status, reviewFeedback } = req.body;

        if (!['published', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const problem = await Problem.findByIdAndUpdate(
            req.params.id,
            { status, reviewFeedback },
            { new: true, runValidators: true }
        );

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        res.status(200).json({
            success: true,
            data: problem
        });
    } catch (error) {
        next(error);
    }
};
