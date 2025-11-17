import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `ORD${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    }
  },
  customer: {
    userId: {
      type: String,
      required: true
    },
    email: String,
    name: String
  },
  items: [{
    productId: {
      type: String,
      required: true
    },
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    image: String,
    weight: {
      value: Number,
      unit: String
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'inr'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'payment_failed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: String,
  paymentMethod: String,
  paymentError: String,
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paidAt: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

// Remove the pre-save hook and use default value instead
// The default function will generate orderId automatically

export default mongoose.model('Order', orderSchema);