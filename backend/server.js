const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const db = require('./db');

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
