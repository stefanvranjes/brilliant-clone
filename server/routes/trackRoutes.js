import express from 'express';
import { getTracks, getTrackById } from '../controllers/trackController.js';

const router = express.Router();

router.get('/', getTracks);
router.get('/:id', getTrackById);

export default router;
