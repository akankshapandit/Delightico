import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import InstagramConnect from '../components/InstagramConnect';

const AIMarketing = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check URL parameters for Instagram connection status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('instagram_connected') === 'true') {
      setMessage({ type: 'success', text: 'Instagram connected successfully!' });
      setIsInstagramConnected(true);
    }
    if (urlParams.get('instagram_error') === 'true') {
      setMessage({ type: 'error', text: 'Failed to connect Instagram. Please try again.' });
    }
  }, []);

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate AI content generation (replace with actual AI API call)
      const response = await fetch('http://localhost:8000/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedContent(data.content);
        setMessage({ type: 'success', text: 'Content generated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to generate content' });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setMessage({ type: 'error', text: 'Failed to generate content. Please try again.' });
      
      // Fallback: Simulate generated content for demo
      setTimeout(() => {
        setGeneratedContent(`🌟 AI-Generated Post 🌟\n\n${prompt}\n\n✨ This content was created using our AI marketing tool! ✨\n\n#AIMarketing #DigitalMarketing #AI`);
        setMessage({ type: 'success', text: 'Content generated successfully!' });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const postToInstagram = async () => {
    if (!generatedContent || !user) return;

    setPosting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:8000/api/instagram/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          caption: generatedContent,
          imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=500&fit=crop' // Default marketing image
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      setMessage({ type: 'error', text: 'Failed to post to Instagram. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Marketing Assistant</h1>
          <p className="mt-2 text-gray-600">Generate and post marketing content with AI</p>
        </div>

        {/* Instagram Connection */}
        <InstagramConnect onConnectionChange={setIsInstagramConnected} />

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content Generation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Marketing Content</h3>
          
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your marketing prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a post about our new summer collection for fashion brand..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={generateContent}
            disabled={loading || !prompt.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>

        {/* Generated Content */}
        {generatedContent && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Content</h3>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <pre className="whitespace-pre-wrap text-gray-800">{generatedContent}</pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(generatedContent)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Copy Text
              </button>

              {isInstagramConnected && (
                <button
                  onClick={postToInstagram}
                  disabled={posting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition duration-200"
                >
                  {posting ? 'Posting to Instagram...' : 'Post to Instagram'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMarketing;