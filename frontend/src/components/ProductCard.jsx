import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { apiService } from '../services/api';

const ProductCard = ({ product, onDelete, isAdmin }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleEdit = () => {
    navigate(`/admin/product/${product.id}`);
  };

  return (
    <div className="card product-card">
      <img 
        src={product.image} 
        alt={product.title} 
        className="product-image"
        onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'}
      />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-price">{product.price} kr</div>
      <div className="product-stock">
        Lager: {product.stock > 0 ? product.stock : 'Slut'}
      </div>
      
      <div className="product-actions">
        {isAdmin ? (
          <>
            <button className="secondary" onClick={handleEdit}>Redigera</button>
            <button className="danger" onClick={() => onDelete(product.id)}>Ta bort</button>
          </>
        ) : (
          <button 
            className="primary" 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            Lägg i varukorg
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
