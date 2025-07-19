  const express = require('express');
  const cors = require('cors');
  const mysql = require('mysql2/promise');
  require('dotenv').config();
  const db = require('./db');
  const path = require('path');
  const multer = require('multer'); // <-- Add multer for file uploads
  const fs = require('fs'); // <-- For folder check
  const bcrypt = require('bcrypt'); // <-- Add bcrypt for password hashing
  const crypto = require('crypto');
  const jwt = require('jsonwebtoken');
  const roleRedirect = require('./middleware/redirect');
  const authenticateUser = require('./middleware/authenticateUser');
  const verifyToken = require('./middleware/verifyToken');
  const nodemailer = require('nodemailer');
  const PDFDocument = require('pdfkit');
  const router = express.Router();
  const loadHeader = require('./middleware/loadHeader');
  const secretKey = process.env.JWT_SECRET;

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

  app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function servePageWithHeader(pageFilename) {
    return [loadHeader, (req, res) => {
        const htmlPath = path.join(__dirname, 'public', pageFilename);
        const headerPath = res.locals.headerPath;

        try {
            const html = fs.readFileSync(htmlPath, 'utf-8');
            const header = fs.readFileSync(headerPath, 'utf-8');
            const finalHtml = html.replace('<!--HEADER-->', header);
            res.send(finalHtml);
        } catch (err) {
            console.error('Error loading page or header:', err);
            res.status(500).send('Internal Server Error');
        }
    }];
}



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
app.get('/manage/products', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'manage', 'products.html'));
});

app.get('/manage/categories', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'manage', 'categories.html'));
});

app.get('/manage/types', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'manage', 'types.html'));
});

app.get('/manage/users', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'manage', 'users.html'));
});


  app.get('/api/users', (req, res) => {
      db.query(`
          SELECT 
              users.id AS user_id,
              users.name AS username,
              users.email,
              users.role_id,
              users.status_id,
              roles.name AS role_name,
              statuses.name AS status_name
          FROM users
          LEFT JOIN roles ON users.role_id = roles.id
          LEFT JOIN statuses ON users.status_id = statuses.id
      `, (err, results) => {
          if (err) {
              console.error('🔥 [ERROR in GET /api/users]:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json(results);
      });
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

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password.' });
  }

  db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email], (err, results) => {
    if (err) {
      console.error('[LOGIN ERROR - DB]', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (!results.length) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = results[0];
    console.log('🔍 Debug: User status_id =', user.status_id);

    if (parseInt(user.status_id) !== 1) {
      return res.status(403).json({ error: 'Your account is deactivated. Please contact support.' });
    }

    // 🔍 DEBUG: Check if user already has an active session token
    if (user.auth_token) {
      console.log(`⚠️ Debug: Existing session token detected for user ID ${user.id}: ${user.auth_token}`);
    } else {
      console.log(`✅ Debug: No existing session token for user ID ${user.id}`);
    }

    bcrypt.compare(password, user.password, (bcryptErr, match) => {
      if (bcryptErr) {
        console.error('[LOGIN ERROR - BCRYPT]', bcryptErr);
        return res.status(500).json({ error: 'Encryption error.' });
      }

      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        status_id: user.status_id
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      db.query('UPDATE users SET auth_token = ? WHERE id = ?', [token, user.id], (updateErr) => {
        if (updateErr) {
          console.error('[LOGIN ERROR - TOKEN UPDATE]', updateErr);
          return res.status(500).json({ error: 'Token update failed.' });
        }

        console.log(`🔐 Debug: New token issued for user ID ${user.id}`);

        return res.json({ ...payload, token });
      });
    });
  });
});




  app.get('/api/users', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          u.id AS user_id,
          u.name AS username,
          u.email,
          u.role_id,
          r.name AS role_name,
          u.status_id,
          s.name AS status_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN statuses s ON u.status_id = s.id
      `);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.put('/api/users/:id/role', async (req, res) => {
    const userId = req.params.id;
    const { role_id } = req.body;

    if (![1, 2].includes(role_id)) {
      return res.status(400).json({ error: 'Invalid role_id' });
    }

    try {
      await db.query(`UPDATE users SET role_id = ? WHERE id = ?`, [role_id, userId]);
      res.status(200).json({ message: 'Role updated' });
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ error: 'Failed to update role' });
    }
  });

  app.put('/api/users/:id/status', async (req, res) => {
    const userId = req.params.id;
    const { status_id } = req.body;

    if (![1, 2].includes(status_id)) {
      return res.status(400).json({ error: 'Invalid status_id' });
    }

    try {
      await db.query(`UPDATE users SET status_id = ? WHERE id = ?`, [status_id, userId]);
      res.status(200).json({ message: 'Status updated' });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  const userInfoRoute = require('./middleware/authenticateUser');

app.get('/api/item-names', (req, res) => {
  db.query("SELECT LOWER(name) AS name FROM items", (err, results) => {
    if (err) {
      console.error('Error fetching item names:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const names = results.map(row => row.name);
    res.json(names);
  });
});

app.post('/api/search', (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing search query' });

    // Optionally log search, track analytics, or validate query
    console.log('User searched for:', query);

    res.status(200).json({ success: true });
});

app.get('/api/search-results', (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const sql = `
    SELECT i.*, GROUP_CONCAT(img.image_path) AS images
    FROM items i
    LEFT JOIN item_images img ON img.item_id = i.id
    WHERE i.name LIKE ?
    GROUP BY i.id
  `;

  db.query(sql, [`%${query}%`], (err, results) => {
    if (err) {
      console.error('Error fetching search results:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Parse image paths
    results.forEach(item => {
      item.images = item.images ? item.images.split(',') : [];
    });

    res.json(results);
  });
});


  app.get('/user-home', (req, res) => {
    res.sendFile('user-home.html', { root: 'public' });
  });

  app.get('/admin-dashboard', (req, res) => {
    res.sendFile('admin-dashboard.html', { root: 'public' });
  });

   app.get('/forbidden', (req, res) => {
    res.sendFile('403.html', { root: 'public' });
  });

  app.get('/redirect', authenticateUser, roleRedirect);

app.get('/api/purchased', (req, res) => {
    const sql = `
        SELECT 
            p.id,
            u.name AS user_name,
            i.name AS product_name,
            p.quantity,
            p.price,
            p.total_price,
            s.name AS status_name
        FROM purchased p
        JOIN users u ON p.user_id = u.id
        JOIN items i ON p.product_id = i.id
        JOIN item_status s ON p.status_id = s.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch purchases' });
        }

        res.json(results);
    });
});

app.get('/api/item-status', (req, res) => {
    db.query('SELECT id, name FROM item_status ORDER BY id', (err, results) => {
        if (err) {
            console.error('Error fetching item statuses:', err);
            return res.status(500).json({ error: 'Failed to fetch item statuses' });
        }
        res.json(results);
    });
});

app.put('/api/purchased/:id/status', (req, res) => {
    const { id } = req.params;
    const { status_id } = req.body;

    if (!status_id) return res.status(400).json({ error: 'Missing status_id' });

    db.query('UPDATE purchased SET status_id = ? WHERE id = ?', [status_id, id], (err) => {
        if (err) {
            console.error('Error updating status:', err);
            return res.status(500).json({ error: 'Update failed' });
        }

        // Fetch purchase + user + item + status
        db.query(`
            SELECT u.email, u.name AS user_name, i.name AS product_name, i.price, p.quantity, p.total_price, s.name AS status_name
            FROM purchased p
            JOIN users u ON p.user_id = u.id
            JOIN items i ON p.product_id = i.id
            JOIN item_status s ON p.status_id = s.id
            WHERE p.id = ?
        `, [id], (err, rows) => {
            if (err) {
                console.error('Error fetching purchase details:', err);
                return res.status(500).json({ error: 'Fetch failed' });
            }

            const purchase = rows[0];
            if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

            // Create status message
            let statusMessage = '';
            switch (purchase.status_name.toLowerCase()) {
                case 'pending': statusMessage = 'Your order is now pending. We will process it shortly.'; break;
                case 'processing': statusMessage = 'Your order is being processed. Hang tight!'; break;
                case 'delivered': statusMessage = 'Great news! Your order has been delivered.'; break;
                case 'cancelled': statusMessage = 'We’re sorry to inform you that your order has been cancelled.'; break;
                case 'returned': statusMessage = 'Your order has been marked as returned. Please contact support if needed.'; break;
                default: statusMessage = `Your order status has been updated to: ${purchase.status_name}`;
            }

            // Generate PDF receipt
const doc = new PDFDocument();
const filePath = path.join(__dirname, `receipt-${id}.pdf`);
const writeStream = fs.createWriteStream(filePath);
doc.pipe(writeStream);

// Add logo
const logoPath = path.join(__dirname, 'logo.png');
if (fs.existsSync(logoPath)) {
    doc.image(logoPath, { fit: [100, 100], align: 'center' });
}

doc.moveDown();
doc.fontSize(20).text('GachaGoods Order Receipt', { align: 'center' });
doc.moveDown(1.5);

// Customer info
doc.fontSize(12).text(`Customer: ${purchase.user_name}`);
doc.text(`Email: ${purchase.email}`);
doc.moveDown();

// Order details table
doc.font('Helvetica-Bold').text('Item', 100, doc.y, { continued: true });
doc.text('Qty', 250, doc.y, { continued: true });
doc.text('Price', 300, doc.y, { continued: true });
doc.text('Total', 400, doc.y);
doc.moveDown(0.5);

doc.font('Helvetica').text(purchase.product_name, 100, doc.y, { continued: true });
doc.text(purchase.quantity.toString(), 250, doc.y, { continued: true });
doc.text(`$${Number(purchase.price).toFixed(2)}`, 300, doc.y, { continued: true });
doc.text(`$${Number(purchase.total_price).toFixed(2)}`, 400, doc.y);
doc.moveDown(1);

// Order status
doc.font('Helvetica-Bold').text(`Order Status: ${purchase.status_name}`);
doc.end();

            writeStream.on('finish', () => {
                // Email setup
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: `GachaGoods <${process.env.EMAIL_USER}>`,
                    to: purchase.email,
                    subject: `Your GachaGoods Order is ${purchase.status_name}`,
                    html: `
                        <p>Hi ${purchase.user_name},</p>
                        <p>${statusMessage}</p>
                        <p><strong>Item:</strong> ${purchase.product_name}</p>
                        <br>
                        <p>Thank you for shopping at <strong>GachaGoods</strong>!</p>
                        <p style="color:#888;font-size:0.9em;">This is an automated message. Please do not reply.</p>
                    `,
                    attachments: [
                        {
                            filename: `receipt-${id}.pdf`,
                            path: filePath
                        }
                    ]
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    // Remove the file after sending
                    fs.unlink(filePath, () => {});

                    if (err) {
                        console.error('Error sending email:', err);
                        return res.status(500).json({ error: 'Failed to send email' });
                    }

                    res.json({ message: 'Status updated and receipt emailed' });
                });
            });
        });
    });
});

// Logout API
app.post('/api/logout', authenticateUser, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // e.g. "Bearer abc123"

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const [result] = await db.query('UPDATE users SET auth_token = NULL WHERE auth_token = ?', [token]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Invalid token or user not found.' });
        }

        res.json({ message: 'Successfully logged out.' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ error: 'Server error during logout.' });
    }
});

router.get('/api/me', authenticateUser, (req, res) => {
    res.json(req.user); // sends { id, name, email, role_id, status_id }
});


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });