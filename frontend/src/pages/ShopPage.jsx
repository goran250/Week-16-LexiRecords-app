import React, { useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Nya skivor');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [error, setError] = useState('');

  const categories = {
    'Nya skivor': ['LP-skivor', 'Maxi-singlar', 'Singlar'],
    'Begagnade skivor': ['LP-skivor', 'Maxi-singlar', 'Singlar']
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory]);


  const fetchProducts = async () => {
    try {
      
      setLoading(true);
     
      const response = await apiService.getProducts(selectedCategory, selectedSubcategory);
      setProducts(response.data);
      setError('');
    }
    catch (err) {
      setError('Kunde inte hämta produkter');
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" >
      <h1 className="page-title">Skivhandeln</h1>

      <div className="cardColumnProducts">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Kategorier</div>
          {Object.keys(categories).map(category => (
            <div key={category}>
              <div className={`sidebar-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSubcategory(null);
                }}
              >
                {category}
              </div>
              {selectedCategory === category && (
                <div style={{ paddingLeft: '10px' }}>
                  {categories[category].map(sub => (
                    <div
                      key={sub}
                      className={`sidebar-item ${selectedSubcategory === sub ? 'active' : ''}`}
                      onClick={() => setSelectedSubcategory(sub)}
                      style={{ fontSize: '12px', paddingLeft: '15px', maxWidth: '290px' }}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Products */}
        <main>
          {error && <div className="alert error">{error}</div>}

          {loading ? (
            <div className="loading">Läser in produkter...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>Inga produkter hittades</h3>
              <p>Försök en annan kategori</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
