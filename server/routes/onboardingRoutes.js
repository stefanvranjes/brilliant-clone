import express from 'express';
import { getDiagnosticSet, finishDiagnostic } from '../controllers/onboardingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/diagnostic', protect, getDiagnosticSet);
router.post('/finish', protect, finishDiagnostic);

export default router;
