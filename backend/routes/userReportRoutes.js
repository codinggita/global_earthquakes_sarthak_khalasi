import express from 'express';
import UserReportController from '../controllers/userReportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all routes under this module
router.use(protect);

// Core CRUD endpoints
router.route('/')
  .post(UserReportController.create)
  .get(UserReportController.list);

// Aggregation statistics endpoint
router.route('/earthquake/:earthquakeId/stats')
  .get(UserReportController.getStats);

router.route('/:id')
  .get(UserReportController.getOne)
  .put(UserReportController.update)
  .delete(UserReportController.delete);

export default router;