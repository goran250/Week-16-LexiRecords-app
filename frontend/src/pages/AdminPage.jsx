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


  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Är du säker på att du vill ta bort den här ordern?')) {
      try {
        await apiService.deleteOrder(orderId);
        fetchData();
      } catch (err) {
        alert('Kunde inte ta bort order');
      }
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

  return (
    <div className="container">
      <h1 className="page-title">Admin Panel</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button className={activeTab === 'orders' ? 'primary blue' : 'secondary'} onClick={() => setActiveTab('orders')} >Ordrar</button>

        <button className="secondary" onClick={ () => navigate(`/products`)}>Produkter</button>

        <button className="secondary" onClick={ () => navigate(`/admin/addProduct`)}>Lägg till produkt</button>

        <button className="secondary" onClick={() => navigate(`/admin/registerAdmin`)}>Registrera admin</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button className={orderStatus === 'pending' ? 'primary blue' : 'secondary'}  onClick={() => setOrderStatus('pending')} >
              Väntande
            </button>
            <button className={orderStatus === 'shipped' ? 'primary blue' : 'secondary'} onClick={() => setOrderStatus('shipped')} >
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
                      <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} >
                        <option value="pending">Väntande</option>
                        <option value="shipped">Skickad</option>
                      </select>
                    </td>
                    <td>
                      <button className="primary blue" onClick={() => navigate(`/order/${order.id}`)} style={{ marginRight: '5px' }}>
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

export default AdminPage;
