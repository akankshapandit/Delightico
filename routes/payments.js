import express from 'express';
import { testPayment, confirmPayment, getPaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test payment endpoint
router.post('/test-payment', protect, testPayment);

// Confirm payment
router.post('/confirm-payment', protect, confirmPayment);

// Get payment status
router.get('/status/:orderId', protect, getPaymentStatus);

export default router;