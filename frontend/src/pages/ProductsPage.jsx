import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      setProducts(response.data);
    } 
    catch (err) {
      setError('Kunde inte hämta data');
      console.error(err);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Är du säker på att du vill ta bort den här produkten?')) {
      try {
        await apiService.deleteProduct(productId);
        fetchData();
      } 
      catch (err) {
      }
    }
  };


  return (
    <div className="container">
      <h1 className="page-title">Admin Panel</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button className="secondary" onClick={() => navigate('/admin')}>Ordrar</button>
        <button className="secondary" onClick={() => navigate('/admin/addProduct')}>Lägg till produkt</button>       
        <button className="secondary" onClick={() => navigate('/admin/registerAdmin')}>Registrera admin</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <h2 style={{ marginBottom: '20px' }}>Produkter</h2>

      <div>          
          <div className="grid grid-4">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDeleteProduct}
                isAdmin={true}
              />
            ))}
          </div>          
      </div>
    </div>
  );
};
export default ProductsPage;
