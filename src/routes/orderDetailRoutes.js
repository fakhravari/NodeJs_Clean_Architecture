const express = require('express');
const router = express.Router();
const c = require('../controllers/orderDetailController');

/**
 * @swagger
 * tags:
 *   name: OrderDetails
 *   description: جزئیات سفارش‌ها
 */

router.get('/', c.list);
router.get('/:id', c.get);

/**
 * @swagger
 * /orderdetails:
 *   post:
 *     summary: افزودن جزئیات سفارش
 *     tags: [OrderDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               OrderID: { type: integer }
 *               ProductID: { type: integer }
 *               Quantity: { type: integer }
 *               UnitPrice: { type: number }
 *     responses:
 *       200: { description: موفق }
 */
router.post('/', c.create);

router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
