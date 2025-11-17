const sql = require('mssql');
const configUtil = require('./configUtil');
const dbConfig = configUtil.getDbConfig();

let pool = null;

async function getConnection() {
  try {
    if (pool && pool.connected) {
      return pool;
    }

    if (!pool || !pool.connected) {
      pool = await sql.connect(dbConfig);
      console.log('✅ Database connection pool created');

      pool.on('error', err => {
        console.error('❌ Database pool error:', err);
        pool = null;
      });
    }

    return pool;
  } catch (err) {
    console.error('❌ Database connection error:', err);
    pool = null;
    throw err;
  }
}

async function closeConnection() {
  try {
    if (pool && pool.connected) {
      await pool.close();
      console.log('✅ Database connection pool closed');
    }
  } catch (err) {
    console.error('❌ Error closing database pool:', err);
  } finally {
    pool = null;
  }
}

module.exports = { getConnection, closeConnection, sql };
