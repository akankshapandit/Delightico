import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Truck, UserCheck, DollarSign, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import pricedrop from "../assets/pricedrop.jpg";
import ragimalt from "../assets/ragimalt.png"; 
import tinbig from "../assets/tinbig.jpg";
import gunpowder from "../assets/gunpowder.jpg";
import moringachocolate from "../assets/moringachocolate.jpg";
import powder from "../assets/powder.jpg";
import ragicookie from "../assets/ragi-chocolate-cookie.png";
import hurihittu from "../assets/hurihittu.png";
import teabag from "../assets/teabag.png";
import wemill2 from "../assets/wemill2.png";
import moringaBanner from "../assets/moringaBanner.png";
import { Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget"; // Import the chat widget

const Home = () => {
  const scrollContainerRef = useRef(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const MotionLink = motion(Link);

  const banners = [
    {
      id: 1,
      src: wemill2,
      alt: "Delightico Banner 2 - Premium Products"
    },
    {
      id: 2,
      src: moringaBanner,
      alt: "Delightico Banner 3 - Moringa Products"
    }
  ];

  const trendingProducts = [
    {
      id: 1,
      name: "Ragi Malt",
      image: ragimalt
    },
    {
      id: 2,
      name: "Moringa Powder",
      image: tinbig
    },
    {
      id: 3,
      name: "Gun Powder",
      image: gunpowder
    },
    {
      id: 4,
      name: "Moringa Chocolate",
      image: moringachocolate
    },
    {
      id: 5,
      name: "Nallakaram Powder",
      image: powder
    },
    {
      id: 6,
      name: "Ragi cookies",
      image: ragicookie
    },
    {
      id: 8,
      name: "Moringa Tea",
      image: teabag
    },
    {
      id: 7,
      name: "Huri Hittu",
      image: hurihittu
    }
  ];

  const scrollToBanner = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const bannerWidth = container.clientWidth;
      container.scrollTo({
        left: index * bannerWidth,
        behavior: 'smooth'
      });
      setCurrentBanner(index);
    }
  };

  const nextBanner = () => {
    const nextIndex = (currentBanner + 1) % banners.length;
    scrollToBanner(nextIndex);
  };

  const prevBanner = () => {
    const prevIndex = (currentBanner - 1 + banners.length) % banners.length;
    scrollToBanner(prevIndex);
  };

  // Auto-advance banners
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextBanner();
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [currentBanner]);

  return (
    <div className="bg-[#fffbea] w-full relative">
      {/* ===== Improved Banner Section ===== */}
      <section className="w-full relative">
        {/* Banner Container */}
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-hidden scroll-smooth"
        >
          <div className="flex">
            {banners.map((banner) => (
              <div 
                key={banner.id}
                className="w-full flex-shrink-0"
              >
                <motion.img
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={banner.src}
                  alt={banner.alt}
                  className="w-full h-64 md:h-80 lg:h-115 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white 
                     text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 
                     hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Previous banner"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white 
                     text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 
                     hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Next banner"
        >
          <ChevronRight size={24} />
        </button>

        {/* Navigation Dots - Positioned below the banner */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => scrollToBanner(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBanner 
                  ? 'bg-white scale-125' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== Welcome Section ===== */}
      <section className="w-full flex flex-col items-center justify-center text-center py-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-extrabold text-green-700 drop-shadow-lg font-times w-full"
        >
          Welcome to Delightico
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-lg md:text-xl font-bold text-gray-700 font-poppins w-full"
        >
          Taste the Health in Every Bite
        </motion.p>

        <MotionLink
          to="/products"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-green-700
                     text-white rounded-2xl shadow-lg font-semibold font-poppins
                     inline-block"
        >
          Shop Now
        </MotionLink>
      </section>

      {/* ===== Features Section ===== */}
      <section className="bg-black w-full">
        <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          
          {/* Feature 1 */}
          <div className="bg-[#2a2a2a] p-6 rounded-lg flex flex-col items-start">
            <Truck className="text-green-400 mb-3" size={28} />
            <h3 className="text-white text-lg font-semibold">Free Shipping</h3>
            <p className="text-gray-300 text-sm mt-2">
              Rs.50 charge for orders worth below Rs.500 and COD
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#2a2a2a] p-6 rounded-lg flex flex-col items-start">
            <UserCheck className="text-green-400 mb-3" size={28} />
            <h3 className="text-white text-lg font-semibold">Certified Organic</h3>
            <p className="text-gray-300 text-sm mt-2">100% Guarantee</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#2a2a2a] p-6 rounded-lg flex flex-col items-start">
            <DollarSign className="text-green-400 mb-3" size={28} />
            <h3 className="text-white text-lg font-semibold">Huge Savings</h3>
            <p className="text-gray-300 text-sm mt-2">At Lowest Price</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#2a2a2a] p-6 rounded-lg flex flex-col items-start">
            <RefreshCcw className="text-green-400 mb-3" size={28} />
            <h3 className="text-white text-lg font-semibold">Easy Returns</h3>
            <p className="text-gray-300 text-sm mt-2">No Questions Asked</p>
          </div>

        </div>
      </section>

      {/* ===== Trending Products Section ===== */}
      <section className="w-full py-16 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Title with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 font-times">
              Trending Products
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-poppins max-w-2xl mx-auto">
              Discover our most loved organic products that are flying off the shelves!
            </p>
          </motion.div>

          {/* Products Grid - 8 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-green-100"
              >
                {/* Product Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info - Only Name */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 font-poppins">
                    {product.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Products Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <MotionLink
              to="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 
                         text-white rounded-xl shadow-lg font-semibold font-poppins
                         hover:shadow-xl transition-all duration-300 text-lg inline-block"
            >
              View All Products
            </MotionLink>
          </motion.div>
        </div>
      </section>

      {/* ===== Chat Widget ===== */}
      <ChatWidget />
    </div>
  );
};

export default Home;