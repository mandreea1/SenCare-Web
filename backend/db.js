const sql = require('mssql');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

async function connectToDb() {
  try {
    await sql.connect(config);
    console.log('Conexiunea la baza de date Azure a fost realizată cu succes!');
  } catch (err) {
    console.error('Eroare la conectarea la baza de date Azure:', err.message);
    process.exit(1);
  }
}

module.exports = {
  sql,
  connectToDb,
  dbConfig: config
};