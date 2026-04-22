import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  return (
    <div className="container">
      <h1 className="page-title">Varukorg</h1>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <h3>Din varukorg är tom</h3>
          <p>Lägg till något för att komma igång!</p>
          <button className="primary blue" style={{ margin: '30px 0 0 0'}} onClick={() => navigate('/shop')}>
            Gå till affären
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
          {/* Items */}
          <div>
            <table>
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Pris</th>
                  <th>Mängd</th>
                  <th>Totalt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.artist} - {item.title}</td>
                    <td>{item.price} kr</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        style={{ width: '50px' }}
                      />
                    </td>
                    <td>{item.price * item.quantity} kr</td>
                    <td>
                      <button className="danger" onClick={() => removeFromCart(item.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--primary-blue)' }}>Ordersammanfattning</h3>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>
              Summa: <strong>{getTotalPrice()} kr</strong>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--light-text)', marginBottom: '20px' }}>
              Frakt kommer läggas till vid kassa
            </div>
            <button className="primary blue" onClick={handleCheckout} style={{ width: '100%', marginBottom: '10px' }}>
              Gå till kassa
            </button>
            <button className="secondary" onClick={() => navigate('/shop')} style={{ width: '100%' }}>
              Fortsätt handla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
