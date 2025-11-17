import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async generateMarketingContent(productData) {
    try {
      const prompt = `
        You are an expert marketing copywriter for HEALTH FOOD PRODUCTS. Create compelling marketing content for this product:

        PRODUCT INFORMATION:
        - Name: ${productData.name}
        - Description: ${productData.description}
        - Category: ${productData.category}
        - Price: ₹${productData.price}
        - Ingredients: ${productData.ingredients?.join(', ') || 'Not specified'}
        - Tags: ${productData.tags?.join(', ') || 'Not specified'}

        Please generate INDIAN-ORIENTED marketing content in JSON format:

        1. "marketingDescription": A compelling Indian-style marketing description (2-3 paragraphs)
        2. "seoKeywords": 8-10 relevant SEO keywords for Indian market as array
        3. "uniqueSellingPoints": 3-5 unique selling points focusing on health benefits as array
        4. "socialMediaPosts": Object with posts for different platforms:
           - "instagram": A compelling Instagram post with Indian context and emojis
           - "twitter": A short, engaging Twitter post
           - "facebook": A detailed Facebook post for Indian audience
        5. "targetAudience": Description of ideal Indian target audience
        6. "healthBenefits": 4-6 health benefits specific to Indian consumers as array
        7. "recipeSuggestions": 2-3 Indian recipe suggestions using this product as array
        8. "hashtags": 10-15 relevant hashtags for Indian market as array

        Make the content engaging, persuasive, and tailored to INDIAN consumers focusing on health benefits.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2000
      });

      const content = completion.choices[0].message.content;
      
      // Clean and parse the JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // If JSON parsing fails, return a fallback structure
        return {
          marketingDescription: content,
          seoKeywords: ["healthy food", "natural products", "Indian nutrition"],
          uniqueSellingPoints: ["100% Natural", "Health Benefits", "Great Taste"],
          socialMediaPosts: {
            instagram: "🌟 Discover amazing health benefits! 🌟",
            twitter: "Great product for healthy living!",
            facebook: "Amazing health product now available!"
          },
          targetAudience: "Health-conscious consumers",
          healthBenefits: ["Boosts energy", "Improves health", "Natural goodness"],
          recipeSuggestions: ["Enjoy with milk", "Mix with smoothies"],
          hashtags: ["#Healthy", "#Natural", "#Goodness"]
        };
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate marketing content: ${error.message}`);
    }
  }
}