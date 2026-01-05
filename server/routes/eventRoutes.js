import express from 'express';
import {
    getEvents,
    registerForEvent,
    createEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getEvents)
    .post(authorize('admin'), createEvent);

router.post('/:id/register', registerForEvent);

export default router;
