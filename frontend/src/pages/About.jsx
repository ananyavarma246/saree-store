import React from 'react';

function About() {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
          About Alankree
        </h1>
        <p className="lead text-muted">
          Crafting elegance, preserving tradition, celebrating beauty
        </p>
      </div>

      {/* Our Story */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>Our Story</h2>
          <p className="mb-3">
            Founded in 2020, Alankree began as a passion project to make authentic Indian ethnic wear 
            accessible to women everywhere. Our name "Alankree" derives from the Sanskrit word meaning 
            "ornament" or "decoration," reflecting our commitment to helping every woman feel beautifully adorned.
          </p>
          <p className="mb-3">
            What started as a small collection of handpicked sarees has grown into a comprehensive 
            destination for ethnic fashion, featuring carefully curated sarees
            and stunning jewelry that celebrates the rich heritage of Indian craftsmanship.
          </p>
          <p>
            Today, we serve thousands of customers across the country, bringing them quality, 
            elegance, and tradition at prices that make beautiful fashion accessible to all.
          </p>
        </div>
        <div className="col-lg-6">
          <img 
            src="https://images.unsplash.com/photo-1631985372219-3c0e8b4a85c3?auto=format&fit=crop&w=600&q=80" 
            alt="Our Story" 
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="row mb-5">
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-bullseye fs-1 text-primary"></i>
              </div>
              <h4 className="fw-bold mb-3">Our Mission</h4>
              <p className="text-muted">
                To make authentic Indian ethnic wear accessible to every woman, combining traditional 
                craftsmanship with modern convenience. We strive to preserve cultural heritage while 
                adapting to contemporary lifestyle needs.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-eye fs-1 text-success"></i>
              </div>
              <h4 className="fw-bold mb-3">Our Vision</h4>
              <p className="text-muted">
                To become the most trusted destination for ethnic fashion, known for quality, 
                authenticity, and customer satisfaction. We envision a world where every woman 
                can express her cultural identity with confidence and pride.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-5" style={{ color: 'var(--primary-color)' }}>Our Values</h2>
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="text-center">
              <div className="feature-icon mx-auto mb-3">
                <i className="fas fa-star"></i>
              </div>
              <h5 className="fw-bold mb-2">Quality</h5>
              <p className="text-muted small">
                We never compromise on quality. Every product is carefully inspected and tested.
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="text-center">
              <div className="feature-icon mx-auto mb-3">
                <i className="fas fa-handshake"></i>
              </div>
              <h5 className="fw-bold mb-2">Trust</h5>
              <p className="text-muted small">
                Building lasting relationships with our customers through transparency and reliability.
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="text-center">
              <div className="feature-icon mx-auto mb-3">
                <i className="fas fa-palette"></i>
              </div>
              <h5 className="fw-bold mb-2">Authenticity</h5>
              <p className="text-muted small">
                Preserving traditional designs while embracing contemporary fashion trends.
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="text-center">
              <div className="feature-icon mx-auto mb-3">
                <i className="fas fa-heart"></i>
              </div>
              <h5 className="fw-bold mb-2">Passion</h5>
              <p className="text-muted small">
                Our love for ethnic fashion drives everything we do, from sourcing to service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-5" style={{ color: 'var(--primary-color)' }}>Meet Our Team</h2>
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80" 
                  alt="Founder" 
                  className="rounded-circle mb-3"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <h5 className="fw-bold mb-1">Priya Sharma</h5>
                <p className="text-muted mb-2">Founder & CEO</p>
                <p className="text-muted small">
                  Passionate about preserving Indian textile traditions and making them accessible globally.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                  alt="Designer" 
                  className="rounded-circle mb-3"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <h5 className="fw-bold mb-1">Rajesh Kumar</h5>
                <p className="text-muted mb-2">Head of Design</p>
                <p className="text-muted small">
                  Expert in traditional Indian motifs and contemporary fashion trends.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" 
                  alt="Manager" 
                  className="rounded-circle mb-3"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <h5 className="fw-bold mb-1">Anjali Singh</h5>
                <p className="text-muted mb-2">Customer Experience Manager</p>
                <p className="text-muted small">
                  Dedicated to ensuring every customer has an exceptional shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="features-section py-5 rounded-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold text-white">10K+</h2>
              <p className="text-white">Happy Customers</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold text-white">500+</h2>
              <p className="text-white">Products</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold text-white">50+</h2>
              <p className="text-white">Cities Served</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold text-white">4.8</h2>
              <p className="text-white">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;