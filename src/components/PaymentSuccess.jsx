import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Fetch payment details from your backend
        const response = await fetch(`http://localhost:8000/api/payments/${paymentId}`);
        if (response.ok) {
          const data = await response.json();
          setPaymentDetails(data);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [paymentId]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      {paymentDetails && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">₹{(paymentDetails.amount / 100).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono text-sm">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment ID</p>
              <p className="font-mono text-sm">{paymentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="text-sm">{new Date().toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>You will receive an email confirmation shortly</li>
          <li>Your order is being processed</li>
          <li>Order updates will be sent to your email</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Return to Home
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Print Receipt
        </button>
        <Link 
          to="/orders"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;