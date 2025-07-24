import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-section">
              <h5>
                <i className="fas fa-gem me-2"></i>
                Alankree
              </h5>
              <p className="mb-3">
                Your trusted destination for authentic and beautiful Indian wear. 
                We bring you the finest collection of sarees
                and stunning jewelry.
              </p>
              <div className="social-links">
                <a href="#" title="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" title="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" title="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" title="Pinterest">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/">Home</Link>
                </li>
                <li className="mb-2">
                  <Link to="/sarees">Sarees</Link>
                </li>
                <li className="mb-2">
                  <Link to="/earrings">Earrings</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">About Us</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5>Customer Care</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li className="mb-2">
                  <a href="#">Shipping Info</a>
                </li>
                <li className="mb-2">
                  <a href="#">Returns & Exchanges</a>
                </li>
                <li className="mb-2">
                  <a href="#">Size Guide</a>
                </li>
                <li className="mb-2">
                  <a href="#">FAQ</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5>Policies</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#">Privacy Policy</a>
                </li>
                <li className="mb-2">
                  <a href="#">Terms of Service</a>
                </li>
                <li className="mb-2">
                  <a href="#">Refund Policy</a>
                </li>
                <li className="mb-2">
                  <a href="#">Wholesale</a>
                </li>
                <li className="mb-2">
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5>Connect</h5>
              <div className="mb-3">
                <i className="fas fa-phone me-2"></i>
                <small>+91 98765 43210</small>
              </div>
              <div className="mb-3">
                <i className="fas fa-envelope me-2"></i>
                <small>hello@alankree.com</small>
              </div>
              <div className="mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                <small>Mumbai, Maharashtra, India</small>
              </div>
              <div className="mb-3">
                <i className="fas fa-clock me-2"></i>
                <small>Mon-Sat: 9AM-6PM</small>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-4" style={{ borderColor: 'var(--secondary-color)' }} />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">
              &copy; {currentYear} Alankree. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end align-items-center">
              <small className="me-3">We Accept:</small>
              <i className="fab fa-cc-visa me-2 fs-4"></i>
              <i className="fab fa-cc-mastercard me-2 fs-4"></i>
              <i className="fab fa-cc-paypal me-2 fs-4"></i>
              <i className="fab fa-google-pay me-2 fs-4"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;