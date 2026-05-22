import express from 'express';
import EarthquakeController from '../controllers/earthquakeController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', EarthquakeController.list);
router.get('/stats', EarthquakeController.getStats);
router.get('/:id', EarthquakeController.getOne);

// Protected routes (Admin-only locks for write/modify actions)
router.post('/', protect, authorize('admin'), EarthquakeController.create);
router.put('/:id', protect, authorize('admin'), EarthquakeController.update);
router.delete('/:id', protect, authorize('admin'), EarthquakeController.delete);

export default router;
