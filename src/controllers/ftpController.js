const ftpService = require('../services/ftpService');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// 🗂️ بازیابی فهرست فایل‌های سرور
exports.list = asyncHandler(async (req, res) => {
    const files = await ftpService.listFiles();
    res.json({ success: true, data: files });
});

// ⬆️ بارگذاری فایل جدید روی سرور
exports.upload = asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) throw new AppError(400, 'NO_FILE', 'فایلی ارسال نشده است');

    await ftpService.uploadFile(file.path, file.originalname);
    try { fs.unlinkSync(file.path); } catch (e) { /* 🧹 خطای پاکسازی موقت نادیده گرفته شد */ }
    res.json({ success: true, message: 'فایل با موفقیت آپلود شد', file: file.originalname });
});

// ⬇️ دانلود فایل از سرور FTP
exports.download = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const localPath = path.join(__dirname, `../../temp_${name}`);
    await ftpService.downloadFile(name, localPath);
    res.download(localPath, name, () => { try { fs.unlinkSync(localPath); } catch (e) {} });
});

// 🗑️ حذف فایل از مخزن FTP
exports.remove = asyncHandler(async (req, res) => {
    const { name } = req.params;
    await ftpService.deleteFile(name);
    res.json({ success: true, message: `فایل ${name} حذف شد` });
});
