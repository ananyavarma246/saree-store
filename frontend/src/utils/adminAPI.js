// Secure API utility for admin requests
class AdminAPI {
    constructor() {
        this.baseURL = 'http://localhost:5001/api/admin';
    }

    // Get admin token from localStorage
    getAdminToken() {
        return localStorage.getItem('adminToken');
    }

    // Check if user is authenticated admin
    isAdminAuthenticated() {
        const token = this.getAdminToken();
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        return token && isAdmin;
    }

    // Create authenticated headers
    getAuthHeaders() {
        const token = this.getAdminToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Create authenticated headers for form data
    getAuthHeadersFormData() {
        const token = this.getAdminToken();
        return {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for FormData, let browser set it
        };
    }

    // Handle API responses and token expiration
    async handleResponse(response) {
        if (response.status === 401) {
            // Token expired or invalid, logout admin
            this.logoutAdmin();
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Logout admin and clear stored data
    logoutAdmin() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userAuth');
        window.location.reload();
    }

    // Dashboard Stats
    async getDashboardStats() {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/dashboard`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return await this.handleResponse(response);
    }

    // Orders Management
    async getAllOrders() {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/orders`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return await this.handleResponse(response);
    }

    async updateOrderStatus(orderId, status) {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ status })
        });

        return await this.handleResponse(response);
    }

    async getOrderDetails(orderId) {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/orders/${orderId}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return await this.handleResponse(response);
    }

    // Products Management
    async getAllProducts() {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/products`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return await this.handleResponse(response);
    }

    async addProduct(productData) {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/products`, {
            method: 'POST',
            headers: this.getAuthHeadersFormData(),
            body: productData // FormData object
        });

        return await this.handleResponse(response);
    }

    async updateProduct(productId, productData) {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/products/${productId}`, {
            method: 'PUT',
            headers: this.getAuthHeadersFormData(),
            body: productData // FormData object
        });

        return await this.handleResponse(response);
    }

    async deleteProduct(productId) {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/products/${productId}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });

        return await this.handleResponse(response);
    }

    // Users Management
    async getAllUsers() {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/users`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return await this.handleResponse(response);
    }

    async getUserDetails(userId) {
        if (!this.isAdminAuthenticated()) {
            throw new Error('Admin authentication required');
        }

        const response = await fetch(`${this.baseURL}/users/${userId}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        return await this.handleResponse(response);
    }
}

// Create singleton instance
const adminAPI = new AdminAPI();

export default adminAPI;
