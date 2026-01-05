import express from 'express';
import {
    createClan,
    getClans,
    joinClan,
    leaveClan,
    getClanDetails
} from '../controllers/clanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getClans)
    .post(createClan);

router.route('/:id')
    .get(getClanDetails);

router.post('/:id/join', joinClan);
router.post('/:id/leave', leaveClan);

export default router;
