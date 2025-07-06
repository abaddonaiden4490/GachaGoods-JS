const express = require('express');
const app = express();
app.use(express.json());

// Example: require your db connection
const db = require('./db'); // adjust path as needed

// --- CRUD for Items (Products) ---

// Get all items with category/type names
app.get('/api/items/with-names', (req, res) => {
    db.query(
        `SELECT items.*, categories.name AS category_name, types.name AS type_name
         FROM items
         LEFT JOIN categories ON items.category_id = categories.id
         LEFT JOIN types ON items.type_id = types.id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// Get single item by id
app.get('/api/item/:id', (req, res) => {
    db.query(
        'SELECT * FROM items WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!results.length) return res.status(404).json({ error: 'Not found' });
            res.json(results[0]);
        }
    );
});

// Add new item
app.post('/api/items', (req, res) => {
    const { name, description, price, category_id, type_id } = req.body;
    db.query(
        'INSERT INTO items (name, description, price, category_id, type_id) VALUES (?, ?, ?, ?, ?)',