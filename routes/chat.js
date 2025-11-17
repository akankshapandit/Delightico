import express from 'express';
import {
  getRoomMessages,
  createSupportTicket,
  getSupportTickets,
  updateTicketStatus
} from '../controllers/chatController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Message routes
router.get('/messages/:room', getRoomMessages);

// Support ticket routes
router.post('/support-ticket', createSupportTicket);
router.get('/support-tickets', getSupportTickets);
router.put('/support-tickets/:ticketId/status', authorize('admin'), updateTicketStatus);

export default router;