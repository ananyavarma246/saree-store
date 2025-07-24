import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Adding custom styles for proper image formatting
const categoryImageStyle = {
  objectFit: 'cover',
  objectPosition: 'center',
  width: '100%',
  height: '100%'
};

function Home() {
  useEffect(() => {
    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const categories = [
    {
      name: 'Sarees',
      image: '/images/image.png',
      link: '/sarees',
      description: 'Elegant traditional wear'
    },

    {
      name: 'Earrings',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      link: '/earrings',
      description: 'Beautiful accessories'
    }
  ];

  const features = [
    {
      icon: 'fas fa-medal',
      title: 'Premium Quality',
      description: 'Handpicked products with finest quality'
    },
    {
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description: 'Round the clock customer support'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 hero-content">
              <h1 className="hero-title animate-fade-in-left">
                Discover Elegant 
                <br />
                <span style={{ color: '#C8A882', fontWeight: 700 }}>Saree Collection</span>
              </h1>
              <p className="hero-subtitle animate-fade-in-left">
                Elevate your wardrobe with our exquisite collection of sarees
                and stunning earrings. Each piece is carefully curated to bring out your inner beauty.
              </p>
              <div className="d-flex flex-wrap gap-3 animate-fade-in-left">
                <Link to="/sarees" className="btn btn-primary-custom">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="col-lg-6 animate-fade-in-right">
              <div className="hero-image">
                <img
                  src="/images/image.png"
                  alt="Beautiful Saree Collection - Alankree"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ objectFit: 'cover', width: '100%', height: '500px', borderRadius: '15px', objectPosition: 'center' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5 animate-on-scroll">
            <h2 className="display-5 fw-bold mb-3">Shop by Category</h2>
            <p className="lead text-muted">Discover our carefully curated collections</p>
          </div>
          
          <div className="row g-4">
            {categories.map((category, index) => (
              <div key={index} className="col-lg-4 col-md-6 animate-on-scroll">
                <Link to={category.link} className="text-decoration-none">
                  <div className="category-card">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="category-image"
                      style={category.name === 'Sarees' ? categoryImageStyle : {}}
                    />
                    <div className="category-overlay">
                      <div className="category-title">
                        <h4>{category.name}</h4>
                        <p className="mb-0">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="text-center mb-5 animate-on-scroll">
            <h2 className="display-5 fw-bold mb-3">Why Choose Alankree?</h2>
            <p className="lead">Experience the difference with our premium services</p>
          </div>
          
          <div className="row g-4 justify-content-center">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6 animate-on-scroll">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <h5 className="mb-3">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;