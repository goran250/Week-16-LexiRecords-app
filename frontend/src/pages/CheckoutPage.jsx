import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    zipCode: '',
    city: '',
    country: 'Sverige'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState('');

  const orderTotal = getTotalPrice();
  const shippingCost = orderTotal >= 400 ? 0 : 59;
  const finalTotal = orderTotal + shippingCost;
  const canSend = address.fullName && address.street && address.postalCode && address.city && address.country && cartItems.length > 0;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [user, cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeCountry = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOrder = async () => {
    if (!canSend) {
      setError('Fyll i leveransadress innan du skickar ordern.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.createOrder({
        userId: user.id,
        userName: user.fullName,
        items: cartItems,
        totalPrice: finalTotal
      });

      clearCart();
      setCreatedOrderId(response.data.id);
      setSuccessMessage('Din order är mottagen och kommer att behandlas snarast möjligt.');
    } catch (err) {
      console.error('Orderfel:', err);
      setError('Kunde inte skicka ordern. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Kassa</h1>

      {successMessage ? (
        <div className="card" style={{ padding: '30px' }}>
          <div className="alert success">{successMessage}</div>
          <p><strong>Ordernummer:</strong> {createdOrderId}</p>
          <p>Ordern är registrerad som väntande i systemet.</p>
          <button className="primary" style={{ marginTop: '20px' }} onClick={() => navigate('/orders')}>
            Gå till Mina Ordrar
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: 'var(--primary-blue)' }}>Leveransadress</h2>

            {error && <div className="alert error">{error}</div>}

            <div className="form-group">
              <label>Fullständigt namn</label>
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                placeholder="Förnamn Efternamn"
              />
            </div>

            <div className="form-group">
              <label>Gatuadress</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="Gata 1"
              />
            </div>

            <div className="form-group">
              <label>Postnummer</label>
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={handleChange}
                placeholder="12345"
              />
            </div>

            <div className="form-group">
              <label>Ort</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="Stad"
              />
            </div>

            <div className="form-group">
              <label>Land</label>
              <select name="country" value={address.country} onChange={handleChangeCountry}>
                <option value="Sverige">Sverige</option>
                <option value="Annat">Annat</option>
              </select>
            </div>

            <button
              className="primary"
              onClick={handleSendOrder}
              disabled={!canSend || loading}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loading ? 'Skickar order...' : 'Skicka order'}
            </button>
          </div>

          <div className="card" style={{ height: 'fit-content' }}>
            <h2 style={{ marginBottom: '20px', color: 'var(--primary-blue)' }}>Orderöversikt</h2>
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Produkter:</strong> {cartItems.length}</p>
              <p><strong>Varusumma:</strong> {orderTotal} kr</p>
              <p><strong>Fraktkostnad:</strong> {shippingCost} kr</p>
              <p style={{ marginTop: '15px', fontSize: '18px' }}>
                Total: <strong>{finalTotal} kr</strong>
              </p>
            </div>
            <div className="alert info">
              Frakt är {shippingCost === 0 ? 'gratis' : '59 kr'} för leveranser inom Sverige.
              Ordrar över 400 kr är fraktfria.
            </div>
            <div style={{ marginTop: '20px' }}>
              <h3>Produkter i varukorg</h3>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                {cartItems.map(item => (
                  <li key={item.id}>{item.title} × {item.quantity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
