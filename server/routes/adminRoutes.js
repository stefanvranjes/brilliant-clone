import express from 'express';
import Problem from '../models/Problem.js';
import Course from '../models/Course.js';
// import Chapter from '../models/Chapter.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// --- PROBLEMS ---

// @desc    Create a problem
// @route   POST /api/admin/problems
router.post('/problems', async (req, res, next) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json(problem);
    } catch (error) {
        next(error);
    }
});

// @desc    Update a problem
// @route   PUT /api/admin/problems/:id
router.put('/problems/:id', async (req, res, next) => {
    try {
        const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        res.json(problem);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete a problem
// @route   DELETE /api/admin/problems/:id
router.delete('/problems/:id', async (req, res, next) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        res.json({ message: 'Problem deleted' });
    } catch (error) {
        next(error);
    }
});

// --- COURSES ---

// @desc    Create a course
// @route   POST /api/admin/courses
router.post('/courses', async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
});

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
router.put('/courses/:id', async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        next(error);
    }
});

// --- CHAPTERS ---

/*
// @desc    Create a chapter for a course
// @route   POST /api/admin/courses/:courseId/chapters
router.post('/courses/:courseId/chapters', async (req, res, next) => {
    try {
        const chapter = await Chapter.create({ ...req.body, courseId: req.params.courseId });

        // Also add to course chapters array
        await Course.findByIdAndUpdate(req.params.courseId, {
            $push: { chapters: chapter._id }
        });

        res.status(201).json(chapter);
    } catch (error) {
        next(error);
    }
});
*/

export default router;
