import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const CustomerOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getOrders(user.id, activeTab === 'all' ? null : activeTab);
      setOrders(response.data);
    } catch (err) {
      setError('Kunde inte hämta ordrar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Mina Ordrar</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={activeTab === 'pending' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('pending')}
        >
          Pågående
        </button>
        <button 
          className={activeTab === 'shipped' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('shipped')}
        >
          Skickade
        </button>
        <button 
          className={activeTab === 'all' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('all')}
        >
          Alla
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="loading">Läser in ordrar...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h3>Inga ordrar hittade</h3>
          <p>Du har inga {activeTab === 'pending' ? 'pågående' : activeTab === 'shipped' ? 'skickade' : ''} ordrar ännu</p>
          <button className="primary" onClick={() => navigate('/shop')}>
            Börja handla
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {orders.map(order => (
            <div key={order.id} className="card">
              <h3>Order #{order.id.substring(0, 8)}</h3>
              <p>
                <strong>Status:</strong>{' '}
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: order.status === 'pending' ? '#ffc107' : '#28a745',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {order.status === 'pending' ? 'Väntande' : order.status === 'shipped' ? 'Skickad' : order.status}
                </span>
              </p>
              <p><strong>Datum:</strong> {new Date(order.createdAt).toLocaleDateString('sv-SE')}</p>
              <p><strong>Totalt:</strong> {order.totalPrice} kr</p>
              <p><strong>Antal produkter:</strong> {order.items.length}</p>
              <button className="primary" onClick={() => navigate(`/order/${order.id}`)} style={{ width: '100%', marginTop: '15px' }}>
                Se detaljer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
