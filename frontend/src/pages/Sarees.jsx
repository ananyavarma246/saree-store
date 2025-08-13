import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { API_ENDPOINTS } from '../config/api';

function Sarees() {
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchSarees();
  }, []);

  const fetchSarees = async () => {
    try {
      console.log('🔄 Fetching sarees from:', `${API_ENDPOINTS.products}?category=saree`);
      const response = await fetch(`${API_ENDPOINTS.products}?category=saree`);
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 API Response:', data);
      
      if (data.success) {
        console.log('✅ Sarees loaded:', data.products.length);
        setSarees(data.products);
      } else {
        console.error('❌ API returned error:', data);
        setError('Failed to load sarees');
      }
    } catch (error) {
      console.error('💥 Error fetching sarees:', error);
      setError('Failed to load sarees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId) => {
    const product = sarees.find(p => p._id === productId);
    
    if (!product) {
      showToast('Product not found!', 'error');
      return;
    }
    
    // Always use localStorage for cart management
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = existingCart.find(item => (item._id || item.id) === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    showToast(`${product.name} added to cart!`, 'success');
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} toast-notification`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading sarees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
          <i className="fas fa-tshirt me-3"></i>
          Sarees Collection
        </h1>
        <p className="lead text-muted">
          Discover our exquisite collection of traditional and contemporary sarees
        </p>
      </div>

      {/* Products Grid */}
      <ProductList products={sarees} onAddToCart={handleAddToCart} />
    </div>
  );
}

export default Sarees;