import Stripe from 'stripe';
import Order from '../models/Order.js';
import Conversation from '../models/Conversation.js';

// 🚀 Load environment variables at module level
import dotenv from 'dotenv';
dotenv.config();

class PaymentService {
  constructor() {
    console.log('🔧 Initializing PaymentService...');
    
    // 🚀 Debug: Check all environment variables
    console.log('🔍 Environment Check:');
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('STRIPE_PUBLISHABLE_KEY exists:', !!process.env.STRIPE_PUBLISHABLE_KEY);
    console.log('STRIPE_WEBHOOK_SECRET exists:', !!process.env.STRIPE_WEBHOOK_SECRET);
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY is missing from environment variables');
      console.error('❌ Current working directory:', process.cwd());
      console.error('❌ Available env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
      throw new Error('Stripe secret key is required');
    }

    console.log('🔑 Stripe key found:', stripeSecretKey.substring(0, 20) + '...');

    try {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16'
      });
      console.log('✅ Stripe initialized successfully');
    } catch (error) {
      console.error('❌ Stripe initialization failed:', error.message);
      throw error;
    }
  }

  // Create payment intent
  async createPaymentIntent(orderData) {
    try {
      const { amount, currency = 'inr', metadata = {} } = orderData;

      console.log(`💰 Creating payment intent for amount: ${amount} ${currency}`);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata: {
          ...metadata,
          integration_check: 'accept_a_payment',
          timestamp: new Date().toISOString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log(`✅ Payment intent created: ${paymentIntent.id}`);
      console.log(`✅ Client secret: ${paymentIntent.client_secret.substring(0, 20)}...`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      };
    } catch (error) {
      console.error('❌ Stripe payment intent error:', error);
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  // Handle webhook events
  async handleWebhook(payload, signature) {
    try {
      console.log('🔔 Webhook received - Verifying signature...');
      
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is missing from environment variables');
      }

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      console.log(`🔔 Stripe webhook: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        
        default:
          console.log(`🔔 Unhandled event type: ${event.type}`);
      }

      console.log('✅ Webhook processed successfully');
      return { received: true };

    } catch (error) {
      console.error('❌ Webhook error:', error.message);
      throw new Error(`Webhook handler failed: ${error.message}`);
    }
  }

  // Handle successful payment
  async handlePaymentSuccess(paymentIntent) {
    try {
      console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
      console.log(`💰 Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency}`);
      
      // Create order in database
      const order = await Order.create({
        orderId: `ORD${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
        customer: {
          userId: paymentIntent.metadata.userId || 'guest',
          email: paymentIntent.metadata.email || 'test@example.com'
        },
        items: [{
          productId: paymentIntent.metadata.productId || 'test_product',
          name: 'Test Product',
          price: paymentIntent.amount / 100,
          quantity: 1
        }],
        totalAmount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'confirmed',
        paymentStatus: 'completed',
        paymentIntentId: paymentIntent.id,
        paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
        paidAt: new Date()
      });

      console.log(`✅ Order saved to database: ${order.orderId}`);

      // Save success message to chat
      const message = await Conversation.create({
        messageId: `msg_${Date.now()}`,
        room: 'general',
        senderId: 'system',
        senderName: 'Payment System',
        message: `Payment of ${paymentIntent.amount / 100} ${paymentIntent.currency} completed successfully! Order ID: ${order.orderId}`,
        messageType: 'system',
        isAutoResponse: true
      });

      console.log('✅ Message saved to database');

      return order;

    } catch (error) {
      console.error('❌ Error handling payment success:', error);
    }
  }

  // Handle failed payment
  async handlePaymentFailure(paymentIntent) {
    try {
      console.log(`❌ Payment failed: ${paymentIntent.id}`);
      
      const order = await Order.create({
        orderId: `ORD${Date.now()}`,
        customer: {
          userId: paymentIntent.metadata.userId || 'guest',
          email: paymentIntent.metadata.email || 'test@example.com'
        },
        items: [{
          productId: paymentIntent.metadata.productId || 'test_product',
          name: 'Test Product',
          price: paymentIntent.amount / 100,
          quantity: 1
        }],
        totalAmount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'payment_failed',
        paymentStatus: 'failed',
        paymentIntentId: paymentIntent.id,
        paymentError: paymentIntent.last_payment_error?.message || 'Payment failed'
      });

      console.log(`✅ Failed order saved: ${order.orderId}`);

    } catch (error) {
      console.error('❌ Error handling payment failure:', error);
    }
  }
}

export default new PaymentService();