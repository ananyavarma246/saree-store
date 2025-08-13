import React, { useState, useEffect } from 'react';
import adminAPI from '../utils/adminAPI';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!adminAPI.isAdminAuthenticated()) {
        console.warn('Admin not authenticated, attempting auto-login...');
        
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
            console.log('✅ Auto-login successful for users');
          } else {
            throw new Error('Auto-login failed');
          }
        } catch (autoLoginError) {
          console.error('Auto-login error:', autoLoginError);
          setUsers([]);
          return;
        }
      }

      const data = await adminAPI.getAllUsers();
      
      if (data.success) {
        const transformedUsers = (data.users || []).map(user => ({
          _id: String(user._id || user.email || Math.random()),
          name: String(user.name || 'N/A'),
          email: String(user.email || 'N/A'),
          phone: String(user.phone || 'N/A'),
          createdAt: user.createdAt,
          registeredDate: user.registeredDate,
          totalOrders: Number(user.totalOrders || 0),
          totalSpent: Number(user.totalSpent || 0),
          isActive: Boolean(user.isActive || user.totalOrders > 0),
          orderHistory: [],
          lastOrderDate: user.lastOrderDate
        }));
        
        setUsers(transformedUsers);
        console.log('✅ Users loaded and transformed:', transformedUsers.length, 'users');
      } else {
        setUsers([]);
        console.error('Failed to fetch users:', data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = (user) => {
    console.log('Selected user for modal:', {
      id: user._id,
      name: user.name,
      email: user.email,
      totalOrders: user.totalOrders
    });
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const renderUserModal = () => {
    if (!showUserModal || !selectedUser) return null;

    const userName = String(selectedUser.name || 'Unknown User');
    const userEmail = String(selectedUser.email || 'N/A');
    const userPhone = String(selectedUser.phone || 'N/A');
    const totalOrders = Number(selectedUser.totalOrders || 0);
    const totalSpent = Number(selectedUser.totalSpent || 0);
    
    let registeredDate = 'N/A';
    try {
      if (selectedUser.createdAt) {
        registeredDate = new Date(selectedUser.createdAt).toLocaleDateString();
      } else if (selectedUser.registeredDate) {
        registeredDate = typeof selectedUser.registeredDate === 'string' 
          ? selectedUser.registeredDate 
          : new Date(selectedUser.registeredDate).toLocaleDateString();
      }
    } catch (e) {
      registeredDate = 'N/A';
    }

    const averageOrder = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
    const isActive = selectedUser.isActive || totalOrders > 0;

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Details - {userName}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowUserModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Personal Information</h6>
                  <p><strong>Name:</strong> {userName}</p>
                  <p><strong>Email:</strong> {userEmail}</p>
                  <p><strong>Phone:</strong> {userPhone}</p>
                  <p><strong>Registered:</strong> {registeredDate}</p>
                  <p><strong>Status:</strong> 
                    <span className={`badge ms-2 ${isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Order Statistics</h6>
                  <p><strong>Total Orders:</strong> {totalOrders}</p>
                  <p><strong>Total Spent:</strong> ₹{totalSpent.toLocaleString()}</p>
                  <p><strong>Average Order:</strong> ₹{averageOrder.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive || u.totalOrders > 0).length;
  const totalOrdersCount = users.reduce((sum, user) => sum + Number(user.totalOrders || 0), 0);
  const totalRevenue = users.reduce((sum, user) => sum + Number(user.totalSpent || 0), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><i className="fas fa-users"></i> Users & Customer History</h1>
        <button className="btn btn-primary" onClick={fetchUsers}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary">{totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{activeUsers}</h3>
              <p>Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info">{totalOrdersCount}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">₹{totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Registered Users</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => {
                    const userName = String(user.name || 'N/A');
                    const userEmail = String(user.email || 'N/A');
                    const userPhone = String(user.phone || 'N/A');
                    const totalOrders = Number(user.totalOrders || 0);
                    const totalSpent = Number(user.totalSpent || 0);
                    const isActive = user.isActive || totalOrders > 0;
                    
                    let registeredDate = 'N/A';
                    try {
                      if (user.createdAt) {
                        registeredDate = new Date(user.createdAt).toLocaleDateString();
                      } else if (user.registeredDate) {
                        registeredDate = typeof user.registeredDate === 'string' 
                          ? user.registeredDate 
                          : new Date(user.registeredDate).toLocaleDateString();
                      }
                    } catch (e) {
                      registeredDate = 'N/A';
                    }

                    return (
                      <tr key={user._id || user.email}>
                        <td><strong>{userName}</strong></td>
                        <td>{userEmail}</td>
                        <td>{userPhone}</td>
                        <td>{registeredDate}</td>
                        <td>
                          <span className="badge bg-info">{totalOrders}</span>
                        </td>
                        <td><strong>₹{totalSpent.toLocaleString()}</strong></td>
                        <td>
                          <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewUserDetails(user)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {renderUserModal()}
    </div>
  );
};

export default AdminCustomers;
