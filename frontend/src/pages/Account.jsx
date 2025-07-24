import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Account = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userAuth');
    
    if (loggedInStatus === 'true' && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const mockOrders = [
    {
      id: 'ORD001',
      date: '2024-07-01',
      status: 'Delivered',
      total: 2499,
      items: ['Red Silk Saree']
    },
    {
      id: 'ORD002',
      date: '2024-06-28',
      status: 'In Transit',
      total: 1299,
      items: ['Gold Plated Earrings']
    },

  ];

  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="account-page">
      <div className="container py-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="user-avatar mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '24px' }}>
                  {getUserInitials()}
                </div>
                <h5 className="fw-bold mb-1">{user?.name}</h5>
                <p className="text-muted small">{user?.email}</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm mt-3">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user me-2"></i>Profile
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <i className="fas fa-shopping-bag me-2"></i>My Orders
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'wishlist' ? 'active' : ''}`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <i className="fas fa-heart me-2"></i>Wishlist
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'addresses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <i className="fas fa-map-marker-alt me-2"></i>Addresses
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <i className="fas fa-cog me-2"></i>Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {activeTab === 'profile' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4">
                  <h4 className="fw-bold mb-0">Profile Information</h4>
                </div>
                <div className="card-body p-4">
                  <form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">First Name</label>
                        <input type="text" className="form-control" defaultValue={user?.name?.split(' ')[0] || ''} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-control" defaultValue={user?.name?.split(' ')[1] || ''} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" defaultValue={user?.email || ''} readOnly />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-control" defaultValue={user?.phone || ''} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary-custom">Update Profile</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4">
                  <h4 className="fw-bold mb-0">My Orders</h4>
                </div>
                <div className="card-body p-4">
                  {mockOrders.map(order => (
                    <div key={order.id} className="border rounded-3 p-3 mb-3">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h6 className="fw-bold mb-1">Order #{order.id}</h6>
                          <p className="text-muted small mb-1">Placed on {new Date(order.date).toLocaleDateString()}</p>
                          <p className="mb-1">{order.items.join(', ')}</p>
                          <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning'}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="col-md-4 text-md-end">
                          <h6 className="fw-bold">₹{order.total}</h6>
                          <button className="btn btn-outline-primary btn-sm">View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4">
                  <h4 className="fw-bold mb-0">My Wishlist</h4>
                </div>
                <div className="card-body p-4 text-center">
                  <i className="fas fa-heart fs-1 text-muted mb-3"></i>
                  <h5>Your wishlist is empty</h5>
                  <p className="text-muted">Save items you love to view them here</p>
                  <button className="btn btn-primary-custom">Start Shopping</button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Saved Addresses</h4>
                  <button className="btn btn-primary-custom">Add New Address</button>
                </div>
                <div className="card-body p-4 text-center">
                  <i className="fas fa-map-marker-alt fs-1 text-muted mb-3"></i>
                  <h5>No addresses saved</h5>
                  <p className="text-muted">Add an address for faster checkout</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4">
                  <h4 className="fw-bold mb-0">Account Settings</h4>
                </div>
                <div className="card-body p-4">
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Notifications</h6>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                      <label className="form-check-label" htmlFor="emailNotifications">
                        Email notifications
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id="smsNotifications" />
                      <label className="form-check-label" htmlFor="smsNotifications">
                        SMS notifications
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="promotionalEmails" defaultChecked />
                      <label className="form-check-label" htmlFor="promotionalEmails">
                        Promotional emails
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Privacy</h6>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="profileVisible" defaultChecked />
                      <label className="form-check-label" htmlFor="profileVisible">
                        Make profile visible to other users
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Change Password</h6>
                    <button className="btn btn-outline-primary">Change Password</button>
                  </div>

                  <div className="border-top pt-4">
                    <h6 className="fw-bold mb-3 text-danger">Danger Zone</h6>
                    <button className="btn btn-outline-danger">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
