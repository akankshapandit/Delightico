import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getOrderById(orderId);
        
        if (response.success) {
          setOrder(response.data);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Order not found or access denied');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  const handleBack = () => {
    navigate('/orders');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/150/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
          <button 
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-blue-100 mt-1">Thank you for your purchase!</p>
            </div>
            <button 
              onClick={handleBack}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              ← Back to Orders
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm font-semibold">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span>{order.customer?.name || user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span>{order.customer?.email || user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Ordered - ACTUAL PRODUCTS */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Products Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center border border-gray-200 rounded-lg p-4">
                  {/* Product Image */}
                  <img 
                    src={getImageUrl(item.image || (item.productDetails?.images?.[0]?.url))} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 ml-4">
                    <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description || item.productDetails?.description}
                    </p>
                    
                    {/* Product Specifications */}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      {item.weight?.value && (
                        <span>Weight: <strong>{item.weight.value} {item.weight.unit}</strong></span>
                      )}
                      {item.productDetails?.category && (
                        <span>Category: <strong>{item.productDetails.category}</strong></span>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-700 font-medium">Qty: {item.quantity}</span>
                      <span className="text-gray-700">₹{item.price?.toFixed(2)} each</span>
                    </div>
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-right">
                    <div className="font-semibold text-gray-800 text-lg">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="font-semibold text-gray-800 text-lg">Total</span>
                <span className="font-semibold text-lg text-gray-800">
                  ₹{order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex-1">
              Download Invoice
            </button>
            <button className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex-1">
              Track Order
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-1"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;