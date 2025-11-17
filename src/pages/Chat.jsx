// Enhanced mock chat service with guaranteed responses
class ChatService {
  constructor() {
    this.isConnected = true;
    this.messageCallback = null;
  }

  connect(token) {
    console.log('Chat Service: Connected with token', token);
    
    // Simulate successful connection
    setTimeout(() => {
      if (this.messageCallback) {
        this.messageCallback({
          text: "Hello! I'm your Delightico assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
          username: 'Delightico Support',
          type: 'system'
        });
      }
    }, 500);
    
    return {
      on: (event, callback) => {
        if (event === 'connect') {
          setTimeout(callback, 100);
        }
      },
      emit: (event, data) => {
        console.log('Emitting:', event, data);
        
        if (event === 'send_message') {
          // Always generate a response
          setTimeout(() => {
            if (this.messageCallback) {
              const response = this.generateResponse(data.text);
              this.messageCallback({
                text: response,
                timestamp: new Date().toISOString(),
                username: 'Delightico Support',
                isResponse: true
              });
            }
          }, 1000);
        }
      }
    };
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Product inquiries
    if (message.includes('product') || message.includes('item') || message.includes('buy')) {
      return "We offer organic Ragi Malt, Moringa Powder, Gun Powder, Herbal Teas, and healthy snacks. All are 100% natural and chemical-free!";
    }
    
    if (message.includes('ragi')) {
      return "Our Ragi products are rich in calcium and perfect for diabetes management. We have Ragi Malt and Ragi Cookies available!";
    }
    
    if (message.includes('moringa')) {
      return "Moringa is a superfood! We offer Moringa Powder, Moringa Tea, and Moringa Chocolate - all packed with nutrients and antioxidants.";
    }
    
    // Website info
    if (message.includes('website') || message.includes('delightico') || message.includes('about')) {
      return "Delightico is an organic food company dedicated to providing healthy, natural products. We focus on quality and customer wellness!";
    }
    
    // Pricing
    if (message.includes('price') || message.includes('cost')) {
      return "Our prices are competitive and vary by product. Check our product pages for detailed pricing. We offer free shipping on orders above ₹500!";
    }
    
    // Shipping
    if (message.includes('shipping') || message.includes('delivery')) {
      return "Free shipping on orders above ₹500. For smaller orders, shipping is ₹50. We deliver across India in 3-5 business days.";
    }
    
    // Default responses
    const responses = [
      "I'd love to help! We specialize in organic foods. What would you like to know about our products?",
      "Thanks for your message! How can I assist you with our organic products today?",
      "That's a great question! We offer various organic products. Would you like to know about ragi, moringa, or our herbal teas?",
      "I'm here to help! We have healthy organic options for every need. What interests you most?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  joinChat(userData) {
    console.log('User joined:', userData);
  }

  sendMessage(messageData) {
    console.log('Sending message:', messageData);
    // The response will be triggered in the connect method's emit handler
  }

  joinRoom(roomData) {
    console.log('Joining room:', roomData);
  }

  onMessage(callback) {
    this.messageCallback = callback;
    console.log('Message callback registered');
  }

  onUserJoined(callback) {
    // Mock implementation
    this.userJoinedCallback = callback;
  }

  onUserLeft(callback) {
    // Mock implementation
    this.userLeftCallback = callback;
  }

  removeAllListeners(event) {
    console.log('Removing listeners for:', event);
  }

  disconnect() {
    console.log('Disconnecting chat service');
    this.isConnected = false;
  }
}

export default new ChatService();