const mysql = require('mysql2/promise');

// Load environment variables (if you're using .env)
require('dotenv').config();

async function resetAuthTokens() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [result] = await connection.execute('UPDATE users SET auth_token = NULL');
    console.log(`✅ Updated ${result.affectedRows} users. All auth_token values set to NULL.`);
  } catch (error) {
    console.error('❌ Error updating auth_token:', error);
  } finally {
    await connection.end();
  }
}

resetAuthTokens();
