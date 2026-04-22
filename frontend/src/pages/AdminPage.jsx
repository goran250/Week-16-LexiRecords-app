import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const AdminPage = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderStatus, setOrderStatus] = useState('pending');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, activeTab, orderStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'orders') {
        const response = await apiService.getOrders(null, orderStatus);
        setOrders(response.data);
      } 
    } catch (err) {
      setError('Kunde inte hämta data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiService.updateOrder(orderId, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Kunde inte uppdatera order');
    }
  };


  const handleAdmin = () => {
    navigate(`/admin/registerAdmin`);
  };

  const handleAddProduct = () => {
     navigate(`/admin/addProduct`);
  }

   const handleProducts = () => {
     navigate(`/admin/products`);
  }



  return (
    <div className="container">
      <h1 className="page-title">Admin Panel</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button 
          className={activeTab === 'orders' ? 'primary blue' : 'secondary'}
          onClick={() => setActiveTab('orders')}
        >
          Ordrar
        </button>

        <button className="secondary" onClick={ handleProducts}>Produkter</button>

        <button className="secondary" onClick={ handleAddProduct}>Lägg till produkt</button>
       
        <button className="secondary" onClick={handleAdmin}>Registrera admin</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className={orderStatus === 'pending' ? 'primary blue' : 'secondary'}
              onClick={() => setOrderStatus('pending')}
            >
              Väntande
            </button>
            <button 
              className={orderStatus === 'shipped' ? 'primary blue' : 'secondary'}
              onClick={() => setOrderStatus('shipped')}
            >
              Skickade
            </button>
          </div>

          {loading ? (
            <div className="loading">Läser in ordrar...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state"><h3>Inga ordrar</h3></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Kundnamn</th>
                  <th>Datum</th>
                  <th>Totalt</th>
                  <th>Status</th>
                  <th>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id.substring(0, 8)}</td>
                    <td>{order.userName}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('sv-SE')}</td>
                    <td>{order.totalPrice} kr</td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Väntande</option>
                        <option value="shipped">Skickad</option>
                        <option value="delivered">Levererad</option>
                      </select>
                    </td>
                    <td>
                      <button className="secondary" onClick={() => navigate(`/order/${order.id}`)} style={{ marginRight: '5px' }}>
                        Visa
                      </button>
                      <button className="danger" onClick={() => handleDeleteOrder(order.id)}>
                        Ta bort
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

      {/* Add Product Tab */}
      /**
      {activeTab === 'add' && (
        <AddProductForm onSuccess={() => {
          document.getElementById('success-message').innerHTML = 'Skivan har registrerats.';
        }} />
      )}
       */
/**
const AddProductForm = ({ onSuccess }) => {
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

  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState('');

  const categories = {
    'Nya skivor': ['LP-skivor', 'Maxi-singlar', 'Singlar'],
    'Begagnade skivor': ['LP-skivor', 'Maxi-singlar', 'Singlar']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    setLoading(true);
    setError('');

    try {
      await apiService.createProduct(formData);
      onSuccess();
    } catch (err) {
      setError('Kunde inte skapa produkt');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px' }}>
      <h2 style={{ marginBottom: '20px' }}>Lägg till ny produkt</h2>
      
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
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Utgivningsår</label>
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lager</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bildlänk</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary blue" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Skapar...' : 'Lägg till produkt'}
        </button>
      </form>

          <div id="success-message"></div>
    </div>
  );
};
 */
export default AdminPage;
