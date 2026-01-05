import express from 'express';
import {
    getActivities,
    giveKudos
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.post('/:id/kudos', giveKudos);

export default router;
