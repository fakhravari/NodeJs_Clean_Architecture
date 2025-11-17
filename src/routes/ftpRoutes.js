const express = require('express');
const router = express.Router();
const ftpCtrl = require('../controllers/ftpController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { param } = require('express-validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: FTP
 *   description: 🧱 جابه‌جایی و مدیریت فایل‌ها روی سرور FTP
 */

/**
 * @swagger
 * /ftp:
 *   get:
 *     summary: 📃 مشاهده فهرست فایل‌های سرور
 *     tags: [FTP]
 *     responses:
 *       200:
 *         description: 🔎 فایل‌ها همراه جزئیات پایه برگردانده می‌شوند
 */

/**
 * @swagger
 * /ftp/upload:
 *   post:
 *     summary: ⬆️ ارسال فایل جدید به سرور
 *     tags: [FTP]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: ✅ فایل با موفقیت ذخیره شد
 */

/**
 * @swagger
 * /ftp/download/{name}:
 *   get:
 *     summary: ⬇️ دریافت فایل از FTP
 *     tags: [FTP]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 📁 نام دقیق فایل هدف
 *     responses:
 *       200:
 *         description: 📩 فایل برای دانلود آماده می‌شود
 */

/**
 * @swagger
 * /ftp/{name}:
 *   delete:
 *     summary: 🗑️ پاک کردن فایل از سرور
 *     tags: [FTP]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ✅ فایل با موفقیت پاک شد
 */

router.get('/', ftpCtrl.list);
router.post('/upload', upload.single('file'), ftpCtrl.upload);
router.get('/download/:name', [param('name').trim().notEmpty().withMessage('name is required')], validate, ftpCtrl.download);
router.delete('/:name', [param('name').trim().notEmpty().withMessage('name is required')], validate, ftpCtrl.remove);

module.exports = router;
