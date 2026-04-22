import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Logga in</h2>
      
      {error && <div className="alert error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>E-postadress</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="din@epost.se"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ditt lösenord"
          />
        </div>

        <button type="submit" className="primary blue" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Loggar in...' : 'Logga in'}
        </button>
      </form>

      <div className="auth-link">
        Har du inget konto? <a onClick={() => navigate('/registerUser')}>Registrera dig här</a>
      </div>
    </div>
  );
};

export default LoginPage;
