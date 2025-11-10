const ftp = require('basic-ftp');
const configUtil = require('../config/configUtil'); // استفاده از کلاس سینگل‌تن

// ⚙️ تنظیمات اتصال به FTP از ConfigUtil
const ftpConfig = configUtil.getFtpConfig();

// 🧠 تابع ایجاد اتصال
async function getClient() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
        await client.access(ftpConfig);
        return client;
    } catch (err) {
        console.error('❌ خطا در اتصال به FTP:', err.message);
        throw new Error('اتصال به سرور FTP ناموفق بود');
    }
}

// 📥 آپلود فایل
async function uploadFile(localPath, remoteFileName) {
    const client = await getClient();
    try {
        await client.uploadFrom(localPath, remoteFileName);
        console.log(`✅ فایل ${remoteFileName} با موفقیت آپلود شد`);
    } catch (err) {
        console.error('❌ خطا در آپلود فایل:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

// 📤 دانلود فایل
async function downloadFile(remoteFileName, localPath) {
    const client = await getClient();
    try {
        await client.downloadTo(localPath, remoteFileName);
        console.log(`✅ فایل ${remoteFileName} با موفقیت دانلود شد`);
    } catch (err) {
        console.error('❌ خطا در دانلود فایل:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

// 🗑 حذف فایل
async function deleteFile(remoteFileName) {
    const client = await getClient();
    try {
        await client.remove(remoteFileName);
        console.log(`🗑 فایل ${remoteFileName} حذف شد`);
    } catch (err) {
        console.error('❌ خطا در حذف فایل:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

// 📋 لیست فایل‌ها
async function listFiles(remoteDir = '.') {
    const client = await getClient();
    try {
        const list = await client.list(remoteDir);
        console.log(`📁 ${list.length} فایل در مسیر ${remoteDir}`);
        return list;
    } catch (err) {
        console.error('❌ خطا در لیست فایل‌ها:', err.message);
        throw err;
    } finally {
        client.close();
    }
}

module.exports = { uploadFile, downloadFile, deleteFile, listFiles };
