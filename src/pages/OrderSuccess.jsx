import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get order ID from URL params or location state
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('order_id') || location.state?.orderId;

  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/order-details/${orderId}`);
    } else {
      // If no order ID, show error or redirect to orders list
      alert('Order ID not found. Redirecting to orders page.');
      navigate('/orders');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6 text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Order ID:</p>
            <p className="font-mono font-semibold">{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleViewOrder}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Order Details
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;