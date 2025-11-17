import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import logo2 from "../assets/logo2.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  // Load cart data from localStorage
  useEffect(() => {
    const loadCartData = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        setCartCount(totalCount);
        setCartTotal(totalAmount);
      } catch (error) {
        console.error('Error loading cart data:', error);
        setCartCount(0);
        setCartTotal(0);
      }
    };

    // Load initial cart data
    loadCartData();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      loadCartData();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-amber-50 shadow-md flex justify-between items-center mt-5 p-4">
      {/* Left: Logo */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo2} 
            alt="Delightico Logo"
            className="h-14 w-30"
          />
        </Link>
        <Link 
          to="/products" 
          className="text-gray-700 hover:text-green-700 transition-colors duration-200 font-medium"
        >
          All Products
        </Link>
      </div>

      {/* Right: Menu */}
      <div className="flex items-center space-x-6 relative">
        <Link 
          to="/about" 
          className="text-gray-700 hover:text-green-700 transition-colors duration-200 font-medium"
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className="text-gray-700 hover:text-green-700 transition-colors duration-200 font-medium"
        >
          Contact
        </Link>

        {/* Cart with Real Data */}
        <Link 
          to="/cart" 
          className="relative flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-all duration-200 group"
        >
          <div className="text-right">
            <span className="text-green-700 font-semibold text-sm block leading-tight">
              ₹{cartTotal.toFixed(2)}
            </span>
            <span className="text-green-600 text-xs block leading-tight">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-green-700 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full transition-colors duration-200"
          >
            <User className="w-4 h-4 text-green-700" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-green-100 z-50 animate-in fade-in-0 zoom-in-95">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Orders
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
