import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  // const [formData, setFormData] = useState(null);
  const [formData, setFormData] = useState({
    artist: '',
    title: '',
    category: 'Nya skivor',
    subcategory: 'LP-skivor',
    price: '',
    description: '',
    releaseYear: '',
    stock: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const categories = {
    'Nya skivor': ['LP-skivor', 'Maxi-singlar', 'Singlar'],
    'Begagnade skivor': ['LP-skivor', 'Maxi-singlar', 'Singlar']
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await apiService.getProduct(productId);
      setProduct(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Kunde inte hämta produkten');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? (value ? parseFloat(value) : 0) : value
    }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: categories[category][0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiService.updateProduct(productId, formData);
    } 
    catch (err) {
      setError('Kunde inte uppdatera produkten');
    } 
    finally {
      document.getElementById('success-message').style.display = "block";
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Läser in produkten...</div>;
  if (!formData) return <div className="alert error">{error}</div>;

  return (
    <div className="container">
      <h1 className="page-title">Admin Panel</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button className="secondary" onClick={() => navigate('/admin')}>Ordrar</button>
        <button className="secondary" onClick={() => navigate('/products')}>Produkter</button>
        <button className="secondary" onClick={() => navigate(`/admin/addProduct`)}>Lägg till produkt</button>
        <button className="secondary" onClick={() => navigate('/admin/registerAdmin')}>Registrera admin</button>
      </div>

      <div className="card" style={{ maxWidth: '500px' }}>
        <h2 className="page-title">Redigera produkt</h2>
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Artist/Grupp</label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Titel</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Huvudkategori</label>
            <select 
              name="category" 
              value={formData.category}
              onChange={handleCategoryChange}
            >
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Underkategori</label>
            <select name="subcategory" value={formData.subcategory} onChange={handleChange}>
              {categories[formData.category].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Pris (kr)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Beskrivning</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group">
            <label>Utgivningsår</label>
            <input type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Lager</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Bildlänk</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary blue" disabled={saving}>{saving ? 'Sparar...' : 'Spara ändringar'}</button>
            <button type="button" className="secondary" onClick={() => navigate('/products')}>
              Avbryt
            </button>
          </div>
        </form>
      </div>

      <div id="success-message" style={{ maxWidth: '500px' }}>Produkten har sparats.</div>
    </div>
  );
};

export default EditProductPage;
