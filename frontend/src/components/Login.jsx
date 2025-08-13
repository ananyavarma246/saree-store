import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const Login = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Check if this is admin login
      const isAdminLogin = formData.email === 'admin@alankree.com';
      
      // Choose the appropriate endpoint using API config
      const endpoint = isAdminLogin ? 
        API_ENDPOINTS.admin.login : 
        API_ENDPOINTS.auth.login;
      
      console.log('🔐 Login attempt:', { isAdmin: isAdminLogin, endpoint });
      
      // Call the backend API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (isAdminLogin) {
          // Handle admin login
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminData', JSON.stringify(data.admin));
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          // Handle regular user login
          const userData = {
            ...data.user,
            token: data.token,
            loginTime: new Date().toISOString()
          };
          
          localStorage.setItem('userAuth', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn', 'true');
        }
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChange', { 
          detail: { 
            isLoggedIn: true, 
            user: isAdminLogin ? data.admin : data.user,
            isAdmin: isAdminLogin
          } 
        }));
        
        onClose();
        
        // If admin, reload the page to show admin panel
        if (isAdminLogin) {
          console.log('Admin login successful, switching to admin panel...');
          window.location.reload();
        }
      } else {
        setErrors({ general: data.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="text-center mb-4">
        <h4 className="fw-bold">Welcome Back</h4>
        <p className="text-muted">Sign in to your account</p>
      </div>

      {errors.general && (
        <div className="alert alert-danger" role="alert">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary-custom w-100 mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="text-center">
          <a href="#" className="text-decoration-none small">Forgot your password?</a>
        </div>
      </form>

      <hr className="my-4" />

      <div className="text-center">
        <p className="mb-2">Don't have an account?</p>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onSwitchToRegister}
        >
          Create Account
        </button>
      </div>

      {/* Social Login Options */}
      <div className="mt-4">
        <div className="text-center mb-3">
          <small className="text-muted">Or continue with</small>
        </div>
        <div className="row g-2">
          <div className="col-6">
            <button className="btn btn-outline-secondary w-100">
              <i className="fab fa-google me-2"></i>Google
            </button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-secondary w-100">
              <i className="fab fa-facebook-f me-2"></i>Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
