import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/product";
import gunpowder from '../assets/gunpowder.jpg';
import ragimalt from '../assets/ragimalt.png';
import ragichocolatecookie from '../assets/ragi-chocolate-cookie.png';
import teabag from '../assets/teabag.png';
import tinbig from '../assets/tinbig.jpg';
import hurihittu from '../assets/hurihittu.png';
import powder from '../assets/powder.jpg';
import healthmix from '../assets/healthmix.png';

import { useAuth } from '../context/AuthContext';
import AIPostGenerator from "../components/AIPostGeneration";

// Sample products for "You might be interested in" section - MOVED TO TOP
const sampleProducts = [
  {
    id: 1,
    name: "Ragimalt",
    brand: "WeMill",
    rating: 5,
    originalPrice: 205.00,
    discountedPrice: 199.00,
    description: "Health Drink Manufactured with CFTRI Technology, Zero preservatives used",
    isOnSale: true,
    image: ragimalt
  },
  {
    id: 2,
    name: "TeaBag",
    brand: "NOFH",
    rating: 5,
    originalPrice: 190.00,
    discountedPrice: 180.00,
    description: "Health Drink Manufactured with CFTRI Technology, Zero preservatives used",
    isOnSale: true,
    image: teabag
  },
  {
    id: 3,
    name: "Ragi Chocolate Cookies",
    brand: "WeMill",
    rating: 5,
    price: 60.00,
    description: "Delicious and healthy ragi chocolate cookies",
    isOnSale: false,
    image: ragichocolatecookie
  },
  {
    id: 4,
    name: "TinBag",
    brand: "NOFH",
    rating: 5,
    originalPrice: 205.00,
    discountedPrice: 199.00,
    description: "Health Drink Manufactured with CFTRI Technology, Zero preservatives used",
    isOnSale: true,
    image: tinbig
  },
  {
    id: 5,
    name: "Gunpowder",
    brand: "Maja Nature Food",
    rating: 5,
    originalPrice: 75.00,
    discountedPrice: 70.00,
    description: "Stone Grinded Ragi Flour",
    isOnSale: true,
    image: gunpowder
  },
  {
    id: 6,
    name: "Hurihittu",
    brand: "WeMill",
    rating: 5,
    originalPrice: 205.00,
    discountedPrice: 199.00,
    description: "Health Drink Manufactured with CFTRI Technology, Zero preservatives used",
    isOnSale: true,
    image: hurihittu
  },
  {
    id: 7,
    name: "Organic Ragi Flour",
    brand: "Wemill",
    rating: 5,
    originalPrice: 120.00,
    discountedPrice: 110.00,
    description: "100% Organic Ragi Flour, Rich in Calcium and Iron",
    isOnSale: true,
    image: gunpowder // Using gunpowder image as placeholder
  },
  {
    id: 8,
    name: "Health Millet Mix",
    brand: "Sanvi Millets",
    rating: 5,
    price: 150.00,
    description: "Healthy mix of multiple millets for daily nutrition",
    isOnSale: false,
    image: healthmix // Using ragimalt image as placeholder
  },
  {
    id: 9,
    name: "NallaKaram Powder",
    brand: "Maja Nature Food",
    rating: 5,
    originalPrice: 90.00,
    discountedPrice: 85.00,
    description: "Instant Ragi Dosa Mix, Ready to cook in 5 minutes",
    isOnSale: true,
    image: powder // Using teabag image as placeholder
  }
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log('🔵 STATE UPDATE - showAIGenerator:', showAIGenerator);
    console.log('🔵 STATE UPDATE - selectedProduct:', selectedProduct);
    
    if (showAIGenerator && selectedProduct) {
      console.log('🎉 MODAL SHOULD BE VISIBLE!');
      console.log('🎉 Product:', selectedProduct.name);
    }
  }, [showAIGenerator, selectedProduct]);

  // Brands data - Fixed the NOFH brand filter
  const brands = [
  { name: "All", count: Array.isArray(products) ? products.length : 0 },
  { name: "Maja Nature Food", count: Array.isArray(products) ? products.filter(p => p.brand === "Maja Nature Food").length : 0 },
  { name: "WeMill", count: Array.isArray(products) ? products.filter(p => p.brand === "WeMill").length : 0 },
  { name: "NOFH", count: Array.isArray(products) ? products.filter(p => p.brand === "NOFH").length : 0 },
  { name: "Sanvi Millets", count: Array.isArray(products) ? products.filter(p => p.brand === "Sanvi Millets").length : 0 },
];

 const filtered = Array.isArray(products) ? products.filter((p) => {
  const matchesSearch = p.name?.toLowerCase().includes(query.toLowerCase()) ||
                       p.brand?.toLowerCase().includes(query.toLowerCase());
  const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
  const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
  
  return matchesSearch && matchesPrice && matchesBrand;
}) : [];

  // Filter sample products by selected brand
  const getSuggestedProducts = () => {
    if (selectedBrand === "All") {
      return sampleProducts;
    }
    
    // Filter sample products by selected brand
    const brandSuggestedProducts = sampleProducts.filter(product => 
      product.brand.toLowerCase() === selectedBrand.toLowerCase()
    );
    
    // If no products found for the brand, return all sample products
    return brandSuggestedProducts.length > 0 ? brandSuggestedProducts : sampleProducts;
  };

  const suggestedProducts = getSuggestedProducts();

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    
    if (quantity === 0) {
      // Show message if trying to add 0 quantity
      setAddedProductName(product.name);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      return;
    }
    
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(item => item.id === product._id);
    
    if (existingItemIndex > -1) {
      // Update quantity if product exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push({
        id: product._id,
        name: product.name,
        price: product.discountedPrice || product.price,
        image: product.image,
        brand: product.brand,
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    console.log(`Added ${quantity} of ${product.name} to cart`);
    
    // Show success message
    setAddedProductName(product.name);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // Reset quantity for this product
    setQuantities(prev => ({
      ...prev,
      [product._id]: 0
    }));
  };

  // Handle add to cart for suggested products
  const handleSuggestedAddToCart = (product) => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(item => item.id === `sample-${product.id}`);
    
    if (existingItemIndex > -1) {
      // Update quantity if product exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push({
        id: `sample-${product.id}`,
        name: product.name,
        price: product.discountedPrice || product.price,
        image: product.image,
        brand: product.brand,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    setAddedProductName(product.name);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    console.log(`Added 1 of ${product.name} to cart`);
  };

  // Handle AI Post Generation - FIXED VERSION
  const handleAIPostGeneration = (product) => {
    console.log('🟢 AI Post button clicked for:', product?.name);
    
    // Make sure we have a valid product
    if (!product) {
      console.error('🔴 No product provided to AI generator');
      return;
    }
    
    // Update both states simultaneously
    setSelectedProduct(product);
    setShowAIGenerator(true);
    
    console.log('🟢 States updated - should show modal now');
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  // Clear all filters
  const clearFilters = () => {
    setQuery("");
    setPriceRange({ min: 0, max: 1000 });
    setSelectedBrand("All");
  };

  // Handle brand click - this will filter products by the selected brand
  const handleBrandClick = (brandName) => {
    setSelectedBrand(brandName);
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>
              <strong>{addedProductName}</strong> added to cart!
            </span>
          </div>
        </div>
      )}
      
      {/* Breadcrumb */}
      <div className="bg-[#f5f5dc] py-4 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-700 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-green-700">Products</span>
            {selectedBrand !== "All" && (
              <>
                <span>/</span>
                <span className="text-green-700">{selectedBrand}</span>
              </>
            )}
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4 space-y-8">
            {/* Clear Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-700 underline transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Search Products</h3>
              <input
                type="text"
                placeholder="Search products or brands..."
                className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Brands Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Brands</h3>
              <ul className="space-y-2">
                {brands.map((brand, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleBrandClick(brand.name)}
                      className={`flex justify-between w-full text-left p-2 rounded hover:bg-green-50 transition-all duration-200 ${
                        selectedBrand === brand.name 
                          ? "bg-green-50 text-green-700 border border-green-200 shadow-sm font-semibold" 
                          : "hover:shadow-sm"
                      }`}
                    >
                      <span className={`${selectedBrand === brand.name ? 'text-green-800' : ''}`}>
                        {brand.name}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs min-w-8 text-center ${
                        selectedBrand === brand.name 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {brand.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Filter by Price</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange.min}</span>
                  <span>₹{priceRange.max}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Min. Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Max. Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedBrand === "All" ? "All Products" : `${selectedBrand} Products`}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {loading ? "Loading..." : `Showing ${filtered.length} of ${products.length} products`}
                    {selectedBrand !== "All" && (
                      <span className="ml-2 text-green-600">
                        • Filtered by: {selectedBrand}
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex flex-wrap gap-2">
                    {selectedBrand !== "All" && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Brand: {selectedBrand}
                      </span>
                    )}
                    {query && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        Search: "{query}"
                      </span>
                    )}
                    {(selectedBrand !== "All" || query) && (
                      <button
                        onClick={clearFilters}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
                <div className="text-green-600 text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Products...</h3>
                <p className="text-gray-600">Please wait while we fetch the products</p>
              </div>
            )}

            {/* Products Grid - Show filtered products OR suggested products */}
            {!loading && (
              <>
                {/* Show filtered products when available */}
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((product, index) => (
                      <div 
                        key={product._id} 
                        className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                      >
                        {/* Product Image */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={product.image || gunpowder}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.brand && (
                              <span className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                                {product.brand}
                              </span>
                            )}
                            {product.discountedPrice && product.discountedPrice < product.price && (
                              <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                                Save ₹{(product.price - product.discountedPrice).toFixed(0)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">
                            {product.name}
                          </h3>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-3">
                            <div className="flex">
                              {renderStars(product.rating || 0)}
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              ({product.reviews || 0} reviews)
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold text-green-700">
                              ₹{product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}
                            </span>
                            {product.discountedPrice && product.discountedPrice < product.price && (
                              <span className="text-lg text-gray-500 line-through">
                                ₹{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {product.description || "Premium quality product with natural ingredients and health benefits."}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex flex-col space-y-3">
                            {/* Quantity and Add to Cart */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
                                <button
                                  onClick={() => handleQuantityChange(product._id, -1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 text-gray-600"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center font-semibold text-gray-800">
                                  {quantities[product._id] || 0}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(product._id, 1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 text-gray-600"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold shadow-md hover:shadow-lg flex items-center space-x-2"
                              >
                                <span>ADD TO CART</span>
                              </button>
                            </div>
                            
                            {/* AI Post Generation Button - FIXED */}
                            <button
                              onClick={() => handleAIPostGeneration(product)}
                              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-2"
                            >
                              <span className="text-lg">🤖</span>
                              <span>GENERATE AI POST</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Show suggested products when no filtered products */
                  <div className="bg-white p-8 rounded-xl shadow-sm border">
                    {/* Suggested Products Grid */}
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                        {selectedBrand === "All" 
                          ? "You might be interested in these products" 
                          : `More products from ${selectedBrand}`
                        }
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestedProducts.map((product) => (
                          <div 
                            key={product.id}
                            className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                          >
                            {/* Product Image */}
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                              <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {product.isOnSale && (
                                  <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                                    Sale!
                                  </span>
                                )}
                                <span className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                                  {product.brand}
                                </span>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                              <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">
                                {product.name}
                              </h3>
                              
                              {/* Brand */}
                              <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                              
                              {/* Rating */}
                              <div className="flex items-center mb-3">
                                <div className="flex">
                                  {renderStars(product.rating)}
                                </div>
                                <span className="text-xs text-gray-500 ml-2">({Math.floor(Math.random() * 100) + 1} reviews)</span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center space-x-2 mb-4">
                                <span className="text-2xl font-bold text-green-700">
                                  ₹{product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}
                                </span>
                                {product.discountedPrice && (
                                  <span className="text-lg text-gray-500 line-through">
                                    ₹{product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {product.description}
                              </p>

                              {/* Action Buttons */}
                              <div className="flex flex-col space-y-2">
                                <button 
                                  onClick={() => handleSuggestedAddToCart(product)}
                                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold shadow-md hover:shadow-lg"
                                >
                                  ADD TO CART
                                </button>
                                {/* AI Post Generation Button - FIXED */}
                                <button
                                  onClick={() => handleAIPostGeneration(product)}
                                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-2"
                                >
                                  <span className="text-lg">🤖</span>
                                  <span>AI POST</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pagination - Only show when filtered products exist */}
                {!loading && filtered.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex space-x-3">
                      <button className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 font-medium text-gray-700 hover:text-green-700">
                        1
                      </button>
                      <button className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 font-medium text-gray-700 hover:text-green-700">
                        2
                      </button>
                      <button className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 font-medium text-gray-700 hover:text-green-700 flex items-center space-x-2">
                        <span>Next</span>
                        <span>→</span>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Post Generator Modal - FIXED CONDITION */}
      {showAIGenerator && selectedProduct && (
        <AIPostGenerator 
          product={selectedProduct} 
          onClose={() => {
            console.log('🟡 Closing AI Generator');
            setShowAIGenerator(false);
            setSelectedProduct(null);
          }} 
        />
      )}
    </div>
  );
}