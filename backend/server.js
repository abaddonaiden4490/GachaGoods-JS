const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const db = require('./db');
const path = require('path'); // <-- Add this line

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve jQuery frontend

// Serve about.html for /about
app.get('/about', (req, res) => {
  res.sendFile('about.html', { root: 'public' });
});

// Serve contact.html for /contact
app.get('/contact', (req, res) => {
  res.sendFile('contact.html', { root: 'public' });
});

app.get('/shop', (req, res) => {
  res.sendFile('shop.html', { root: 'public' });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

app.get('/register', (req, res) => {
  res.sendFile('register.html', { root: 'public' });
});

// API endpoint to get items from the database
app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// API endpoint to get a single item by id (redirect to item.html)
app.get('/item/:id', (req, res) => {
  res.sendFile('item.html', { root: 'public' });
});

// API endpoint to get a single item by id with category and type name
app.get('/api/item/:id', (req, res) => {
  const sql = `
    SELECT i.*, c.name AS category_name, t.name AS type_name
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN types t ON i.type_id = t.id
    WHERE i.id = ?
    LIMIT 1
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else if (!results.length) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// API endpoint to get items with category and type names
app.get('/api/items/with-names', (req, res) => {
  const sql = `
    SELECT i.id, i.name, i.description, i.price, 
           c.name AS category_name, t.name AS type_name,
           i.category_id, i.type_id
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN types t ON i.type_id = t.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// API endpoint to get all categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT id, name FROM categories', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// API endpoint to get all types
app.get('/api/types', (req, res) => {
  db.query('SELECT id, name FROM types', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Add Product
app.post('/api/items', (req, res) => {
  const { name, description, price, category_id, type_id } = req.body;
  db.query(
    'INSERT INTO items (name, description, price, category_id, type_id) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, category_id, type_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json({ id: result.insertId });
      }
    }
  );
});

// Edit Product
app.put('/api/items/:id', (req, res) => {
  const { name, description, price, category_id, type_id } = req.body;
  db.query(
    'UPDATE items SET name=?, description=?, price=?, category_id=?, type_id=? WHERE id=?',
    [name, description, price, category_id, type_id, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Delete Product
app.delete('/api/items/:id', (req, res) => {
  db.query(
    'DELETE FROM items WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Serve manage pages
app.get('/manage/products', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'manage', 'products.html'));
});
app.get('/manage/categories', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'manage', 'categories.html'));
});
app.get('/manage/types', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'manage', 'types.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
