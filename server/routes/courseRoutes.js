import express from 'express';
import { getCourses, getCourse, searchCourses } from '../controllers/courseController.js';

const router = express.Router();

router.get('/search', searchCourses);

router.get('/', getCourses);
router.get('/:id', getCourse);

export default router;
