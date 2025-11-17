import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  room: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  // For customer support
  isSupportTicket: {
    type: Boolean,
    default: false
  },
  ticketStatus: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  // Read receipts
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);