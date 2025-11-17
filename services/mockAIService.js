export class MockAIService {
  static async generateMarketingContent(productData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`🤖 Generating AI content for: ${productData.name}`);
    
    return {
      marketingDescription: `Discover the amazing ${productData.name}! ${productData.description} This premium health product is crafted with traditional Indian wisdom and 100% natural ingredients. Perfect for health-conscious Indian families seeking authentic nutrition and wellness solutions that align with our rich culinary heritage.`,
      
      seoKeywords: [
        `${productData.name.toLowerCase()} buy online`,
        "healthy food india",
        "natural products delivery",
        "ayurvedic nutrition",
        "Indian wellness products",
        "organic food online",
        "traditional health foods",
        "natural supplements india"
      ],
      
      uniqueSellingPoints: [
        "100% Natural & Authentic Ingredients",
        "Rich in Traditional Indian Nutrition", 
        "Perfect for All Age Groups - Kids to Elders",
        "Great Taste with Proven Health Benefits",
        "Made with Time-Tested Traditional Recipes"
      ],
      
      socialMediaPosts: {
        instagram: `🌟 नमस्ते! Discover ${productData.name}! 🌟\n\n${productData.description}\n\n💚 Perfect for your family's health and wellness journey!\n\n✨ 100% Natural ✨ Traditional Goodness ✨\n\n🏷️ #Delightico #HealthyIndia #NaturalGoodness #${productData.name.replace(/\s+/g, '')} #SwadeshiHealth`,
        twitter: `🚀 New Launch: ${productData.name}! \n\n${productData.description.substring(0, 120)}...\n\nPerfect for health-conscious families! 💪\n\n#HealthFood #NaturalProducts #IndianWellness #Delightico`,
        facebook: `🎉 We're thrilled to introduce ${productData.name} to the Delightico family! 🎉\n\n${productData.description}\n\nThis exceptional product brings together traditional wisdom and modern health needs. Packed with natural goodness and essential nutrients, it's the perfect choice for your family's wellness journey.\n\n🌱 100% Natural\n🌱 Traditional Recipes  \n🌱 Family Wellness\n🌱 Authentic Taste\n\nOrder now and experience the difference! 🛒`
      },
      
      targetAudience: "Health-conscious Indian families, fitness enthusiasts, parents seeking nutritious options for children, working professionals looking for quick healthy solutions, and elders wanting traditional wellness products",
      
      healthBenefits: [
        "Boosts natural energy and vitality",
        "Supports strong immunity and overall wellness", 
        "Rich in essential Indian herbs and nutrients",
        "Promotes healthy digestion and gut health",
        "Excellent for bone strength and growth",
        "Maintains healthy metabolism"
      ],
      
      recipeSuggestions: [
        `Morning Energy: Mix 2 spoons of ${productData.name} with warm milk and jaggery for a nutritious start to your day`,
        `Healthy Smoothie: Blend ${productData.name} with banana, almonds, and honey for a power-packed drink`,
        `Traditional Twist: Add ${productData.name} to your regular atta for healthier rotis with extra nutrition`
      ],
      
      hashtags: [
        "#Delightico", 
        "#HealthyIndia", 
        "#NaturalProducts", 
        "#IndianWellness", 
        "#TraditionalHealth", 
        "#FamilyNutrition", 
        "#SwadeshiGoodness",
        "#HealthFirst",
        "#NaturalLiving",
        "#WellnessJourney"
      ]
    };
  }
}