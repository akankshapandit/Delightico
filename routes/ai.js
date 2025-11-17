import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Add this test route first
router.get('/test', protect, (req, res) => {
  res.json({
    success: true,
    message: 'AI route is working!',
    user: req.user
  });
});

// Main AI generation route
router.post('/generate-post', protect, async (req, res) => {
  try {
    console.log('🟢 AI Generation Request Received');
    console.log('🟢 User:', req.user?.email);
    console.log('🟢 Request body:', req.body);

    const { product, prompt, style } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        error: 'Product information is required'
      });
    }

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate AI content
    const aiContent = generateAIContent(product, prompt, style);

    res.json({
      success: true,
      content: aiContent,
      hashtags: generateHashtags(product),
      imageSuggestions: generateImageSuggestions(product),
      generatedBy: req.user?.email
    });

  } catch (error) {
    console.error('🔴 AI generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content'
    });
  }
});

// Helper functions
function generateAIContent(product, prompt, style = 'professional') {
  const productName = product?.name || 'This product';
  const brand = product?.brand || '';
  const description = product?.description || 'An amazing product you will love!';
  const features = product?.features || ['High-quality', 'Excellent design', 'Great value'];

  const styles = {
    professional: `🌟 Introducing ${productName} ${brand ? `from ${brand}` : ''} 🌟

${description}

✨ Key Features:
• ${features[0]}
• ${features[1]} 
• ${features[2]}

Perfect for your needs! 🎯`,

    casual: `OMG, you guys! 😍 Just discovered ${productName} ${brand ? `by ${brand}` : ''}!

${description}

Why I love it:
✅ ${features[0]}
✅ ${features[1]}
✅ ${features[2]}

So obsessed! 💫`,

    creative: `🎨✨ Meet ${productName} - where innovation meets style! ${brand ? `\nBy ${brand}` : ''}

"${description}"

What makes it special:
🎭 ${features[0]}
🎭 ${features[1]}
🎭 ${features[2]}

Elevate your experience! 🚀`
  };

  const baseContent = styles[style] || styles.professional;
  
  if (prompt) {
    return `${baseContent}\n\nCustom: ${prompt}`;
  }
  
  return baseContent;
}

function generateHashtags(product) {
  const baseTags = ['#newarrival', '#musthave', '#quality'];
  const nameTags = product?.name ? product.name.toLowerCase().split(' ').map(word => `#${word}`) : [];
  const brandTags = product?.brand ? [`#${product.brand.toLowerCase()}`] : [];
  
  return [...baseTags, ...nameTags.slice(0, 2), ...brandTags].slice(0, 6);
}

function generateImageSuggestions(product) {
  const productName = product?.name || 'product';
  return [
    `Professional product shot of ${productName}`,
    `Lifestyle image showing ${productName} in use`,
    `Close-up details of ${productName}`,
    `Creative flat lay with ${productName}`
  ];
}

export default router;