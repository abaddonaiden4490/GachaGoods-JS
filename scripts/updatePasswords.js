require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Hash the password
const plainPassword = '0829';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Hashing error:', err);
    return;
  }

  // Update all user passwords
  const sql = 'UPDATE users SET password = ?';
  db.query(sql, [hashedPassword], (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return;
    }

    console.log(`Updated ${result.affectedRows} rows with new hashed password.`);
    db.end();
  });
});
