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
      await registerAdmin(fullname, email, password);
      // navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Registrera person med admin behörighet</h2>
      
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
        
        <button type="submit" className="primary" disabled={loading} style={{ width: '100%' }}>Registrera</button>
      </form>
    </div>
  );
};

export default RegisterAdminPage;
