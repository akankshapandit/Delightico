import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const InstagramConnect = ({ onConnectionChange }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  // Check Instagram connection status
  useEffect(() => {
    const checkInstagramStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`http://localhost:8000/api/instagram/status/${user.id}`);
        const data = await response.json();
        
        setIsConnected(data.connected);
        if (onConnectionChange) {
          onConnectionChange(data.connected);
        }
      } catch (error) {
        console.error('Error checking Instagram status:', error);
      } finally {
        setStatusLoading(false);
      }
    };

    checkInstagramStatus();
  }, [user, onConnectionChange]);

  const connectInstagram = () => {
    if (!user) return;
    
    setLoading(true);
    // Redirect to Instagram authorization
    window.location.href = `http://localhost:8000/api/instagram/auth?userId=${user.id}`;
  };

  const disconnectInstagram = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/instagram/disconnect/${user.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsConnected(false);
        if (onConnectionChange) {
          onConnectionChange(false);
        }
      }
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Instagram Integration</h3>
      
      {isConnected ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">IG</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Instagram Connected</p>
              <p className="text-sm text-gray-600">Ready to post your AI-generated content</p>
            </div>
          </div>
          <button
            onClick={disconnectInstagram}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">IG</span>
          </div>
          <p className="text-gray-600 mb-4">Connect your Instagram account to automatically post AI-generated content</p>
          <button
            onClick={connectInstagram}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition duration-200 font-medium"
          >
            {loading ? 'Connecting...' : 'Connect Instagram'}
          </button>
        </div>
      )}
    </div>
  );
};

export default InstagramConnect;