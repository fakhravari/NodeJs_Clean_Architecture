const express = require('express');
const router = express.Router();
const c = require('../controllers/orderController');
const { body, param } = require('express-validator');
const { query } = require('express-validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /orders/summary:
 *   get:
 *     summary: 📊 گزارش خلاصه سفارش‌ها (تعداد اقلام و مجموع مبلغ)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: 🧾 لیست خلاصه سفارش‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   OrderID: { type: integer }
 *                   FullName: { type: string }
 *                   ItemCount: { type: integer }
 *                   TotalAmount: { type: number }
 */
router.get('/summary', c.summary);

/**
 * @swagger
 * /orders/multi-product-customers:
 *   get:
 *     summary: 🤝 مشتریانی که بیش از یک محصول مختلف خریده‌اند
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: 🧮 تعداد محصولات خریداری‌شده برای هر مشتری
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CustomerID: { type: integer }
 *                   FullName: { type: string }
 *                   ProductsCount: { type: integer }
 */
router.get('/multi-product-customers', c.multiProduct);


/**
 * @swagger
 * tags:
  *   name: Orders
 *   description: 🛒 مدیریت چرخه سفارش‌ها
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: 📜 دریافت لیست همه سفارش‌ها
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: ✅ لیست سفارش‌ها برگردانده می‌شود
 */
router.get('/', c.list);

/**
 * @swagger
 * /orders/view:
 *   get:
 *     summary: 🪟 دریافت سفارش‌ها از View/TVF [dbo].[GetAllOrders]
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: 📄 خروجی حاوی OrderID, CustomerID, OrderDate, TotalAmount, JsonDetails
 */
router.get('/view', c.listView);

/**
 * @swagger
 * /orders/view/formatted:
 *   get:
 *     summary: 🧱 دریافت سفارش‌ها در قالب رشته SQL tuple
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: 🔤 ردیف‌ها به صورت رشته فرمت‌شده بازگردانده می‌شوند
 */
router.get('/view/formatted', c.listViewFormatted);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: 🔍 دریافت جزئیات سفارش بر اساس ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 🧾 اطلاعات سفارش برگردانده می‌شود
 */
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.get);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: ➕ ایجاد سفارش جدید
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CustomerID
 *             properties:
 *               CustomerID:
 *                 type: integer
 *               TotalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: ✅ سفارش با موفقیت ایجاد شد
 */
router.post('/', [body('CustomerID').isInt().withMessage('CustomerID is required and must be an integer'), body('TotalAmount').optional().isNumeric().withMessage('TotalAmount must be a number')], validate, c.create);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: ✏️ ویرایش سفارش موجود
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TotalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: 🔄 سفارش ویرایش شد
 */
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), body('TotalAmount').optional().isNumeric().withMessage('TotalAmount must be a number')], validate, c.update);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: 🗑️ حذف سفارش بر اساس ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ✅ سفارش حذف شد
 */
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.remove);

module.exports = router;
