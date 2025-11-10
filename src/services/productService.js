const { sql, getConnection } = require('../config/db');
const model = require('../models/productModel');

async function getAll() {
  const pool = await getConnection();
  const result = await pool.request().query(`SELECT * FROM ${model.tableName}`);
  return result.recordset;
}

async function getById(id) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`SELECT * FROM ${model.tableName} WHERE ProductID=@id`);
  return result.recordset[0];
}

async function create(data) {
  const pool = await getConnection();
  await pool.request()
    .input('ProductName', sql.NVarChar, data.ProductName)
    .input('Price', sql.Decimal(10,2), data.Price)
    .input('Stock', sql.Int, data.Stock)
    .query(`INSERT INTO ${model.tableName} (ProductName, Price, Stock)
            VALUES (@ProductName, @Price, @Stock)`);
}

async function update(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('ProductName', sql.NVarChar, data.ProductName)
    .input('Price', sql.Decimal(10,2), data.Price)
    .input('Stock', sql.Int, data.Stock)
    .query(`UPDATE ${model.tableName}
            SET ProductName=@ProductName, Price=@Price, Stock=@Stock
            WHERE ProductID=@id`);
}

async function remove(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query(`DELETE FROM ${model.tableName} WHERE ProductID=@id`);
}

module.exports = { getAll, getById, create, update, remove };
