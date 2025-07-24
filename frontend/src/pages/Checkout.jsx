import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  
  // Get user auth from localStorage
  const user = JSON.parse(localStorage.getItem('userAuth') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Load cart items on component mount and listen for updates
  useEffect(() => {
    const loadCartItems = () => {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      console.log('Loading cart items:', items);
      setCartItems(items);
    };

    // Load initially
    loadCartItems();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartItems();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Debug logs
  console.log('User from localStorage:', user);
  console.log('isLoggedIn:', isLoggedIn);
  console.log('Cart items state:', cartItems);

  const [orderData, setOrderData] = useState({
    user: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    paymentMethod: 'cod',
    orderItems: []
  });

  // Update orderItems when cartItems changes
  useEffect(() => {
    setOrderData(prev => ({
      ...prev,
      orderItems: cartItems.map(item => ({
        product: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }))
    }));
  }, [cartItems]);

  // Ensure cart is cleared when order is successful
  useEffect(() => {
    if (orderSuccess) {
      // Double-check cart is cleared
      localStorage.removeItem('cartItems');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [orderSuccess]);

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add some items to your cart first.');
      return;
    }

    // Validate required fields
    if (!orderData.user.name || !orderData.user.email || 
        !orderData.shippingAddress.street || !orderData.shippingAddress.city) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        ...orderData,
        totalPrice: calculateTotal(),
        paymentResult: {
          status: 'pending',
          transactionId: `TXN${Date.now()}`,
          updateTime: new Date().toISOString()
        }
      };

      console.log('Sending order:', orderPayload); // Debug log

      const response = await fetch('http://localhost:5001/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Note: Since we're using simulated auth, we'll skip the Bearer token for now
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();
      console.log('Order response:', result); // Debug log

      if (response.ok && result.success) {
        setOrderId(result.order._id);
        setOrderSuccess(true);
        
        // Clear cart from localStorage
        localStorage.removeItem('cartItems');
        
        // Clear cart from local state immediately
        setCartItems([]);
        
        // Trigger cart update event for navbar and other components
        window.dispatchEvent(new Event('cartUpdated'));
        
        console.log('Order placed successfully, cart cleared');
      } else {
        // Better error handling
        const errorMessage = result.message || result.error || 'Unknown error occurred';
        alert('Order placement failed: ' + errorMessage);
        console.error('Order failed:', result);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Remove login requirement for guest orders
  // if (!isLoggedIn) {
  //   return (
  //     <div className="container py-5">
  //       <div className="row justify-content-center">
  //         <div className="col-md-6 text-center">
  //           <h3>Please Login to Continue</h3>
  //           <p>You need to be logged in to place an order.</p>
  //           <button className="btn btn-primary-custom" onClick={() => navigate('/')}>
  //             Go to Login
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <i className="fas fa-shopping-cart text-muted mb-3" style={{ fontSize: '4rem' }}></i>
            <h3>Your cart is empty</h3>
            <p className="text-muted">Add some products to your cart to proceed with checkout.</p>
            <button className="btn btn-primary-custom" onClick={() => navigate('/sarees')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="text-success mb-3">Order Placed Successfully! 🎉</h2>
                <p className="text-muted mb-4">
                  Thank you for your order. Your order ID is: <strong>#{orderId.slice(-8)}</strong>
                </p>
                <p className="mb-4">
                  We'll send you a confirmation email and keep you updated on your order status.
                  Our team will process your order and notify you when it's ready for delivery.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button 
                    className="btn btn-primary-custom"
                    onClick={() => navigate('/account')}
                  >
                    View Order Details
                  </button>
                  <button 
                    className="btn btn-outline-custom"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 p-4">
              <h4 className="fw-bold mb-0">Checkout</h4>
            </div>
            <div className="card-body p-4">
              {/* Customer Information */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Customer Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderData.user.name}
                      onChange={(e) => handleInputChange('user', 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={orderData.user.email}
                      onChange={(e) => handleInputChange('user', 'email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={orderData.user.phone}
                      onChange={(e) => handleInputChange('user', 'phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Shipping Address</h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderData.shippingAddress.street}
                      onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderData.shippingAddress.city}
                      onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderData.shippingAddress.state}
                      onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderData.shippingAddress.pincode}
                      onChange={(e) => handleInputChange('shippingAddress', 'pincode', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderData.shippingAddress.country}
                      onChange={(e) => handleInputChange('shippingAddress', 'country', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Payment Method</h5>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    checked={orderData.paymentMethod === 'cod'}
                    onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Cash on Delivery (COD)
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="card"
                    value="card"
                    checked={orderData.paymentMethod === 'card'}
                    onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  />
                  <label className="form-check-label" htmlFor="card">
                    Credit/Debit Card
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="upi"
                    value="upi"
                    checked={orderData.paymentMethod === 'upi'}
                    onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  />
                  <label className="form-check-label" htmlFor="upi">
                    UPI Payment
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 p-4">
              <h5 className="fw-bold mb-0">Order Summary</h5>
            </div>
            <div className="card-body p-4">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    className="rounded me-3"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <div className="text-end">
                    <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                  </div>
                </div>
              ))}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total:</strong>
                <strong>₹{calculateTotal().toLocaleString()}</strong>
              </div>
              
              <button
                className="btn btn-primary-custom w-100"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
