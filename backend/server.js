const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database files paths
const dbPath = path.join(__dirname, 'db');
const usersFile = path.join(dbPath, 'users.json');
const productsFile = path.join(dbPath, 'products.json');
const ordersFile = path.join(dbPath, 'orders.json');

// Ensure db folder exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

// Initialize database files if they don't exist
const initializeDatabase = () => {
  // Initialize users with admin
  if (!fs.existsSync(usersFile)) {
    const adminUser = {
      id: uuidv4(),
      email: 'goran.rosenberg@tomelilla.nu',
      password: bcrypt.hashSync('hnq55566#LP', 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(usersFile, JSON.stringify([adminUser], null, 2));
  }

  // Initialize products
  if (!fs.existsSync(productsFile)) {
    const products = [
      {
        id: uuidv4(),
        title: 'The Beatles - Abbey Road',
        category: 'Nya skivor',
        subcategory: 'LP-skivor',
        price: 299,
        image: 'https://via.placeholder.com/200x200?text=Abbey+Road',
        description: 'Klassisk album från 1969',
        stock: 10
      },
      {
        id: uuidv4(),
        title: 'Pink Floyd - The Dark Side of the Moon',
        category: 'Nya skivor',
        subcategory: 'LP-skivor',
        price: 349,
        image: 'https://via.placeholder.com/200x200?text=Dark+Side',
        description: 'Ikoniskt album från 1973',
        stock: 15
      },
      {
        id: uuidv4(),
        title: 'Queen - Bohemian Rhapsody',
        category: 'Nya skivor',
        subcategory: 'Singlar',
        price: 99,
        image: 'https://via.placeholder.com/200x200?text=Bohemian',
        description: 'Klassisk singel från 1975',
        stock: 20
      },
      {
        id: uuidv4(),
        title: 'David Bowie - Space Oddity',
        category: 'Begagnade skivor',
        subcategory: 'Singlar',
        price: 79,
        image: 'https://via.placeholder.com/200x200?text=Space+Oddity',
        description: 'Begagnad singel från 1969',
        stock: 5
      }
    ];
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  }

  // Initialize orders
  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
  }
};

// Helper functions to read/write JSON files
const readJSON = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Routes
// AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email och lösenord krävs' });
  }

  const users = readJSON(usersFile);
  const userExists = users.some(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'Epostadressen är redan registrerad' });
  }

  const newUser = {
    id: uuidv4(),
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJSON(usersFile, users);

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email och lösenord krävs' });
  }

  const users = readJSON(usersFile);
  const user = users.find(u => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter' });
  }

  res.json({
    id: user.id,
    email: user.email,
    role: user.role
  });
});

// PRODUCTS ROUTES
app.get('/api/products', (req, res) => {
  const { category, subcategory } = req.query;
  let products = readJSON(productsFile);

  if (category) {
    products = products.filter(p => p.category === category);
  }
  if (subcategory) {
    products = products.filter(p => p.subcategory === subcategory);
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readJSON(productsFile);
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Produkt inte hittad' });
  }

  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { title, category, subcategory, price, description, stock, image } = req.body;

  if (!title || !category || !subcategory || !price) {
    return res.status(400).json({ error: 'Obligatoriska fält saknas' });
  }

  const products = readJSON(productsFile);
  const newProduct = {
    id: uuidv4(),
    title,
    category,
    subcategory,
    price: parseFloat(price),
    description: description || '',
    stock: parseInt(stock) || 0,
    image: image || 'https://via.placeholder.com/200x200?text=Placeholder'
  };

  products.push(newProduct);
  writeJSON(productsFile, products);

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { title, category, subcategory, price, description, stock, image } = req.body;
  const products = readJSON(productsFile);
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Produkt inte hittad' });
  }

  products[index] = {
    ...products[index],
    title: title || products[index].title,
    category: category || products[index].category,
    subcategory: subcategory || products[index].subcategory,
    price: price !== undefined ? parseFloat(price) : products[index].price,
    description: description || products[index].description,
    stock: stock !== undefined ? parseInt(stock) : products[index].stock,
    image: image || products[index].image
  };

  writeJSON(productsFile, products);
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const products = readJSON(productsFile);
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Produkt inte hittad' });
  }

  const deletedProduct = products.splice(index, 1);
  writeJSON(productsFile, products);

  res.json(deletedProduct[0]);
});

// ORDERS ROUTES
app.post('/api/orders', (req, res) => {
  const { userId, items, totalPrice } = req.body;

  if (!userId || !items || !totalPrice) {
    return res.status(400).json({ error: 'Obligatoriska fält saknas' });
  }

  const orders = readJSON(ordersFile);
  const newOrder = {
    id: uuidv4(),
    userId,
    items,
    totalPrice: parseFloat(totalPrice),
    status: 'pending',
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(newOrder);
  writeJSON(ordersFile, orders);

  res.status(201).json(newOrder);
});

app.get('/api/orders', (req, res) => {
  const { userId, status } = req.query;
  let orders = readJSON(ordersFile);

  if (userId) {
    orders = orders.filter(o => o.userId === userId);
  }
  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const orders = readJSON(ordersFile);
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order inte hittad' });
  }

  res.json(order);
});

app.put('/api/orders/:id', (req, res) => {
  const { status, archived } = req.body;
  const orders = readJSON(ordersFile);
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order inte hittad' });
  }

  if (status) {
    orders[index].status = status;
  }
  if (archived !== undefined) {
    orders[index].archived = archived;
  }

  orders[index].updatedAt = new Date().toISOString();
  writeJSON(ordersFile, orders);

  res.json(orders[index]);
});

app.delete('/api/orders/:id', (req, res) => {
  const orders = readJSON(ordersFile);
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order inte hittad' });
  }

  const deletedOrder = orders.splice(index, 1);
  writeJSON(ordersFile, orders);

  res.json(deletedOrder[0]);
});

// ADMIN ROUTES
app.post('/api/admin/users', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || role !== 'admin') {
    return res.status(400).json({ error: 'Endast administratörer kan skapas via denna endpoint' });
  }

  const users = readJSON(usersFile);
  const userExists = users.some(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'Epostadressen är redan registrerad' });
  }

  const newAdmin = {
    id: uuidv4(),
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  users.push(newAdmin);
  writeJSON(usersFile, users);

  res.status(201).json({
    id: newAdmin.id,
    email: newAdmin.email,
    role: newAdmin.role
  });
});

// Start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`LexiRecords backend körs på port ${PORT}`);
});
