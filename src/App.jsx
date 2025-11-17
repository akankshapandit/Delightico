import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AIMarketing from "./pages/AIMarketing";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { CartProvider } from "./context/CartContext";
import PaymentTest from "./components/PaymentTest"; 
import PaymentSuccess from './components/PaymentSuccess';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetails from './pages/OrderDetails';
import { AuthProvider } from './context/AuthContext';
import OrdersList from './pages/OrderList';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen m-0 p-0">
          <Navbar />
          <main className="flex-grow m-0 p-0">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-test" element={<PaymentTest />} />
              
              {/* Protected Routes - Order Management */}
              <Route 
    path="/order-success" 
    element={
      <ProtectedRoute>
        <OrderSuccess />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/order-details/:orderId" 
    element={
      <ProtectedRoute>
        <OrderDetails />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/orders" 
    element={
      <ProtectedRoute>
        <OrdersList />
      </ProtectedRoute>
    } 
  />

              {/* Protected Routes - User Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin Only */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/ai"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AIMarketing />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route - redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;