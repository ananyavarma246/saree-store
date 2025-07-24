import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from '../pages/AdminProducts';
import AdminCustomers from './AdminCustomers';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Get admin data from localStorage
    const adminInfo = localStorage.getItem('adminData');
    if (adminInfo) {
      setAdminData(JSON.parse(adminInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminData');
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard onSectionChange={setActiveSection} />;
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'customers':
        return <AdminCustomers />;
      default:
        return <AdminDashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="admin-panel">
      <style jsx>{`
        .admin-sidebar {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: fixed;
          width: 250px;
          z-index: 1000;
          top: 0;
          left: 0;
        }
        .admin-sidebar a {
          color: white;
          text-decoration: none;
          padding: 15px 20px;
          display: block;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s;
          cursor: pointer;
        }
        .admin-sidebar a:hover, .admin-sidebar a.active {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .admin-main-content {
          margin-left: 250px;
          padding: 20px;
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        .stats-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 15px;
          transition: transform 0.3s;
        }
        .stats-card:hover {
          transform: translateY(-5px);
        }
      `}</style>

      {/* Sidebar */}
      <nav className="admin-sidebar">
        <div className="p-4">
          <h4><i className="fas fa-crown"></i> Alankree Admin</h4>
          <small className="text-light">Welcome, {adminData?.email || 'Admin'}</small>
        </div>
        <div className="nav flex-column">
          <a 
            onClick={() => setActiveSection('dashboard')}
            className={activeSection === 'dashboard' ? 'active' : ''}
          >
            <i className="fas fa-tachometer-alt me-2"></i> Dashboard
          </a>
          <a 
            onClick={() => setActiveSection('orders')}
            className={activeSection === 'orders' ? 'active' : ''}
          >
            <i className="fas fa-shopping-cart me-2"></i> Orders Management
          </a>
          <a 
            onClick={() => setActiveSection('products')}
            className={activeSection === 'products' ? 'active' : ''}
          >
            <i className="fas fa-box me-2"></i> Sarees Inventory
          </a>
          <a 
            onClick={() => setActiveSection('customers')}
            className={activeSection === 'customers' ? 'active' : ''}
          >
            <i className="fas fa-users me-2"></i> Users & History
          </a>
          <div className="mt-auto p-3 border-top">
            <button 
              className="btn btn-outline-light btn-sm w-100" 
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-2"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="admin-main-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPanel;
