import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

function Navbar() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage or API
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Check if user is logged in
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userAuth');
    
    if (loggedInStatus === 'true' && userData) {
      const parsedUser = JSON.parse(userData);
      setIsLoggedIn(true);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin || false);
    }

    // Add scroll effect to navbar
    const handleScroll = () => {
      const navbar = document.querySelector('.full-width-navbar');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Listen for auth state changes
    const handleAuthChange = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
      setUser(event.detail.user);
      setIsAdmin(event.detail.isAdmin || false);
    };

    // Listen for cart updates
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Cart updated, items:', parsedCart);
        setCartItems(parsedCart);
      } else {
        // Clear cart if no items in localStorage
        setCartItems([]);
      }
    };

    window.addEventListener('authStateChange', handleAuthChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authStateChange', handleAuthChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => {
      const itemId = item._id || item.id;
      return itemId !== productId;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userAuth');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    setUserDropdownOpen(false);
    
    // Trigger auth state change event
    window.dispatchEvent(new CustomEvent('authStateChange', { 
      detail: { isLoggedIn: false, user: null, isAdmin: false } 
    }));
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement search navigation here
      console.log('Searching for:', searchQuery);
      // For now, just clear the search
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top full-width-navbar">
        <div className="container-fluid px-4">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-gem me-2"></i>
            Alankree
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Navigation Links - Left side */}
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  <i className="fas fa-home me-1"></i>Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/sarees">
                  <i className="fas fa-tshirt me-1"></i>Sarees
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/earrings">
                  <i className="fas fa-gem me-1"></i>Earrings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  <i className="fas fa-info-circle me-1"></i>About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  <i className="fas fa-envelope me-1"></i>Contact
                </NavLink>
              </li>
            </ul>
            
            {/* Search Bar - Center - Expanded to fill space */}
            <div className="search-container-full mx-4 flex-fill">
              <form onSubmit={handleSearch} className="search-wrapper-full">
                <div className="search-input-group">
                  <input 
                    type="text" 
                    className="search-input-full" 
                    placeholder="Search for sarees, earrings, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="search-button-full">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Right side - Cart and Auth */}
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <button 
                  className="btn position-relative me-3 cart-btn" 
                  onClick={toggleCart}
                >
                  <i className="fas fa-shopping-cart fs-5"></i>
                  {getTotalItems() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </li>
              
              {/* Authentication */}
              {isLoggedIn ? (
                <li className="nav-item dropdown user-dropdown">
                  <div 
                    className="user-avatar"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {getUserInitials()}
                  </div>
                  <ul className={`dropdown-menu dropdown-menu-end ${userDropdownOpen ? 'show' : ''}`}>
                    <li>
                      <div className="dropdown-item-text">
                        <strong>{user?.name || 'User'}</strong>
                        <div className="text-muted small">{user?.email}</div>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/account" onClick={() => setUserDropdownOpen(false)}>
                        <i className="fas fa-user me-2"></i>My Profile
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-shopping-bag me-2"></i>My Orders
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-heart me-2"></i>Wishlist
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-cog me-2"></i>Settings
                      </a>
                    </li>
                    {isAdmin && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link className="dropdown-item admin-item" to="/admin/products">
                            <i className="fas fa-box me-2"></i>Manage Products
                          </Link>
                        </li>
                        <li>
                          <a className="dropdown-item admin-item" href="/admin/orders">
                            <i className="fas fa-shopping-cart me-2"></i>Manage Orders
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item admin-item" href="/admin/users">
                            <i className="fas fa-users me-2"></i>Manage Users
                          </a>
                        </li>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <button 
                    className="login-btn me-2"
                    onClick={() => openAuthModal('login')}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Cart Overlay */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
      
      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Shopping Cart</h4>
          <button className="btn btn-link text-dark p-0" onClick={toggleCart}>
            <i className="fas fa-times fs-4"></i>
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-shopping-cart fs-1 text-muted mb-3"></i>
            <p className="text-muted">Your cart is empty</p>
            <button className="btn btn-primary-custom" onClick={toggleCart}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items mb-4">
              {cartItems.map(item => {
                const itemId = item._id || item.id;
                const itemName = item.name || 'Unknown Product';
                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 1;
                const itemImage = item.image || '/images/placeholder.jpg';
                
                return (
                  <div key={itemId} className="cart-item d-flex align-items-center mb-3 p-3 border rounded">
                    <img src={itemImage} alt={itemName} className="cart-item-image me-3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{itemName}</h6>
                      <p className="mb-1 text-muted small">₹{itemPrice} x {itemQuantity}</p>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(itemId)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-total border-top pt-3">
              <div className="d-flex justify-content-between mb-3">
                <strong>Total: ₹{getTotalPrice().toLocaleString()}</strong>
              </div>
              <button 
                className="btn btn-primary-custom w-100 mb-2"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </button>
              <button className="btn btn-outline-custom w-100" onClick={toggleCart}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        defaultMode={authMode}
      />
    </>
  );
}

export default Navbar;