const { sql, getConnection } = require('../config/db');
const model = require('../models/orderDetailModel');

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
    .query(`SELECT * FROM ${model.tableName} WHERE OrderDetailID=@id`);
  return result.recordset[0];
}

async function create(data) {
  const pool = await getConnection();
  await pool.request()
    .input('OrderID', sql.Int, data.OrderID)
    .input('ProductID', sql.Int, data.ProductID)
    .input('Quantity', sql.Int, data.Quantity)
    .input('UnitPrice', sql.Decimal(10, 2), data.UnitPrice)
    .query(`INSERT INTO ${model.tableName} (OrderID, ProductID, Quantity, UnitPrice)
            VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice)`);
}

async function update(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('Quantity', sql.Int, data.Quantity)
    .input('UnitPrice', sql.Decimal(10, 2), data.UnitPrice)
    .query(`UPDATE ${model.tableName}
            SET Quantity=@Quantity, UnitPrice=@UnitPrice
            WHERE OrderDetailID=@id`);
}

async function remove(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query(`DELETE FROM ${model.tableName} WHERE OrderDetailID=@id`);
}

// 🧾 متد جدید: جزئیات سفارش همراه محصولات
async function getOrderWithProducts(orderId) {
  const pool = await getConnection();
  const query = `
    SELECT od.OrderDetailID, od.OrderID, od.ProductID, p.ProductName, p.Price, od.Quantity, od.UnitPrice
    FROM OrderDetails od
    INNER JOIN Products p ON od.ProductID = p.ProductID
    WHERE od.OrderID = @orderId;
  `;
  const result = await pool.request().input('orderId', sql.Int, orderId).query(query);
  return result.recordset;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getOrderWithProducts
};
