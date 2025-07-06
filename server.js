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
        [name, description, price, category_id, type_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, name, description, price, category_id, type_id });
        }
    );
});

// Update existing item
app.put('/api/item/:id', (req, res) => {
    const { name, description, price, category_id, type_id } = req.body;
    db.query(
        'UPDATE items SET name = ?, description = ?, price = ?, category_id = ?, type_id = ? WHERE id = ?',
        [name, description, price, category_id, type_id, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!results.affectedRows) return res.status(404).json({ error: 'Not found' });
            res.json({ id: req.params.id, name, description, price, category_id, type_id });
        }
    );
});

// Delete item
app.delete('/api/item/:id', (req, res) => {
    db.query(
        'DELETE FROM items WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!results.affectedRows) return res.status(404).json({ error: 'Not found' });
            res.status(204).end();
        }
    );
});

// --- CRUD for Categories ---

// In-memory categories store (replace with DB in production)
let categories = [
    { id: 1, name: 'Gacha Toys' },
    { id: 2, name: 'Anime Figures' }
];
let nextCategoryId = 3;

// Get all categories
app.get('/api/categories', (req, res) => {
    res.json(categories);
});

// Add a new category
app.post('/api/categories', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const newCategory = { id: nextCategoryId++, name };
    categories.push(newCategory);
    res.status(201).json(newCategory);
});

// Edit a category
app.put('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    const cat = categories.find(c => c.id === id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    if (!name) return res.status(400).json({ error: 'Name is required' });
    cat.name = name;
    res.json(cat);
});

// Delete a category
app.delete('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    categories.splice(idx, 1);
    res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});