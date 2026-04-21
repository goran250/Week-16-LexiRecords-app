import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState(null);
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
      navigate('/admin');
    } catch (err) {
      setError('Kunde inte uppdatera produkten');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Läser in produkten...</div>;
  if (!formData) return <div className="alert error">{error}</div>;

  return (
    <div className="container">
      <h1 className="page-title">Redigera produkt</h1>

      <div className="card" style={{ maxWidth: '500px' }}>
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
            <select 
              name="subcategory" 
              value={formData.subcategory}
              onChange={handleChange}
            >
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
            <label>Lager</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Bildlänk</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary blue" disabled={saving}>
              {saving ? 'Sparar...' : 'Spara ändringar'}
            </button>
            <button type="button" className="secondary" onClick={() => navigate('/admin')}>
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
