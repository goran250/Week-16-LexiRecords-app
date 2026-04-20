import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--light-blue) 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <img src="./src/images/logo-record.webp" alt="LexiRecords logotype" className="logotype-img" style={{ marginBottom: '20px' }} />
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>Din favorit skivbutik för nya och begagnade skivor</p>
        <button className="primary" onClick={() => navigate('/shop')} style={{ fontSize: '16px', padding: '12px 30px' }}>
          Börja handla
        </button>
      </div>

      {/* Features Section */}
      <div className="container" style={{ marginTop: '60px', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-blue)' }}>
          Varför välja LexiRecords?
        </h2>

        <div className="grid grid-3">
          <div className="card">
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎧</div>
            <h3 style={{ marginBottom: '10px' }}>Stort urval</h3>
            <p>Vi har ett stort urval av nya och begagnade skivor från många artister och genre.</p>
          </div>

          <div className="card">
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>💰</div>
            <h3 style={{ marginBottom: '10px' }}>Bra priser</h3>
            <p>Vi erbjuder konkurrenskraftiga priser på både nya och begagnade skivor.</p>
          </div>

          <div className="card">
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📦</div>
            <h3 style={{ marginBottom: '10px' }}>Snabb leverans</h3>
            <p>Vi skickar din beställning snabbt och säkert direkt till din dörr.</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div style={{ background: '#f0f4f8', padding: '60px 20px' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', marginBottom: '40px', textAlign: 'center', color: 'var(--primary-blue)' }}>
            Våra kategorier
          </h2>

          <div className="grid grid-2">
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/shop?category=Nya%20skivor')}>
              <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Nya skivor</h3>
              <p>Upptäck de senaste utgåvorna från dina favorit artister.</p>
              <p style={{ marginTop: '15px', color: 'var(--light-blue)', fontWeight: 'bold' }}>Se alla »</p>
            </div>

            <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/shop?category=Begagnade%20skivor')}>
              <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Begagnade skivor</h3>
              <p>Hitta klassiska skatter till fantastiska priser.</p>
              <p style={{ marginTop: '15px', color: 'var(--light-blue)', fontWeight: 'bold' }}>Se alla »</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
