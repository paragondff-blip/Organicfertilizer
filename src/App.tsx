/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Brands from './pages/Brands';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import TrackOrder from './pages/TrackOrder';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SiteProvider } from './context/SiteContext';

export default function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-white flex flex-col font-sans">
              <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/shipping" element={<ShippingPolicy />} />
                <Route path="/track-order" element={<TrackOrder />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="bottom-right" theme="colored" />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  </SiteProvider>
);
}
