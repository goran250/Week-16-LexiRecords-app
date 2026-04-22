import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterAdminPage = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerAdmin } = useContext(AuthContext);
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (fullname == "") {
        setError('Fyll i ett fullständigt namn!');
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
      registerAdmin(fullname, email, password);    
    } 
    catch (err) {
      setError(err);
    } 
    finally {
      document.getElementById('success-message').style.display = "block";
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Admin Panel</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button className="secondary" onClick={() => navigate('/admin')}>Ordrar</button>

        <button className="secondary" onClick={() => navigate('/admin/products')}>Produkter</button>
       
        <button className="secondary" onClick={() => navigate('/admin/addProduct')}>Lägg till produkt</button>
      </div>
 
      <div className="card" style={{ maxWidth: '500px' }}>

        <h2 className="auth-title">Registrera ny användare med adminbehörighet</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Fullständigt namn</label>
            <input
              type="text"
              value={fullname} 
              onChange={(e) => setFullname(e.target.value)}
              required
              placeholder="Fullständigt namn"
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
          
          <div className="form-actions">
            <button type="submit" className="primary blue" disabled={loading}>Registrera</button>
            <button type="button" className="secondary" onClick={() => navigate('/admin')}>Avbryt</button>
          </div>
        </form>
        <div id="success-message">En ny användare med adminbehörighet har skapats.</div>
      </div>
    </div>
  );
};

export default RegisterAdminPage;
