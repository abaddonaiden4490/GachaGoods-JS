const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const db = require('./db');
const path = require('path');
const multer = require('multer'); // <-- Add multer for file uploads
const fs = require('fs'); // <-- For folder check
const bcrypt = require('bcrypt'); // <-- Add bcrypt for password hashing

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use Date.now for uniqueness
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

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

app.get('/total-sales', (req, res) => {
  res.sendFile('total-sales.html', { root: 'public' });
});

// API endpoint to get items from the database
app.get('/api/items', (req, res) => {
  const sql = `
    SELECT i.*, GROUP_CONCAT(img.image_path) AS images
    FROM items i
    LEFT JOIN item_images img ON img.item_id = i.id
    GROUP BY i.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      // Convert images from CSV to array
      results.forEach(item => {
        item.images = item.images ? item.images.split(',') : [];
      });
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
      const item = results[0];
      // Get all images for this item
      db.query('SELECT image_path FROM item_images WHERE item_id = ?', [item.id], (imgErr, imgRows) => {
        if (imgErr) {
          item.images = [];
        } else {
          item.images = imgRows.map(row => row.image_path);
        }
        res.json(item);
      });
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

// Add Product (multiple images)
app.post('/api/items', upload.array('images'), (req, res) => {
  const { name, description, price, category_id, type_id } = req.body;
  db.query(
    'INSERT INTO items (name, description, price, category_id, type_id) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, category_id, type_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        const itemId = result.insertId;
        if (req.files && req.files.length) {
          const values = req.files.map(f => [itemId, '/uploads/' + f.filename]);
          db.query(
            'INSERT INTO item_images (item_id, image_path) VALUES ?',
            [values],
            (imgErr) => {
              if (imgErr) {
                res.status(500).json({ error: 'Image DB error' });
              } else {
                res.status(201).json({ id: itemId });
              }
            }
          );
        } else {
          res.status(201).json({ id: itemId });
        }
      }
    }
  );
});

// Edit Product (multiple images, replace all images if new ones uploaded)
app.put('/api/items/:id', upload.array('images'), (req, res) => {
  const { name, description, price, category_id, type_id } = req.body;
  db.query(
    'UPDATE items SET name=?, description=?, price=?, category_id=?, type_id=? WHERE id=?',
    [name, description, price, category_id, type_id, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        // If new images uploaded, replace all old images
        if (req.files && req.files.length) {
          db.query('DELETE FROM item_images WHERE item_id=?', [req.params.id], (delErr) => {
            if (delErr) {
              res.status(500).json({ error: 'Image DB error' });
            } else {
              const values = req.files.map(f => [req.params.id, '/uploads/' + f.filename]);
              db.query(
                'INSERT INTO item_images (item_id, image_path) VALUES ?',
                [values],
                (imgErr) => {
                  if (imgErr) {
                    res.status(500).json({ error: 'Image DB error' });
                  } else {
                    res.json({ success: true });
                  }
                }
              );
            }
          });
        } else {
          res.json({ success: true });
        }
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

// Add Category
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  db.query(
    'INSERT INTO categories (name) VALUES (?)',
    [name],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json({ id: result.insertId });
      }
    }
  );
});

// Edit Category
app.put('/api/categories/:id', (req, res) => {
  const { name } = req.body;
  db.query(
    'UPDATE categories SET name=? WHERE id=?',
    [name, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Delete Category
app.delete('/api/categories/:id', (req, res) => {
  db.query(
    'DELETE FROM categories WHERE id=?',
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

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const role_id = 2;
  const status_id = 1;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    // Check if name or email already exists
    db.query(
      'SELECT id FROM users WHERE name = ? OR email = ? LIMIT 1',
      [username, email],
      async (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (rows.length) {
          return res.status(409).json({ error: 'Username or email already exists.' });
        }
        // Hash password
        const hash = await bcrypt.hash(password, 10);
        db.query(
          `INSERT INTO users 
            (name, email, email_verified_at, password, status_id, role_id, auth_token) 
           VALUES (?, ?, NULL, ?, ?, ?, NULL)`,
          [username, email, hash, status_id, role_id],
          (err2, result) => {
            if (err2) return res.status(500).json({ error: 'Database error.' });
            res.status(201).json({ success: true });
          }
        );
      }
    );
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Missing credentials.' });
  db.query(
    'SELECT * FROM users WHERE name = ? LIMIT 1',
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (!rows.length) return res.status(401).json({ error: 'Invalid credentials.' });
      const user = rows[0];
      // Debug log
      // console.log('DB password:', user.password, 'Input password:', password);
      if (user.password && user.password.startsWith('$2b$')) {
        // bcrypt hash
        bcrypt.compare(password, user.password, (err2, match) => {
          if (err2) return res.status(500).json({ error: 'Server error.' });
          if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
          const token = require('crypto').randomBytes(32).toString('hex');
          const { password: _, ...userInfo } = user;
          res.json({ token, user: userInfo });
        });
      } else {
        // Plain text fallback (for legacy users, not secure)
        if (user.password === password) {
          const token = require('crypto').randomBytes(32).toString('hex');
          const { password: _, ...userInfo } = user;
          res.json({ token, user: userInfo });
        } else {
          return res.status(401).json({ error: 'Invalid credentials.' });
        }
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
