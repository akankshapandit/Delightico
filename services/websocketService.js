import { Server } from 'socket.io';
import Message from '../models/Conversation.js';

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
    console.log('🚀 WebSocket service initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 User connected: ${socket.id}`);

      // User authentication and joining
      socket.on('user_join', (userData) => {
        this.handleUserJoin(socket, userData);
      });

      // Send message
      socket.on('send_message', (messageData) => {
        this.handleSendMessage(socket, messageData);
      });

      // Join specific room (product support, admin, etc.)
      socket.on('join_room', (roomData) => {
        this.handleJoinRoom(socket, roomData);
      });

      // Typing indicators
      socket.on('typing_start', (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing_stop', (data) => {
        this.handleTypingStop(socket, data);
      });

      // User disconnect
      socket.on('disconnect', () => {
        this.handleUserDisconnect(socket);
      });
    });
  }

  handleUserJoin(socket, userData) {
    const { userId, userName, role } = userData;
    
    this.connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.userName = userName;
    socket.role = role;

    // Join user to their personal room for notifications
    socket.join(`user_${userId}`);
    
    // Admin users join admin room
    if (role === 'admin') {
      socket.join('admin_room');
    }

    console.log(`👤 User ${userName} (${userId}) joined chat`);
    
    // Notify about user online status
    socket.broadcast.emit('user_online', { userId, userName });
  }

  // Add this to your existing handleSendMessage method in backend:
// Add this to your handleSendMessage method
// Add this to your handleSendMessage method
handleSendMessage(socket, messageData) {
  const { room, message, messageType = 'text', productId } = messageData;
  
  const messageWithMetadata = {
    ...messageData,
    senderId: socket.userId,
    senderName: socket.userName,
    timestamp: new Date().toISOString(),
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  console.log(`💬 Message from ${socket.userName} in ${room}:`, message);

  // Save message to database
  this.saveMessageToDatabase(messageWithMetadata);

  // Send to room
  if (room) {
    socket.to(room).emit('receive_message', messageWithMetadata);
  } else {
    // If no room specified, send to admin room for customer support
    socket.to('admin_room').emit('receive_message', messageWithMetadata);
  }

  // Also send back to sender for confirmation
  socket.emit('message_sent', messageWithMetadata);

  // AUTO-RESPONSE FOR CUSTOMERS
  // If message is from customer, send auto-response after 1 second
  if (socket.role === 'customer') {
    setTimeout(() => {
      this.sendAutoResponse(socket, room || 'general', message);
    }, 1000);
  }
}

// Add these methods to your WebSocketService class
sendAutoResponse(socket, room, userMessage) {
  const response = this.generateAIResponse(userMessage);
  
  const autoResponse = {
    messageId: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    room: room,
    message: response,
    messageType: 'text',
    senderId: 'system',
    senderName: 'Delightico Support',
    timestamp: new Date().toISOString(),
    isAutoResponse: true
  };

  // Send to the user who sent the message
  socket.emit('receive_message', autoResponse);
  
  // Also save the auto-response to database
  this.saveMessageToDatabase(autoResponse);
}

generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to Delightico. I'm here to help you with our organic products. How can I assist you today?";
  }
  
  // Products
  if (message.includes('product') || message.includes('item') || message.includes('buy')) {
    return "We offer a wide range of organic products including Ragi Malt, Moringa Powder, Gun Powder, Herbal Teas, and healthy snacks. All are 100% natural and chemical-free!";
  }
  
  // Ragi
  if (message.includes('ragi')) {
    return "Our ragi products are rich in calcium and perfect for diabetes management. We have Ragi Malt for instant nutrition and Ragi Cookies for healthy snacking!";
  }
  
  // Moringa
  if (message.includes('moringa')) {
    return "Moringa is a superfood! We offer Moringa Powder, Moringa Tea, and Moringa Chocolate - all packed with nutrients, antioxidants, and vitamins.";
  }
  
  // Prices
  if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
    return "Our prices are competitive and we offer free shipping on orders above ₹500! You can check individual product pages for detailed pricing.";
  }
  
  // Shipping
  if (message.includes('shipping') || message.includes('delivery')) {
    return "Free shipping on orders above ₹500. For orders below ₹500, shipping charge is ₹50. We deliver across India in 3-5 business days.";
  }
  
  // Website
  if (message.includes('website') || message.includes('delightico') || message.includes('about')) {
    return "Delightico is an organic food company dedicated to providing healthy, natural products. We focus on quality, purity, and customer wellness!";
  }
  
  // Contact
  if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
    return "You can reach us at support@delightico.com or call +91-9876543210. Our support team is available Monday to Saturday, 9 AM to 6 PM.";
  }
  
  // Default response
  const defaultResponses = [
    "Thanks for your message! How can I help you with our organic products today?",
    "I'd love to assist you! We specialize in organic foods. What would you like to know?",
    "That's a great question! We offer various healthy products. Would you like to know about ragi, moringa, or our herbal teas?",
    "I'm here to help! We have healthy organic options for every need. What interests you most?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
  handleJoinRoom(socket, roomData) {
    const { room, productId } = roomData;
    
    if (room) {
      socket.join(room);
      console.log(`🚪 ${socket.userName} joined room: ${room}`);
      
      socket.emit('room_joined', { room, success: true });
      socket.emit("joined_room_info",{room,productId})
      // Notify others in the room
      socket.to(room).emit('user_joined_room', { 
        userId: socket.userId, 
        userName: socket.userName,
        room 
      });
    }
  }

  handleTypingStart(socket, data) {
    const { room } = data;
    socket.to(room).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName,
      typing: true
    });
  }

  handleTypingStop(socket, data) {
    const { room } = data;
    socket.to(room).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName,
      typing: false
    });
  }

  handleUserDisconnect(socket) {
    if (socket.userId) {
      this.connectedUsers.delete(socket.userId);
      
      console.log(`👋 User disconnected: ${socket.userName}`);
      
      // Notify about user offline status
      socket.broadcast.emit('user_offline', { 
        userId: socket.userId, 
        userName: socket.userName 
      });
    }
  }

  // In your backend websocketService.js
async saveMessageToDatabase(messageData) {
  try {
    const mongoose = await import('mongoose');
    
    // 🚀 FIX: Handle different senderId types
    let senderId;
    
    if (messageData.senderId === 'system' || messageData.senderId === 'support-bot') {
      // For system/support messages, use a fixed ObjectId
      senderId = new mongoose.Types.ObjectId('000000000000000000000001');
    } else if (mongoose.Types.ObjectId.isValid(messageData.senderId)) {
      // If it's already a valid ObjectId, use it
      senderId = new mongoose.Types.ObjectId(messageData.senderId);
    } else {
      // For string IDs, generate a new ObjectId
      senderId = new mongoose.Types.ObjectId();
      console.log(`🔄 Converted string ID "${messageData.senderId}" to ObjectId: ${senderId}`);
    }

    const message = await Message.create({
      messageId: messageData.messageId || `msg_${Date.now()}`,
      room: messageData.room || 'general',
      senderId: senderId, // 🚀 Now always valid ObjectId
      senderName: messageData.senderName || 'Customer',
      message: messageData.message,
      messageType: messageData.messageType || 'text',
      productId: messageData.productId || null,
      isAutoResponse: messageData.isAutoResponse || false
    });

    console.log('✅ Message saved to database:', message.messageId);
    return message;

  } catch (error) {
    console.error('❌ Error saving message to database:', error);
    
    // 🚀 TEMPORARY FIX: Return message data without saving to keep chat working
    console.log('🔄 Bypassing database save to keep chat functional');
    return {
      ...messageData,
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

  // Utility method to send notifications
  sendNotificationToUser(userId, notification) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
    }
  }

  // Utility method to send to room
  sendToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  // Utility method to send to all connected clients
  broadcast(event, data) {
    this.io.emit(event, data);
  }
}

export default new WebSocketService();