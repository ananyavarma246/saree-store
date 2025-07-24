import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onAddToCart }) {
  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {products.map(product => (
        <ProductCard key={product._id || product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default ProductList;