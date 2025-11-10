const sql = require('mssql');
const configUtil = require('./configUtil');
const dbConfig = configUtil.getDbConfig();

async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (err) {
    console.error('❌ Database connection error:', err);
    throw err;
  }
}

module.exports = { getConnection, sql };
