import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await apiService.getOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      setError('Kunde inte hämta order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Läser in order...</div>;
  if (error) return <div className="alert error">{error}</div>;
  if (!order) return <div className="empty-state"><h3>Order inte hittad</h3></div>;

  return (
    <div className="container">
      <h1 className="page-title">Order #{order.id.substring(0, 8)}</h1>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Orderdetaljer</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> 
              <span style={{
                display: 'inline-block',
                marginLeft: '10px',
                padding: '4px 12px',
                borderRadius: '4px',
                backgroundColor: order.status === 'pending' ? '#ffc107' : '#28a745',
                color: 'white'
              }}>
                {order.status === 'pending' ? 'Väntande' : order.status === 'shipped' ? 'Skickad' : order.status}
              </span>
            </p>
            <p><strong>Datum:</strong> {new Date(order.createdAt).toLocaleDateString('sv-SE')}</p>
          </div>
          <div>
            <p><strong>Totalt:</strong> {order.totalPrice} kr</p>
            <p><strong>Antal produkter:</strong> {order.items.length}</p>
          </div>
        </div>

        <h3 style={{ marginBottom: '15px' }}>Produkter</h3>
        <table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Pris</th>
              <th>Mängd</th>
              <th>Totalt</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.price} kr</td>
                <td>{item.quantity}</td>
                <td>{item.price * item.quantity} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailPage;
