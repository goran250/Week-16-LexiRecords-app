import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="./src/images/logotype.webp" alt="LexiRecord logotype" className="logotype-img"/>
        </div>

        <nav className="nav-center">
          <span className="nav-link" onClick={() => navigate('/shop')}>
            Affären
          </span>
          {isAuthenticated && (
            <>
              {isAdmin ? (
                <span className="nav-link" onClick={() => navigate('/admin')}>
                  Admin
                </span>
              ) : (
                <span className="nav-link" onClick={() => navigate('/orders')}>
                  Mina Ordrar
                </span>
              )}
            </>
          )}
        </nav>

        <div className="nav-right">
          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <span style={{ fontSize: '13px' }}>{user.email}</span>
              <button className="primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleLogout}>
                Logga ut
              </button>
            </>
          ) : (
            <>
              <button className="primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/login')}>
                Logga in
              </button>
              <button className="secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/register')}>
                Registrera
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
