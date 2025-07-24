import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Sarees from './pages/Sarees';
import Earrings from './pages/Earrings';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import AdminProducts from './pages/AdminProducts';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    // Check if user is admin on app load
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    // Listen for auth state changes
    const handleAuthChange = (event) => {
      if (event.detail && event.detail.isAdmin) {
        setIsAdmin(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('authStateChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Router>
      <div className="App">
        {isAdmin ? (
          // Admin Panel - Full screen admin interface
          <AdminPanel />
        ) : (
          // Regular User Interface
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sarees" element={<Sarees />} />
                <Route path="/earrings" element={<Earrings />} />
                <Route path="/account" element={<Account />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/products" element={<AdminProducts />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
        
        {/* Scroll to Top Button */}
        <button
          className={`scroll-to-top ${showScrollTop ? 'show' : ''}`}
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      </div>
    </Router>
  );
}

export default App;