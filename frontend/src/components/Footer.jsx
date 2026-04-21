import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
            <div className="logo" onClick={() => navigate('/')}>
                <img src="./src/images/logotype.webp" alt="LexiRecords logotype" class="logotype-img"/>
            </div>
            <p class="din-favorit-text">Din favorit skivbutik för nya och begagnade skivor av högsta kvalitet.</p>
        </div>
        
        <div className="footer-section special">
          <h3>Kategorier</h3>
          <a href="/shop?category=Nya%20skivor">Nya skivor</a>
          <a href="/shop?category=Begagnade%20skivor">Begagnade skivor</a>
        </div>
        
        <div className="footer-section">
          <h3>Kundservice</h3>
          <a href="#">Om oss</a>
          <a href="#">Kontakt</a>
          <a href="#">Leveransbetingelser</a>
        </div>
        
        <div className="footer-section">
          <h3>Kontakt</h3>
          <p>E-post: info@lexirecords.se</p>
          <p>Telefon: 0123-456789</p>
          <p>Öppettider: Mån-Fre 10:00-18:00</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 LexiRecords. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
};

export default Footer;
