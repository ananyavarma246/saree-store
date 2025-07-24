import React, { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Safety check - return null if product is undefined
  if (!product) {
    return null;
  }

  const handleAddToCart = async () => {
    // Check if product exists
    if (!product) {
      showToast('Product information not available', 'error');
      return;
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      showToast('Please log in to add items to cart', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // Get product ID (MongoDB uses _id, others might use id)
      const productId = product._id || product.id;
      
      // Only call the parent's onAddToCart function if it exists
      if (onAddToCart) {
        await onAddToCart(productId);
      } else {
        // Fallback: add to localStorage directly if no parent handler
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
        
        // Show success message
        showToast('Product added to cart!', 'success');
      }
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    }
    setIsLoading(false);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const productId = product._id || product.id;
    
    if (!isWishlisted) {
      wishlistItems.push(product);
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
      showToast('Added to wishlist!', 'success');
    } else {
      const updatedWishlist = wishlistItems.filter(item => (item._id || item.id) !== productId);
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      showToast('Removed from wishlist!', 'info');
    }
  };

  const showToast = (message, type) => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} toast-notification`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <div className="col">
      <div className="card product-card h-100">
        <div className="position-relative overflow-hidden">
          <img 
            src={product.image} 
            className="card-img-top" 
            alt={product.name}
            style={{ height: '250px', objectFit: 'cover' }}
          />
          
          {/* Overlay buttons */}
          <div className="position-absolute top-0 end-0 p-2">
            <button 
              className={`btn btn-sm rounded-circle me-1 ${isWishlisted ? 'btn-danger' : 'btn-light'}`}
              onClick={toggleWishlist}
              title="Add to Wishlist"
            >
              <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
            </button>
            <button 
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => setShowQuickView(true)}
              title="Quick View"
            >
              <i className="fas fa-eye"></i>
            </button>
          </div>
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-2">{product.name}</h5>
          <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            {product.description}
          </p>
          
          {/* Price */}
          <div className="product-price mb-3">
            <span className="fw-bold text-primary">₹{product.price}</span>
          </div>
          
          {/* Size options */}
          {product.sizes && (
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Available Sizes:</small>
              <div className="d-flex gap-1">
                {product.sizes.map((size, index) => (
                  <span key={index} className="badge bg-light text-dark border">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Add to cart button */}
          <button 
            className="btn btn-primary-custom mt-auto"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart me-2"></i>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Quick View Modal */}
      {showQuickView && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{product.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowQuickView(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">{product.description}</p>
                    <div className="product-price mb-3">
                      <h4 className="text-primary">₹{product.price}</h4>
                    </div>
                    {product.sizes && (
                      <div className="mb-3">
                        <h6>Available Sizes:</h6>
                        <div className="d-flex gap-2">
                          {product.sizes.map((size, index) => (
                            <button key={index} className="btn btn-outline-secondary btn-sm">
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowQuickView(false)}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary-custom"
                  onClick={handleAddToCart}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;