import React, { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    subject: '',
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for contacting Alankree! We will get back to you within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
          <i className="fas fa-envelope me-3"></i>
          Contact Us
        </h1>
        <p className="lead text-muted">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="row">
        {/* Contact Information */}
        <div className="col-lg-4 mb-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                Get in Touch
              </h4>
              
              <div className="contact-info">
                <div className="d-flex align-items-center mb-3">
                  <div className="feature-icon me-3" style={{ width: '50px', height: '50px', fontSize: '1rem' }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Visit Our Store</h6>
                    <p className="mb-0 text-muted small">
                      123 Fashion Street<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="feature-icon me-3" style={{ width: '50px', height: '50px', fontSize: '1rem' }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Call Us</h6>
                    <p className="mb-0 text-muted small">
                      +91 98765 43210<br />
                      +91 87654 32109
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="feature-icon me-3" style={{ width: '50px', height: '50px', fontSize: '1rem' }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Email Us</h6>
                    <p className="mb-0 text-muted small">
                      hello@alankree.com<br />
                      support@alankree.com
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="feature-icon me-3" style={{ width: '50px', height: '50px', fontSize: '1rem' }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Business Hours</h6>
                    <p className="mb-0 text-muted small">
                      Mon - Sat: 9:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <h6 className="mb-3">Follow Us</h6>
                <a href="#" className="me-2" title="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="me-2" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="me-2" title="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="me-2" title="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" title="Pinterest">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                Send us a Message
              </h4>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-user me-2"></i>
                      Full Name *
                    </label>
                    <input 
                      className="form-control" 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      required
                      style={{ borderRadius: '10px', padding: '12px 16px' }}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address *
                    </label>
                    <input 
                      className="form-control" 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      required
                      style={{ borderRadius: '10px', padding: '12px 16px' }}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-phone me-2"></i>
                      Phone Number
                    </label>
                    <input 
                      className="form-control" 
                      name="phone" 
                      type="tel"
                      value={form.phone} 
                      onChange={handleChange}
                      style={{ borderRadius: '10px', padding: '12px 16px' }}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-tag me-2"></i>
                      Subject *
                    </label>
                    <select 
                      className="form-select" 
                      name="subject" 
                      value={form.subject} 
                      onChange={handleChange} 
                      required
                      style={{ borderRadius: '10px', padding: '12px 16px' }}
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="order-support">Order Support</option>
                      <option value="return-exchange">Return & Exchange</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-comment me-2"></i>
                    Message *
                  </label>
                  <textarea 
                    className="form-control" 
                    name="message" 
                    rows={6} 
                    value={form.message} 
                    onChange={handleChange} 
                    required
                    style={{ borderRadius: '10px', padding: '12px 16px' }}
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button 
                  className="btn btn-primary-custom px-4 py-3" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-5">
        <h3 className="text-center fw-bold mb-5" style={{ color: 'var(--primary-color)' }}>
          Frequently Asked Questions
        </h3>
        
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-2">What are your shipping charges?</h6>
                <p className="text-muted mb-0">
                  We offer free shipping on orders above ₹999. For orders below ₹999, 
                  shipping charges are ₹99 within India.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-2">What is your return policy?</h6>
                <p className="text-muted mb-0">
                  We offer a 30-day hassle-free return policy. Items must be in original 
                  condition with tags attached.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-2">How long does delivery take?</h6>
                <p className="text-muted mb-0">
                  Standard delivery takes 3-7 business days. Express delivery (1-3 days) 
                  is available for select cities.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-2">Do you offer international shipping?</h6>
                <p className="text-muted mb-0">
                  Currently, we only ship within India. International shipping will be 
                  available soon. Subscribe to our newsletter for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;