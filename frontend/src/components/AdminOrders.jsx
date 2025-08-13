import React, { useState, useEffect } from 'react';
import adminAPI from '../utils/adminAPI';
import { API_ENDPOINTS } from '../config/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      if (!adminAPI.isAdminAuthenticated()) {
        console.warn('Admin not authenticated, attempting auto-login...');
        
        // Try auto-login
        try {
          const response = await fetch(API_ENDPOINTS.admin.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'admin@alankree.com',
              password: 'admin123'
            })
          });
          
          const loginData = await response.json();
          if (loginData.success) {
            localStorage.setItem('adminToken', loginData.token);
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('adminData', JSON.stringify(loginData.admin));
            console.log('✅ Auto-login successful for orders');
          } else {
            throw new Error('Auto-login failed');
          }
        } catch (autoLoginError) {
          console.error('Auto-login error:', autoLoginError);
          setOrders([]);
          return;
        }
      }

      const data = await adminAPI.getAllOrders();
      
      if (data.success) {
        setOrders(data.orders || []);
        console.log('✅ Orders loaded successfully:', data.orders?.length || 0);
      } else {
        // No orders found or error fetching
        setOrders([]);
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      if (!adminAPI.isAdminAuthenticated()) {
        console.warn('Admin not authenticated for status update, attempting auto-login...');
        
        // Try auto-login
        try {
          const response = await fetch(API_ENDPOINTS.admin.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'admin@alankree.com',
              password: 'admin123'
            })
          });
          
          const loginData = await response.json();
          if (loginData.success) {
            localStorage.setItem('adminToken', loginData.token);
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('adminData', JSON.stringify(loginData.admin));
            console.log('✅ Auto-login successful for status update');
          } else {
            throw new Error('Auto-login failed');
          }
        } catch (autoLoginError) {
          console.error('Auto-login error:', autoLoginError);
          alert('Admin authentication required');
          return;
        }
      }

      const result = await adminAPI.updateOrderStatus(orderId, newStatus);

      if (result.success) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // Update selected order if it's the same
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'confirmed': return 'bg-info';
      case 'processing': return 'bg-primary';
      case 'shipped': return 'bg-dark';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><i className="fas fa-shopping-cart"></i> Orders Management</h1>
        <button className="btn btn-primary" onClick={fetchOrders}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Filter and Stats */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <select 
                    className="form-select" 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-9">
                  <div className="row text-center">
                    <div className="col">
                      <strong>{orders.length}</strong><br />
                      <small>Total Orders</small>
                    </div>
                    <div className="col">
                      <strong>{orders.filter(o => o.status === 'pending').length}</strong><br />
                      <small>Pending</small>
                    </div>
                    <div className="col">
                      <strong>{orders.filter(o => o.status === 'shipped').length}</strong><br />
                      <small>Shipped</small>
                    </div>
                    <div className="col">
                      <strong>{orders.filter(o => o.status === 'delivered').length}</strong><br />
                      <small>Delivered</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Orders List ({filteredOrders.length})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive" style={{ overflow: 'visible', minHeight: '400px' }}>
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Order ID</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Customer</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Items</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Amount</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Status</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Date</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>#{order.orderId || order._id.slice(-6)}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{order.user?.name || 'Unknown Customer'}</strong><br />
                        <small className="text-muted">{order.user?.email || 'Unknown Email'}</small>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {order.items ? order.items.length : 0} items
                      </span>
                    </td>
                    <td>
                      <strong>₹{order.totalPrice?.toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString() || 'N/A'}</td>
                    <td>
                      <div className="btn-group" role="group">
                        {/* View button removed */}
                        <div className="btn-group dropup" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="true"
                            aria-expanded="false"
                          >
                            Update
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end" style={{ zIndex: 1050 }}>
                            <li>
                              <button 
                                className="dropdown-item" 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateOrderStatus(order._id, 'confirmed');
                                }}
                              >
                                <i className="fas fa-check-circle me-2 text-success"></i>
                                Confirm Order
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateOrderStatus(order._id, 'processing');
                                }}
                              >
                                <i className="fas fa-cog me-2 text-primary"></i>
                                Start Processing
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateOrderStatus(order._id, 'shipped');
                                }}
                              >
                                <i className="fas fa-shipping-fast me-2 text-info"></i>
                                Mark Shipped
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateOrderStatus(order._id, 'delivered');
                                }}
                              >
                                <i className="fas fa-check-double me-2 text-success"></i>
                                Mark Delivered
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger" 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateOrderStatus(order._id, 'cancelled');
                                }}
                              >
                                <i className="fas fa-times-circle me-2"></i>
                                Cancel Order
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-4">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p className="text-muted">No orders found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order Details - #{selectedOrder.orderId || selectedOrder._id.slice(-6)}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p><strong>Name:</strong> {selectedOrder.user?.name || 'Unknown Customer'}</p>
                    <p><strong>Email:</strong> {selectedOrder.user?.email || 'Unknown Email'}</p>
                    <p><strong>Address:</strong> {selectedOrder.shippingAddress || selectedOrder.user?.address || 'Not provided'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Order Information</h6>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> 
                      <span className={`badge ms-2 ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                      </span>
                    </p>
                    <p><strong>Total Amount:</strong> ₹{selectedOrder.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>
                
                <hr />
                
                <h6>Order Items</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product?.name || item.name || 'Unknown Product'}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
