// In your Cart.jsx, update to use localStorage instead of API calls
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const { updateCartCount } = useCart();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const handleUpdate = (id, quantity) => {
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: parseInt(quantity) } : item
    ).filter(item => item.quantity > 0); // Remove items with quantity 0
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link 
              to="/products" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">{item.brand}</p>
                    <p className="text-green-700 font-semibold">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
                    <button
                      onClick={() => handleUpdate(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right min-w-24">
                    <p className="font-semibold text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-gray-800">
                  Total: ₹{getTotalPrice().toFixed(2)}
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/products"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/checkout"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}