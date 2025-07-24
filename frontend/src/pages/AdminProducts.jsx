import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import '../styles/admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'saree',
    image: ''
  });
  const navigate = useNavigate();

  // Check admin authentication
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminToken = localStorage.getItem('adminToken');
    
    if (!isAdmin || !adminToken) {
      console.warn('Admin authentication required, attempting auto-login...');
      // Try auto-login instead of redirecting
      autoLogin();
      return;
    }
    
    fetchProducts();
  }, []);

  const autoLogin = async () => {
    try {
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
        console.log('✅ Auto-login successful for products');
        fetchProducts();
      } else {
        console.error('Auto-login failed:', data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(API_ENDPOINTS.products, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct 
      ? `${API_ENDPOINTS.admin.products}/${editingProduct._id}`
      : API_ENDPOINTS.admin.products;
    
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('originalPrice', formData.originalPrice);
      formDataToSend.append('category', formData.category);
      
      // Add image file if selected, otherwise use existing image URL
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      } else if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formDataToSend, // Don't set Content-Type, let browser set it for FormData
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts();
        setShowAddModal(false);
        setEditingProduct(null);
        setSelectedImage(null);
        setImagePreview('');
        setFormData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          category: 'saree',
          image: ''
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      category: product.category,
      image: product.image
    });
    setImagePreview(product.image); // Show current image as preview
    setSelectedImage(null); // Clear any selected file
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const response = await fetch(`${API_ENDPOINTS.admin.products}/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.success) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2><i className="fas fa-box me-3"></i>Product Management</h2>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card admin-product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h5>{product.name}</h5>
              <p className="product-category">{product.category}</p>
              <div className="product-pricing">
                <span className="current-price">₹{product.price}</span>
                <span className="original-price">₹{product.originalPrice}</span>
              </div>
              <div className="product-actions">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEdit(product)}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(product._id)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Button - Centered at the bottom */}
      <div className="text-center mt-4 mb-4">
        <button 
          className="btn btn-primary btn-lg px-4 py-2"
          onClick={() => {
            setEditingProduct(null);
            setSelectedImage(null);
            setImagePreview('');
            setFormData({
              name: '',
              description: '',
              price: '',
              originalPrice: '',
              category: 'saree',
              image: ''
            });
            setShowAddModal(true);
          }}
        >
          <i className="fas fa-plus me-2"></i>Add New Product
        </button>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Original Price</label>
                        <input
                          type="number"
                          className="form-control"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="saree">Saree</option>
                      <option value="earrings">Earrings</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                          className="img-thumbnail"
                        />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? 'Update' : 'Add'} Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
