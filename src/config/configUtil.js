require('dotenv').config();

class ConfigUtil {
    constructor() {
        if (ConfigUtil._instance) return ConfigUtil._instance;

        // ⚙️ تنظیمات عمومی
        this.PORT = process.env.PORT || 3000;

        // 🔐 تنظیمات JWT
        this.JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey12345';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1m';

        // 🗄 تنظیمات پایگاه داده SQL Server
        this.dbConfig = {
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            server: process.env.DB_SERVER,
            database: process.env.DB_NAME,
            options: {
                encrypt: process.env.DB_ENCRYPT === 'true',
                trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
            },
            pool: {
                max: parseInt(process.env.DB_POOL_MAX || 10, 10),
                min: parseInt(process.env.DB_POOL_MIN || 0, 10),
                idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || 30000, 10),
            },
        };

        // 🌐 تنظیمات FTP
        this.ftpConfig = {
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: process.env.FTP_SECURE === 'true',
        };

        // 🕒 تنظیمات زمان (ساعت ایران)
        this.timezoneOffset = 3.5 * 60 * 60 * 1000; // +03:30 ایران
        ConfigUtil._instance = this;
    }

    // 🕓 زمان جاری به ساعت ایران (میلادی)
    nowTehran() {
        const now = new Date();
        return new Date(now.getTime() + this.timezoneOffset);
    }

    // ⏰ محاسبه زمان انقضای JWT
    getExpiryDateTehran() {
        const issued = this.nowTehran();
        return new Date(issued.getTime() + 1 * 60 * 1000); // همیشه ۱ دقیقه
    }

    // 🧩 تنظیمات JWT برای استفاده مستقیم
    getJwtConfig() {
        return {
            secret: this.JWT_SECRET,
            expiresIn: this.JWT_EXPIRES_IN,
        };
    }

    // 🗄 دریافت تنظیمات دیتابیس
    getDbConfig() {
        return this.dbConfig;
    }

    // 🌐 دریافت تنظیمات FTP
    getFtpConfig() {
        return this.ftpConfig;
    }

    static getInstance() {
        if (!ConfigUtil._instance) new ConfigUtil();
        return ConfigUtil._instance;
    }
}

module.exports = ConfigUtil.getInstance();
