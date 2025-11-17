import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // CHANGED IMPORT
import { useNavigate } from 'react-router-dom';

const AIPostGenerator = ({ product, onClose }) => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [postStyle, setPostStyle] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');

  console.log('🟢 AIPostGenerator mounted with product:', product);
  console.log('🟢 Current user:', user);

  // If no product, show error
  if (!product) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>No product selected for AI generation.</p>
          <button
            onClick={onClose}
            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

 const generateAIPost = async () => {
  console.log('🟢 Generate AI Post clicked');
  
  // Check if user is logged in
  if (!user) {
    console.log('🔴 No user object found');
    alert('Please login to use AI post generation');
    navigate('/login', { 
      state: { from: '/products' }
    });
    onClose();
    return;
  }

  setLoading(true);
  setGeneratedContent(null);

  try {
    const token = getToken();
    console.log('🟢 User object:', user);
    console.log('🟢 Token from getToken():', token ? `Present (${token.substring(0, 20)}...)` : 'MISSING');
    
    if (!token) {
      console.log('🔴 No token available - redirecting to login');
      alert('Please login again - No token found');
      navigate('/login');
      onClose();
      return;
    }

    console.log('🟢 Making request to:', 'http://localhost:8000/api/ai/generate-post');
    console.log('🟢 Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.substring(0, 20)}...`
    });
    
    const response = await fetch('http://localhost:8000/api/ai/generate-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product: {
          name: product.name,
          brand: product.brand,
          description: product.description,
          features: product.features || ['High quality', 'Natural ingredients', 'Great value'],
          category: product.category || 'general'
        },
        prompt: customPrompt,
        style: postStyle
      }),
    });

    console.log('🟢 Response status:', response.status);
    
    // Rest of your code remains the same...
    console.log('🟢 Response headers:', Object.fromEntries(response.headers.entries()));

    // Check if response is unauthorized
    if (response.status === 401) {
      const errorData = await response.json();
      console.log('🔴 Auth error details:', errorData);
      alert(`Session expired: ${errorData.message}. Please login again.`);
      navigate('/login');
      onClose();
      return;
    }

    if (response.status === 500) {
      const errorData = await response.json();
      console.log('🔴 Server error:', errorData);
      alert('Server error: ' + (errorData.error || 'Please try again later'));
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log('🔴 Response not OK:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }

    const data = await response.json();
    console.log('🟢 Response data:', data);

    if (data.success) {
      setGeneratedContent(data);
      console.log('🟢 Content generated successfully');
    } else {
      alert(data.error || 'Failed to generate content');
    }
  } catch (error) {
    console.error('🔴 AI generation error:', error);
    if (error.message.includes('Failed to fetch')) {
      alert('Cannot connect to backend server. Make sure it\'s running on port 8000.');
    } else {
      alert('Failed to generate content: ' + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            AI Post Generator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          {user ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-800 text-sm">
                Logged in as: <strong>{user.email}</strong>
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Please login</strong> to generate AI content
              </p>
            </div>
          )}

          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Generating content for:</h3>
            <p className="text-lg text-gray-900 font-medium">{product.name}</p>
            <p className="text-sm text-gray-600">{product.brand}</p>
            {product.description && (
              <p className="text-sm text-gray-500 mt-2">{product.description}</p>
            )}
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Post Style:
            </label>
            <div className="flex gap-3 flex-wrap">
              {['professional', 'casual', 'creative'].map((style) => (
                <button
                  key={style}
                  onClick={() => setPostStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                    postStyle === style
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="mb-6">
            <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Instructions (Optional):
            </label>
            <textarea
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., Make it more exciting, focus on summer vibes, add emojis, etc."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateAIPost}
            disabled={loading || !user}
            className={`w-full text-white py-3 px-6 rounded-lg transition duration-200 font-semibold mb-6 ${
              user 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating AI Content...
              </div>
            ) : user ? (
              'Generate AI Content'
            ) : (
              'Please Login to Generate'
            )}
          </button>

          {/* Generated Content */}
          {generatedContent && (
            <div className="border-t border-gray-200 pt-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Content</h3>
              
              {/* Content */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                <pre className="whitespace-pre-wrap text-gray-800 text-sm font-sans">
                  {generatedContent.content}
                </pre>
              </div>

              {/* Hashtags */}
              {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Hashtags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Suggestions */}
              {generatedContent.imageSuggestions && generatedContent.imageSuggestions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Image Suggestions:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {generatedContent.imageSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const textToCopy = generatedContent.content + 
                      (generatedContent.hashtags ? '\n\n' + generatedContent.hashtags.join(' ') : '');
                    copyToClipboard(textToCopy);
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200 font-medium"
                >
                  Copy Text
                </button>
                <button
                  onClick={() => {
                    setGeneratedContent(null);
                    setCustomPrompt('');
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 font-medium"
                >
                  Generate New
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Tips */}
          {!generatedContent && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>💡 Tip: Add specific instructions for better results!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPostGenerator;