# LexiRecords - Skivbutik

En fullstack webshop för att sälja skivor, byggd med React och Vite för frontend och Express.js för backend.

## Funktioner

### Kund-funktioner
- Registrera konto med epostadress
- Logga in
- Bläddra skivor efter kategorier (Nya/Begagnade, LP/Maxi-singlar/Singlar)
- Lägg till produkter i varukorg
- Genomför köp
- Se pågående och tidigare ordrar
- Spåra orderstatus

### Admin-funktioner
- Logga in som admin
- Hantera inkomna ordrar
- Markera ordrar som skickade
- Redigera eller ta bort ordrar
- Lägg till nya skivor
- Redigera befintliga skivor
- Ta bort skivor
- Hantera lagerstatus

### Säkerhet
- Lösenordskryptering med bcryptjs
- Rollbaserad åtkomstkontroll (kund/admin)
- Administratörer kan bara läggas till av andra administratörer
- Initial admin: goran.rosenberg@tomelilla.nu / hnq55566#LP

## Teknikstack

### Frontend
- React 18
- React Router v6
- Vite
- Axios
- CSS3 (responsiv design)

### Backend
- Node.js
- Express.js
- CORS
- bcryptjs för lösenordskryptering
- UUID för unikt ID-generering
- JSON-baserad databas

## Installation

### Backend
```bash
cd backend
npm install
npm start
```
Backend körs på http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend körs på http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Logga in
- `POST /api/auth/register` - Registrera konto
- `POST /api/admin/users` - Skapa admin (endast admin)

### Products
- `GET /api/products` - Hämta alla produkter
- `GET /api/products?category=...&subcategory=...` - Filtrera produkter
- `GET /api/products/:id` - Hämta enskild produkt
- `POST /api/products` - Skapa produkt (endast admin)
- `PUT /api/products/:id` - Uppdatera produkt (endast admin)
- `DELETE /api/products/:id` - Ta bort produkt (endast admin)

### Orders
- `POST /api/orders` - Skapa order
- `GET /api/orders` - Hämta ordrar (kan filtreras)
- `GET /api/orders/:id` - Hämta enskild order
- `PUT /api/orders/:id` - Uppdatera order (status)
- `DELETE /api/orders/:id` - Ta bort order (endast admin)

## Projektstuktur

```
lexirecords-app/
├── backend/
│   ├── db/
│   │   ├── users.json
│   │   ├── products.json
│   │   └── orders.json
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ShopPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── OrderDetailPage.jsx
    │   │   ├── CustomerOrdersPage.jsx
    │   │   ├── AdminPage.jsx
    │   │   └── EditProductPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Designval

- **Färgschema**: Blå huvudfärg (#003366) med gradient övertoningar
- **Responsiv design**: Anpassas till mobil, surfplatta och desktop
- **Användargränssnitt**: Renare och intuitiv navigation
- **Lagring**: Shoppingkorg sparas lokalt i browser

## Testa applikationen

### Som kund
1. Registrera ett nytt konto
2. Bläddra produkter efter kategorier
3. Lägg till produkter i varukorg
4. Genomför köp
5. Spåra dina ordrar

### Som admin
1. Logga in med: goran.rosenberg@tomelilla.nu / hnq55566#LP
2. Gå till Admin-panelen
3. Hantera ordrar och produkter
