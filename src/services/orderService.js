const { sql, getConnection } = require('../config/db');
const model = require('../models/orderModel');

async function getAll() {
  const pool = await getConnection();
  const result = await pool.request().query(`SELECT * FROM ${model.tableName}`);
  return result.recordset;
}

async function getById(id) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`SELECT * FROM ${model.tableName} WHERE OrderID=@id`);
  return result.recordset[0];
}

async function create(data) {
  const pool = await getConnection();
  await pool.request()
    .input('CustomerID', sql.Int, data.CustomerID)
    .input('TotalAmount', sql.Decimal(12,2), data.TotalAmount || 0)
    .query(`INSERT INTO ${model.tableName} (CustomerID, TotalAmount)
            VALUES (@CustomerID, @TotalAmount)`);
}

async function update(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('TotalAmount', sql.Decimal(12,2), data.TotalAmount)
    .query(`UPDATE ${model.tableName}
            SET TotalAmount=@TotalAmount
            WHERE OrderID=@id`);
}

async function remove(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query(`DELETE FROM ${model.tableName} WHERE OrderID=@id`);
}

module.exports = { getAll, getById, create, update, remove };
