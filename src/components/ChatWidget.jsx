import React, { useState, useEffect, useRef } from 'react';
import chatService from '../services/chat.js';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState('connecting'); // 'connecting', true, false
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('🚀 Initializing chat widget...');
    
    // 🚀 Set connecting state immediately
    setIsConnected('connecting');
    
    // 🚀 Add connecting message immediately
    setMessages([{
      id: 'connecting-' + Date.now(),
      text: 'Connecting to chat service...',
      timestamp: new Date().toISOString(),
      username: 'System',
      isSystem: true
    }]);

    // 🚀 Connection timeout - show offline after 3 seconds
    const connectionTimeout = setTimeout(() => {
      if (isConnected === 'connecting') {
        console.log('⏰ Connection timeout - switching to offline mode');
        setIsConnected(false);
        setMessages([{
          id: 'offline-' + Date.now(),
          text: 'Chat is currently offline. You can still type messages and they will be sent when connected.',
          timestamp: new Date().toISOString(),
          username: 'System',
          isSystem: true
        }]);
      }
    }, 3000);

    try {
      // Initialize chat connection
      const token = localStorage.getItem('token') || 'guest-token';
      const socket = chatService.connect(token);
      
      // Set up user data
      const userData = {
        userId: 'user-' + Date.now(),
        username: 'Customer',
        role: 'customer'
      };

      socket.on('connect', () => {
        console.log('✅ Connected to chat server');
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        chatService.joinChat(userData);
        chatService.joinRoom({ roomId: 'general' });
        
        // Replace connecting message with welcome
        setMessages([{
          id: 'welcome-' + Date.now(),
          text: 'Hello! Welcome to Delightico chat support. How can I help you today?',
          timestamp: new Date().toISOString(),
          username: 'Delightico Support',
          isSystem: true
        }]);
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from chat server');
        clearTimeout(connectionTimeout);
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Chat connection error:', error);
        clearTimeout(connectionTimeout);
        setIsConnected(false);
        
        // Update to offline message
        setMessages([{
          id: 'offline-' + Date.now(),
          text: 'Chat is currently offline. You can still type messages and they will be sent when connected.',
          timestamp: new Date().toISOString(),
          username: 'System',
          isSystem: true
        }]);
      });

      // Listen for incoming messages
      chatService.onMessage((message) => {
        console.log('📨 Received message:', message);
        setMessages(prev => [...prev, {
          id: message.messageId || 'msg-' + Date.now(),
          text: message.message,
          timestamp: message.timestamp,
          username: message.senderName,
          isSystem: message.senderId === 'system'
        }]);
      });

      // Cleanup
      return () => {
        console.log('🧹 Cleaning up chat service...');
        clearTimeout(connectionTimeout);
        chatService.removeAllListeners('receive_message');
        chatService.removeAllListeners('message_sent');
        chatService.disconnect();
      };
    } catch (error) {
      console.error('❌ Chat widget initialization error:', error);
      clearTimeout(connectionTimeout);
      setIsConnected(false);
      setMessages([{
        id: 'offline-' + Date.now(),
        text: 'Chat is currently offline. You can still type messages and they will be sent when connected.',
        timestamp: new Date().toISOString(),
        username: 'System',
        isSystem: true
      }]);
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const messageData = {
      text: inputMessage,
      roomId: 'general',
      timestamp: new Date().toISOString()
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      id: 'temp-' + Date.now(),
      text: inputMessage,
      timestamp: new Date().toISOString(),
      username: 'You'
    }]);

    // Send via chat service
    chatService.sendMessage(messageData);
    setInputMessage('');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>💬</span>
          <span>Chat</span>
          {/* 🚀 Better connection indicator */}
          <span className={`w-2 h-2 rounded-full ${
            isConnected === true ? 'bg-green-400 animate-pulse' : 
            isConnected === 'connecting' ? 'bg-yellow-400 animate-ping' : 
            'bg-red-400'
          }`}></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-green-200">
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Live Chat</h3>
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 text-xs ${
                isConnected === true ? 'text-green-300' : 
                isConnected === 'connecting' ? 'text-yellow-300' : 
                'text-red-300'
              }`}>
                <span>●</span>
                {isConnected === true ? 'Connected' : 
                 isConnected === 'connecting' ? 'Connecting...' : 
                 'Offline'}
              </span>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-green-700 w-6 h-6 rounded-full transition-colors duration-200 flex items-center justify-center text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-center px-4">
                <div className="animate-pulse">
                  <p className="text-sm">Connecting to chat service...</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 p-3 rounded-lg shadow-sm ${
                    message.isSystem
                      ? 'bg-blue-100 text-blue-800 text-sm border border-blue-200'
                      : message.username === 'You'
                      ? 'bg-green-600 text-white ml-4'
                      : 'bg-white text-gray-800 mr-4 border border-gray-200'
                  }`}
                >
                  {message.username === 'System' && message.text.includes('Connecting') ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-blue-700">{message.text}</span>
                    </div>
                  ) : (
                    <>
                      <span className={`font-semibold ${
                        message.username === 'You' 
                          ? 'text-green-100' 
                          : message.isSystem 
                            ? 'text-blue-700'
                            : 'text-green-600'
                      }`}>
                        {message.username}: 
                      </span>
                      {' '}
                      <span className={message.username === 'You' ? 'text-white' : 'text-gray-700'}>
                        {message.text}
                      </span>
                      <span className={`text-xs block mt-1 ${
                        message.username === 'You' ? 'text-green-200' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isConnected === true ? "Type your message..." : 
                  isConnected === 'connecting' ? "Connecting..." : 
                  "Chat is offline - messages will send when connected"
                }
                disabled={isConnected !== true}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isConnected !== true || !inputMessage.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;