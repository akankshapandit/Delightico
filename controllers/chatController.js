import Message from '../models/Message.js';
import asyncHandler from 'express-async-handler';
import WebSocketService from '../services/websocketService.js';

// @desc    Get chat messages for a room
// @route   GET /api/chat/messages/:room
// @access  Private
export const getRoomMessages = asyncHandler(async (req, res) => {
  const { room } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const skip = (page - 1) * limit;

  const messages = await Message.find({ room })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('senderId', 'name email avatar')
    .populate('productId', 'name images');

  // Mark messages as read by current user
  await Message.updateMany(
    { 
      room, 
      'readBy.userId': { $ne: req.user.id } 
    },
    {
      $push: {
        readBy: {
          userId: req.user.id,
          readAt: new Date()
        }
      }
    }
  );

  res.json({
    success: true,
    data: messages.reverse(), // Return in chronological order
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: await Message.countDocuments({ room })
    }
  });
});

// @desc    Create a support ticket
// @route   POST /api/chat/support-ticket
// @access  Private
export const createSupportTicket = asyncHandler(async (req, res) => {
  const { message, productId } = req.body;

  const supportRoom = `support_${req.user.id}_${Date.now()}`;

  const messageData = {
    messageId: `ticket_${Date.now()}`,
    room: supportRoom,
    senderId: req.user.id,
    senderName: req.user.name,
    message,
    messageType: 'text',
    productId,
    isSupportTicket: true,
    ticketStatus: 'open'
  };

  const savedMessage = await Message.create(messageData);

  // Notify admins about new support ticket
  WebSocketService.sendToRoom('admin_room', 'new_support_ticket', {
    ticket: savedMessage,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    }
  });

  res.status(201).json({
    success: true,
    message: 'Support ticket created successfully',
    data: {
      ticket: savedMessage,
      room: supportRoom
    }
  });
});

// @desc    Get user's support tickets
// @route   GET /api/chat/support-tickets
// @access  Private
export const getSupportTickets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (page - 1) * limit;

  let filter = { isSupportTicket: true };
  
  if (req.user.role === 'admin') {
    // Admin can see all tickets
    if (status) filter.ticketStatus = status;
  } else {
    // Users can only see their own tickets
    filter.senderId = req.user.id;
    if (status) filter.ticketStatus = status;
  }

  const tickets = await Message.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('senderId', 'name email')
    .populate('productId', 'name images');

  res.json({
    success: true,
    data: tickets,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: await Message.countDocuments(filter)
    }
  });
});

// @desc    Update ticket status
// @route   PUT /api/chat/support-tickets/:ticketId/status
// @access  Private/Admin
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  const ticket = await Message.findOne({ 
    messageId: ticketId, 
    isSupportTicket: true 
  });

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Support ticket not found'
    });
  }

  ticket.ticketStatus = status;
  await ticket.save();

  // Notify user about status change
  WebSocketService.sendNotificationToUser(ticket.senderId.toString(), {
    type: 'ticket_status_update',
    ticketId: ticket.messageId,
    status: status,
    message: `Your support ticket status has been updated to ${status}`
  });

  res.json({
    success: true,
    message: 'Ticket status updated successfully',
    data: ticket
  });
});