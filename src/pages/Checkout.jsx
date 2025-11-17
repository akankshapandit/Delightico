import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaymentTest from '../components/PaymentTest'
export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    
    // Calculate total amount
    const total = savedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5dc] py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
            <Link 
              to="/products" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-800">Total Amount:</span>
                <span className="font-bold text-green-700 text-xl">₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/cart"
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center block"
              >
                Back to Cart
              </Link>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Payment Details</h2>
            
            {/* Pass the total amount to PaymentTest component */}
            <PaymentTest totalAmount={totalAmount} cartItems={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}