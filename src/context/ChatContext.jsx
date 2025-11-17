import React, { useState, useEffect, useRef } from 'react';
import chatService from '../services/chatService';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = 'demo-token-' + Date.now();
    
    console.log('Initializing chat service...');
    
    const socket = chatService.connect(token);
    
    socket.on('connect', () => {
      console.log('Chat: Connected to server');
      setIsConnected(true);
      
      chatService.joinRoom({ roomId: 'general' });
      chatService.joinChat({
        username: 'Customer',
        userId: 'user-' + Date.now()
      });

      // Add welcome message only if no messages exist
      setMessages(prev => {
        if (prev.length === 0) {
          return [{
            id: 'welcome',
            type: 'system',
            text: 'Welcome to Delightico Chat! Our support team is here to help. Ask me about our products, prices, or anything else!',
            timestamp: new Date().toISOString(),
            username: 'Delightico Support'
          }];
        }
        return prev;
      });
    });

    socket.on('disconnect', () => {
      console.log('Chat: Disconnected from server');
      setIsConnected(false);
    });

    // Set up message listeners
    chatService.onMessage((message) => {
      console.log('Chat: Received message', message);
      setMessages(prev => [...prev, {
        ...message,
        id: Date.now() + Math.random() // Unique ID
      }]);
    });

    // Cleanup
    return () => {
      console.log('Cleaning up chat service...');
      chatService.removeAllListeners('receive_message');
      chatService.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const messageData = {
      text: inputMessage,
      roomId: 'general',
      timestamp: new Date().toISOString(),
      username: 'You'
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      ...messageData,
      id: 'user-' + Date.now()
    }]);

    // Send via chat service (AI response will come automatically)
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
          {!isConnected && (
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
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
                isConnected ? 'text-green-300' : 'text-red-300'
              }`}>
                <span>●</span>
                {isConnected ? 'Connected' : 'Disconnected'}
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
                  <p className="text-sm">Connecting to chat...</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 p-3 rounded-lg shadow-sm transition-all duration-200 ${
                    message.type === 'system'
                      ? 'bg-blue-100 text-blue-800 text-sm border border-blue-200'
                      : message.username === 'You'
                      ? 'bg-green-600 text-white ml-4'
                      : 'bg-white text-gray-800 mr-4 border border-gray-200'
                  }`}
                >
                  {message.type !== 'system' && message.username !== 'You' && (
                    <span className="font-semibold text-green-600">
                      {message.username}: 
                    </span>
                  )}
                  {message.type !== 'system' && message.username === 'You' && (
                    <span className="font-semibold text-green-100">
                      {message.username}: 
                    </span>
                  )}
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
                placeholder="Ask about products, prices, shipping..."
                disabled={!isConnected}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!isConnected || !inputMessage.trim()}
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