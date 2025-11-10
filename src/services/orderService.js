const { sql, getConnection } = require('../config/db');
const model = require('../models/orderModel');

// CRUD پایه
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
    .input('TotalAmount', sql.Decimal(12, 2), data.TotalAmount || 0)
    .query(`INSERT INTO ${model.tableName} (CustomerID, TotalAmount)
            VALUES (@CustomerID, @TotalAmount)`);
}

async function update(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('TotalAmount', sql.Decimal(12, 2), data.TotalAmount)
    .query(`UPDATE ${model.tableName} SET TotalAmount=@TotalAmount WHERE OrderID=@id`);
}

async function remove(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query(`DELETE FROM ${model.tableName} WHERE OrderID=@id`);
}

// 📊 متد جدید ۱: خلاصه سفارش‌ها
async function getOrderSummary() {
  const pool = await getConnection();
  const query = `
    SELECT o.OrderID, c.FullName, COUNT(od.OrderDetailID) AS ItemCount,
           SUM(od.Quantity * od.UnitPrice) AS TotalAmount
    FROM Orders o
    INNER JOIN Customers c ON o.CustomerID = c.CustomerID
    INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
    GROUP BY o.OrderID, c.FullName
    ORDER BY o.OrderID DESC;
  `;
  const result = await pool.request().query(query);
  return result.recordset;
}

// 👥 متد جدید ۲: مشتریانی که چند محصول خریدن
async function getCustomersWithMultipleProducts() {
  const pool = await getConnection();
  const query = `
    SELECT c.CustomerID, c.FullName, COUNT(DISTINCT od.ProductID) AS ProductsCount
    FROM Orders o
    INNER JOIN Customers c ON o.CustomerID = c.CustomerID
    INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
    GROUP BY c.CustomerID, c.FullName
    HAVING COUNT(DISTINCT od.ProductID) > 1
    ORDER BY ProductsCount DESC;
  `;
  const result = await pool.request().query(query);
  return result.recordset;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getOrderSummary,
  getCustomersWithMultipleProducts
};
