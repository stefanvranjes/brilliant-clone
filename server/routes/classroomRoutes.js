import express from 'express';
import {
    createClassroom,
    joinClassroom,
    getMyClassrooms,
    getClassroomStats
} from '../controllers/classroomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Student routes
router.post('/join', joinClassroom);

// Teacher routes
router.route('/')
    .post(authorize('teacher', 'admin'), createClassroom)
    .get(authorize('teacher', 'admin'), getMyClassrooms);

router.get('/:id/stats', authorize('teacher', 'admin'), getClassroomStats);

export default router;
