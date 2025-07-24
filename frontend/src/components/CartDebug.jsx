import React, { useState, useEffect } from 'react';

const CartDebug = () => {
  const [cartItems, setCartItems] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
    setDebugInfo(`Loaded ${items.length} items at ${new Date().toLocaleTimeString()}`);
  };

  const addTestItem = () => {
    const testItem = {
      id: Date.now(),
      name: "Debug Test Saree",
      price: 1999,
      image: "https://via.placeholder.com/200",
      quantity: 1,
      description: "Test item for debugging"
    };

    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    existingCart.push(testItem);
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    
    // Trigger update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    setDebugInfo(`Added test item at ${new Date().toLocaleTimeString()}`);
  };

  const clearCart = () => {
    localStorage.removeItem('cartItems');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    setDebugInfo(`Cleared cart at ${new Date().toLocaleTimeString()}`);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '15px',
      minWidth: '250px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h6>Cart Debug Panel</h6>
      <p><strong>Items:</strong> {cartItems.length}</p>
      <p><strong>Status:</strong> {debugInfo}</p>
      
      {cartItems.length > 0 && (
        <div style={{ maxHeight: '100px', overflow: 'auto', marginBottom: '10px' }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ fontSize: '11px', marginBottom: '5px' }}>
              {item.name} - ₹{item.price} (Qty: {item.quantity})
            </div>
          ))}
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '5px' }}>
        <button onClick={addTestItem} style={{ fontSize: '11px', padding: '4px 8px' }}>
          Add Test
        </button>
        <button onClick={clearCart} style={{ fontSize: '11px', padding: '4px 8px' }}>
          Clear
        </button>
        <button onClick={loadCart} style={{ fontSize: '11px', padding: '4px 8px' }}>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default CartDebug;
