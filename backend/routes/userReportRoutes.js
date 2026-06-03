import express from 'express';
import UserReportController from '../controllers/userReportController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Input validation schema for felt reports
const reportSchema = {
  earthquakeId: { required: true, type: 'string' },
  feltIntensity: { 
    required: true, 
    type: 'number', 
    validate: (val) => val >= 1 && val <= 10,
    message: 'Felt intensity must be a number between 1 (not felt) and 10 (extreme).' 
  },
  comments: { required: false, type: 'string' }
};

// Input validation schema for patching felt reports (all fields optional)
const patchReportSchema = {
  feltIntensity: { 
    required: false, 
    type: 'number', 
    validate: (val) => val >= 1 && val <= 10,
    message: 'Felt intensity must be a number between 1 (not felt) and 10 (extreme).' 
  },
  comments: { required: false, type: 'string' }
};

// Protect all routes under this module
router.use(protect);

// Core CRUD endpoints
router.route('/')
  .post(validate(reportSchema), UserReportController.create)
  .get(UserReportController.list);

// Aggregation statistics endpoint
router.route('/earthquake/:earthquakeId/stats')
  .get(UserReportController.getStats);

router.route('/:id')
  .get(UserReportController.getOne)
  .put(UserReportController.update)
  .patch(validate(patchReportSchema), UserReportController.patch)
  .delete(UserReportController.delete);

export default router;