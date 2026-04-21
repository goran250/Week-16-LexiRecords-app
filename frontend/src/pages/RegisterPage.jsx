import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (fullname == "") {
        setError('Fyll i ditt fullständiga namn!');
    }
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken långt');
      return;
    }

    setLoading(true);

    try {
      await register(fullname, email, password, street, zipCode, city, country);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Registrera konto</h2>
      
      {error && <div className="alert error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fullständigt namn</label>
          <input
            type="text"
            value={fullname} 
            onChange={(e) => setFullname(e.target.value)}
            required
            placeholder="Ditt fullständiga namn"
          />
        </div>

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
          <label>Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Minst 6 tecken"
          />
        </div>

        <div className="form-group">
          <label>Bekräfta lösenord</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Upprepa ditt lösenord"
          />
        </div>
        
        <h3 className="h3-tag">Leveransadress (frivilligt)</h3>
        <div className="form-group">
          <label>Gata</label>
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Postnummer</label>
          <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Ort</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <div className="form-group">
            <label>Land</label>
            <select name="country" id="country" value={country} onChange={(e) => setCountry(document.getElementById("country").value) }>
                <option value="Sverige">Sverige</option>
                <option value="Annat">Annat</option>
            </select>
        </div>

        <button type="submit" className="primary blue" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Registrerar...' : 'Registrera'}
        </button>
      </form>

      <div className="auth-link">
        Har du redan ett konto? <a onClick={() => navigate('/login')}>Logga in här</a>
      </div>
    </div>
  );
};

export default RegisterPage;
