require('dotenv').config();
const mysql = require('mysql2/promise');

async function renameColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Modify this to your actual table name
    const tableName = 'users';

    // Rename the column and set datatype
    const query = `
      ALTER TABLE \`${tableName}\`
      CHANGE \`remember_token\` \`auth_token\` VARCHAR(512) NULL;
    `;

    await connection.execute(query);
    console.log('Column renamed to `auth_token` with type VARCHAR(512).');
  } catch (error) {
    console.error('Error renaming column:', error.message);
  } finally {
    await connection.end();
  }
}

renameColumn();
