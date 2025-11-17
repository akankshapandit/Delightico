import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userData = null;
  }
  connect(token) {
  // Use import.meta.env for Vite instead of process.env
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  
  console.log('🚀 Connecting to:', backendUrl);
  
  // 🚀 ADD CONNECTION TIMEOUT
  this.socket = io(backendUrl, {
    auth: {
      token: token || 'guest-token'
    },
    transports: ['websocket', 'polling'],
    timeout: 5000, // 5 second timeout
    forceNew: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000
  });

  // 🚀 CONNECTION TIMEOUT HANDLER
  const connectionTimeout = setTimeout(() => {
    if (!this.isConnected) {
      console.log('⏰ Connection timeout - using offline mode');
      this.isConnected = false;
      socket.disconnect();
    }
  }, 5000);

  this.socket.on('connect', () => {
    clearTimeout(connectionTimeout);
    console.log('✅ Connected to chat server');
    this.isConnected = true;
    
    // Join with user data after connection
    if (this.userData) {
      this.joinChat(this.userData);
    }
  });

  this.socket.on('disconnect', () => {
    console.log('❌ Disconnected from chat server');
    this.isConnected = false;
  });

  this.socket.on('connect_error', (error) => {
    clearTimeout(connectionTimeout);
    console.error('❌ Socket connection error:', error.message);
    this.isConnected = false;
  });

  this.socket.on('connect_timeout', () => {
    console.log('⏰ Connection timeout');
    this.isConnected = false;
  });

  return this.socket;
}

  // 🔧 ADD THIS METHOD FOR OBJECTID GENERATION
generateObjectId() {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const objectId = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/x/g, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).substring(0, 24);
  return objectId;
}

joinChat(userData) {
  this.userData = userData;
  if (this.socket && this.isConnected) {
    // 🚀 USE VALID OBJECTID FORMAT
    const userId = userData.userId || this.generateObjectId();
    console.log('👤 Joining chat with ID:', userId);
    
    this.socket.emit('user_join', {
      userId: userId, // Now valid 24-character hex string
      userName: userData.username || 'Customer',
      role: userData.role || 'customer'
    });
  }
}

sendMessage(messageData) {
  if (this.socket && this.isConnected) {
    // 🚀 INCLUDE SENDER INFO WITH VALID OBJECTID
    this.socket.emit('send_message', {
      room: messageData.roomId || 'general',
      message: messageData.text,
      messageType: 'text',
      productId: messageData.productId || null,
      senderId: this.userData?.userId || this.generateObjectId(), // Include valid ObjectId
      senderName: this.userData?.username || 'Customer'
    });
  }
}

  joinRoom(roomData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', {
        room: roomData.roomId || 'general',
        productId: roomData.productId || null
      });
    }
  }

  // Listen for incoming messages
  onMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  // Listen for message sent confirmation
  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', callback);
    }
  }

  // Listen for user join events
  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user_joined_room', callback);
    }
  }

  // Listen for user online status
  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  // Typing indicators
  startTyping(room = 'general') {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { room });
    }
  }

  stopTyping(room = 'general') {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { room });
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new ChatService();