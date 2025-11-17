import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentTest = ({ totalAmount, cartItems }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  
  const cardElementRef = useRef(null);
  const stripeInitialized = useRef(false);

  // Convert total amount to paise
  const amountInPaise = Math.round(totalAmount * 100);

  // Load Stripe
  useEffect(() => {
    if (stripeInitialized.current) return;

    const initializeStripe = async () => {
      try {
        console.log('🔄 Loading Stripe...');
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripeInstance = await loadStripe('pk_test_51S2AMZQub0yeva9OwRkheH9hwu0kaiopZcbfoAtbaYbKAiSf5ueMGC40pwW2yZhFarR9vU9AjoquNEYylFsuK6I300ShZDt5Gs');
        
        if (stripeInstance) {
          const elementsInstance = stripeInstance.elements();
          setStripe(stripeInstance);
          setElements(elementsInstance);
          stripeInitialized.current = true;
          console.log('✅ Stripe loaded successfully');
        }
      } catch (error) {
        console.error('❌ Failed to load Stripe:', error);
        setMessage('Failed to load payment system. Please refresh the page.');
      }
    };

    initializeStripe();
  }, []);

  // Initialize card element
  useEffect(() => {
    if (elements && cardElementRef.current && !cardElementRef.current._cardElement) {
      console.log('🔄 Creating card element...');
      const cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      });
      cardElement.mount(cardElementRef.current);
      cardElementRef.current._cardElement = cardElement;
      console.log('✅ Card element mounted');
    }
  }, [elements]);

  const handleTestPayment = async () => {
    if (!stripe || !elements) {
      setMessage('Payment system is still loading. Please wait...');
      return;
    }

    // Validate amount
    if (amountInPaise < 5000) {
      setMessage(`❌ Minimum payment amount is ₹50.00. Your cart total is ₹${totalAmount.toFixed(2)}`);
      return;
    }

    try {
      setLoading(true);
      setMessage('Creating payment intent...');
      setPaymentStatus('');

      // 1. Create payment intent
      const response = await fetch('http://localhost:8000/api/payments/test-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: amountInPaise,
          customerEmail: user?.email || 'test@example.com',
          cartItems: cartItems
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setMessage('Confirming payment...');

      // 2. Confirm payment with Stripe
      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: user?.name || 'Test Customer',
            email: user?.email || 'test@example.com',
          },
        }
      });

      if (stripeError) {
        setMessage(`❌ Payment failed: ${stripeError.message}`);
        setPaymentStatus('failed');
      } else {
        // Payment successful
        const successMessage = `✅ Payment Successful!

Amount: ₹${totalAmount.toFixed(2)}
Order ID: ${data.orderId}
Payment ID: ${data.paymentIntentId}

Thank you for your purchase!`;

        setMessage(successMessage);
        setPaymentStatus('success');

        // Clear cart
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));

        // Redirect to success page
        setTimeout(() => {
          navigate(`/order-success?order_id=${data.orderId}&payment_id=${data.paymentIntentId}`);
        }, 3000);
      }

    } catch (error) {
      console.error('Payment error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Order Total Display */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Order Total:</span>
          <span className="text-xl font-bold text-green-700">₹{totalAmount.toFixed(2)}</span>
        </div>
        {amountInPaise < 5000 && (
          <p className="text-sm text-red-600 mt-2">
            Minimum payment amount is ₹50.00. Please add more items to your cart.
          </p>
        )}
      </div>

      {/* Card Element */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-white">
          <div ref={cardElementRef} id="card-element" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>Test Card: <strong>4242 4242 4242 4242</strong></p>
          <p>Expiry: <strong>12/34</strong> | CVC: <strong>123</strong> | ZIP: <strong>12345</strong></p>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handleTestPayment}
        disabled={loading || !stripe || amountInPaise < 5000}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          loading || !stripe || amountInPaise < 5000
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay ₹${totalAmount.toFixed(2)}`
        )}
      </button>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg border ${
          paymentStatus === 'success' 
            ? 'bg-green-100 text-green-800 border-green-200'
            : paymentStatus === 'failed' 
            ? 'bg-red-100 text-red-800 border-red-200'
            : 'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          <pre className="text-sm whitespace-pre-wrap font-sans">{message}</pre>
        </div>
      )}
    </div>
  );
};

export default PaymentTest;