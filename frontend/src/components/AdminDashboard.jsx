import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { API_ENDPOINTS } from '../config/api';
import adminAPI from '../utils/adminAPI';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Check if admin is authenticated
      if (!adminAPI.isAdminAuthenticated()) {
        console.warn('Admin not authenticated, redirecting to login');
        
        // Try to get fresh admin token automatically
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
            console.log('✅ Auto-login successful');
          } else {
            throw new Error('Auto-login failed');
          }
        } catch (autoLoginError) {
          console.error('Auto-login error:', autoLoginError);
          throw new Error('Admin authentication required');
        }
      }

      // Fetch real dashboard statistics using secure API
      const data = await adminAPI.getDashboardStats();
      
      if (data.success) {
        setDashboardStats(data.stats);
        console.log('✅ Dashboard stats loaded successfully:', data.stats);
      } else {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Show error message instead of dummy data
      setDashboardStats({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        recentOrders: [],
        error: error.message || 'Failed to connect to database. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state if database connection failed
  if (dashboardStats.error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle"></i> <strong>Database Connection Error</strong>
          <p className="mb-0">{dashboardStats.error}</p>
          <hr />
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={fetchDashboardStats}
            >
              <i className="fas fa-refresh"></i> Retry Connection
            </button>
            <button 
              className="btn btn-outline-warning btn-sm"
              onClick={async () => {
                try {
                  // Get fresh admin token by logging in
                  const response = await fetch(API_ENDPOINTS.admin.login, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: 'admin@alankree.com',
                      password: 'admin123'
                    })
                  });
                  
                  const data = await response.json();
                  if (data.success) {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('adminData', JSON.stringify(data.admin));
                    fetchDashboardStats();
                  } else {
                    alert('Failed to authenticate: ' + data.message);
                  }
                } catch (error) {
                  alert('Authentication failed: ' + error.message);
                }
              }}
            >
              <i className="fas fa-key"></i> Force Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><i className="fas fa-tachometer-alt"></i> Dashboard Overview</h1>
        <button 
          className="btn btn-primary" 
          onClick={fetchDashboardStats}
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card stats-card h-100">
            <div className="card-body text-center">
              <i className="fas fa-shopping-cart fa-3x mb-3"></i>
              <h3>{dashboardStats.totalOrders}</h3>
              <p className="card-text">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card stats-card h-100">
            <div className="card-body text-center">
              <i className="fas fa-box fa-3x mb-3"></i>
              <h3>{dashboardStats.totalProducts}</h3>
              <p className="card-text">Total Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card stats-card h-100">
            <div className="card-body text-center">
              <i className="fas fa-users fa-3x mb-3"></i>
              <h3>{dashboardStats.totalUsers}</h3>
              <p className="card-text">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card stats-card h-100">
            <div className="card-body text-center">
              <i className="fas fa-rupee-sign fa-3x mb-3"></i>
              <h3>₹{dashboardStats.totalRevenue?.toLocaleString()}</h3>
              <p className="card-text">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="fas fa-bolt"></i> Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => onSectionChange && onSectionChange('products')}
                >
                  <i className="fas fa-plus"></i> Add New Product
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => onSectionChange && onSectionChange('orders')}
                >
                  <i className="fas fa-eye"></i> View All Orders
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => onSectionChange && onSectionChange('customers')}
                >
                  <i className="fas fa-users"></i> Manage Users
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0"><i className="fas fa-clock"></i> System Status</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <div className="text-center mb-3">
                    <div className="badge bg-warning fs-6 p-2">
                      {dashboardStats.pendingOrders} Pending Orders
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-center mb-3">
                    <div className="badge bg-success fs-6 p-2">
                      System Online
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="text-center">
                <small className="text-muted">
                  Last updated: {new Date().toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0"><i className="fas fa-list"></i> Recent Orders</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats.recentOrders?.length > 0 ? (
                      dashboardStats.recentOrders.slice(0, 5).map((order, index) => (
                        <tr key={index}>
                          <td>#{order.id}</td>
                          <td>{order.customer}</td>
                          <td>₹{order.amount}</td>
                          <td>
                            <span className={`badge bg-${
                              order.status === 'pending' ? 'warning' :
                              order.status === 'confirmed' ? 'info' :
                              order.status === 'shipped' ? 'primary' :
                              order.status === 'delivered' ? 'success' : 'danger'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.date}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No recent orders to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
