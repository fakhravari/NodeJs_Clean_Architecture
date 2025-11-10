const sql = require('mssql');

const dbConfig = {
  user: 'kiandent_NodeJs',
  password: 'q8E0*0es7',
  server: '62.204.61.143\\sqlserver2022',
  database: 'kiandent_NodeJs',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

let poolPromise;

async function getConnection() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then(pool => {
        console.log('✅ Connected to SQL Server');
        return pool;
      })
      .catch(err => {
        console.error('❌ Database connection error:', err);
        throw err;
      });
  }
  return poolPromise;
}

module.exports = { sql, getConnection };
