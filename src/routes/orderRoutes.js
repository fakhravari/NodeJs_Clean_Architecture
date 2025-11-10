const express = require('express');
const router = express.Router();
const c = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: مدیریت سفارش‌ها
 */

router.get('/', c.list);
router.get('/:id', c.get);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: ثبت سفارش
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CustomerID: { type: integer }
 *               TotalAmount: { type: number }
 *     responses:
 *       200: { description: موفق }
 */
router.post('/', c.create);

router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
