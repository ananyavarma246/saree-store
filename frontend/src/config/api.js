// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  products: `${API_BASE_URL}/api/products`,
  admin: {
    login: `${API_BASE_URL}/api/admin/login`,
    products: `${API_BASE_URL}/api/admin/products`,
    users: `${API_BASE_URL}/api/admin/users`,
    orders: `${API_BASE_URL}/api/admin/orders`,
    dashboard: `${API_BASE_URL}/api/admin/dashboard`
  },
  orders: {
    create: `${API_BASE_URL}/api/orders/create`
  },
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`
  }
};

export default API_ENDPOINTS;
