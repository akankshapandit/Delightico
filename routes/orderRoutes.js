import express from 'express';
import { getOrderById, getUserOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's orders
router.get('/user-orders', protect, getUserOrders);

// Get specific order by ID
router.get('/:orderId', protect, getOrderById);

export default router;