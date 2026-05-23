import express from 'express';
import UserReportController from '../controllers/userReportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to view reports for a specific event
router.get('/earthquake/:eventId', UserReportController.getByEarthquake);

// Protected routes (require JWT login session)
router.post('/', protect, UserReportController.submit);
router.delete('/:id', protect, UserReportController.delete);

export default router;
