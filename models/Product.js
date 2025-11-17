import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: { 
    type: Number,
    validate: {
      validator: function(value) {
        return value >= this.price;
      },
      message: 'Compare price must be greater than or equal to price'
    }
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: [
      'Grains & Flours',
      'Ready-to-Eat Foods',
      'Health Drinks & Supplements',
      'Snacks & Munchies',
      'Spices & Condiments',
      'Organic & Natural Products',
      'Beverages',
      'Sweeteners & Jaggery',
      'Oil & Ghee',
      'Pickles & Chutneys',
      'Other Food Products'
    ]
  },
  subcategory: String,
  images: [{
    url: { type: String, required: true },
    alt: String,
    public_id: { type: String, required: true }
  }],
  stock: { 
    type: Number, 
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  sku: { 
    type: String, 
    unique: true,
    sparse: true
  },
  tags: [String],
  
  // Food-Specific Fields
  nutritionFacts: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }, // in grams
    carbohydrates: { type: Number, default: 0 }, // in grams
    fat: { type: Number, default: 0 }, // in grams
    fiber: { type: Number, default: 0 }, // in grams
    sugar: { type: Number, default: 0 } // in grams
  },
  ingredients: [String],
  dietaryPreferences: {
    isVegetarian: { type: Boolean, default: true },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isOrganic: { type: Boolean, default: false },
    isDairyFree: { type: Boolean, default: false },
    containsAllergens: { type: Boolean, default: false },
    allergens: [String] // ['nuts', 'soy', 'wheat', etc.]
  },
  shelfLife: String, // "6 months", "1 year"
  storageInstructions: String,
  cookingInstructions: String,
  weight: {
    value: Number,
    unit: { type: String, default: 'grams' } // grams, kg, ml, liters
  },
  
  // AI-Powered Marketing Fields
  aiMarketing: {
    generatedDescription: String,
    marketingCopy: String,
    seoKeywords: [String],
    socialMediaPosts: [{
      platform: String,
      content: String,
      hashtags: [String],
      generatedAt: { type: Date, default: Date.now }
    }],
    targetAudience: String,
    uniqueSellingPoints: [String],
    healthBenefits: [String],
    recipeSuggestions: [String],
    lastGenerated: Date
  },
  
  // Analytics
  views: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  
  status: { 
    type: String, 
    enum: ['active', 'draft', 'archived'], 
    default: 'draft' 
  },
  
  // Vendor/Admin info
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

// Generate SKU before saving
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `DLT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

export default mongoose.model('Product', productSchema);
