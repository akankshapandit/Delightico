// import { AIService } from '../services/openaiService.js';
import { MockAIService as AIService } from '../services/mockAIService.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Generate AI marketing content for product
// @route   POST /api/ai/products/:id/generate-content
// @access  Private/Admin
export const generateMarketingContent = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Generate AI content
  const aiContent = await AIService.generateMarketingContent({
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    tags: product.tags,
    ingredients: product.ingredients
  });

  // Update product with AI content
  product.aiMarketing = {
    generatedDescription: aiContent.marketingDescription,
    marketingCopy: aiContent.marketingDescription,
    seoKeywords: aiContent.seoKeywords,
    socialMediaPosts: [
      {
        platform: 'instagram',
        content: aiContent.socialMediaPosts?.instagram || '',
        hashtags: aiContent.hashtags || []
      },
      {
        platform: 'twitter',
        content: aiContent.socialMediaPosts?.twitter || '',
        hashtags: aiContent.hashtags || []
      },
      {
        platform: 'facebook',
        content: aiContent.socialMediaPosts?.facebook || '',
        hashtags: aiContent.hashtags || []
      }
    ],
    targetAudience: aiContent.targetAudience,
    uniqueSellingPoints: aiContent.uniqueSellingPoints,
    healthBenefits: aiContent.healthBenefits,
    recipeSuggestions: aiContent.recipeSuggestions,
    lastGenerated: new Date()
  };

  await product.save();

  res.json({
    success: true,
    message: 'AI marketing content generated successfully',
    data: {
      product: product,
      aiContent: aiContent
    }
  });
});

// @desc    Get AI insights for product
// @route   GET /api/ai/products/:id/insights
// @access  Private/Admin
export const getProductInsights = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: {
      productId: product._id,
      aiMarketing: product.aiMarketing,
      analytics: {
        views: product.views,
        conversions: product.conversions
      }
    }
  });
});