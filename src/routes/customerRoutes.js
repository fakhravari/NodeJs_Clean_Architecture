const express = require('express');
const router = express.Router();
const c = require('../controllers/customerController');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: مدیریت مشتریان
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: دریافت همه مشتری‌ها
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: موفق
 */
router.get('/', c.list);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: دریافت یک مشتری
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: موفق }
 */
router.get('/:id', c.get);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: افزودن مشتری
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName: { type: string }
 *               Phone: { type: string }
 *               Email: { type: string }
 *               City: { type: string }
 *     responses:
 *       200: { description: موفق }
 */
router.post('/', c.create);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: بروزرسانی مشتری
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName: { type: string }
 *               Phone: { type: string }
 *               Email: { type: string }
 *               City: { type: string }
 *     responses:
 *       200: { description: موفق }
 */
router.put('/:id', c.update);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: حذف مشتری
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: موفق }
 */
router.delete('/:id', c.remove);

module.exports = router;
