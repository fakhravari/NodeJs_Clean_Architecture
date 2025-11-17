require("dotenv").config();

class ConfigUtil {
  static _instance = null;

  constructor() {
    if (ConfigUtil._instance) return ConfigUtil._instance;

    this.PORT = Number(process.env.PORT);
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN);

    this.dbConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      options: {
        encrypt: this._parseBoolean(process.env.DB_ENCRYPT),
        trustServerCertificate: this._parseBoolean(process.env.DB_TRUST_CERT),
      },
      pool: {
        max: Number(process.env.DB_POOL_MAX),
        min: Number(process.env.DB_POOL_MIN),
        idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT),
      },
    };

    this.ftpConfig = {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: this._parseBoolean(process.env.FTP_SECURE),
    };

    ConfigUtil._instance = this;
  }

  _parseBoolean(value) {
    return String(value).toLowerCase() === "true";
  }

  getJwtConfig() {
    const issuedAt = new Date();
    const expireDate = new Date(
      issuedAt.getTime() + this.JWT_EXPIRES_IN * 60 * 1000
    );

    return {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_EXPIRES_IN,
      issuedAt,
      expireDate,
    };
  }

  getDbConfig() {
    return this.dbConfig;
  }

  getFtpConfig() {
    return this.ftpConfig;
  }

  getCurrentDate() {
    return new Date();
  }

  parseDateFromDatabase(dateValue) {
    if (!dateValue) return null;

    let dateStr;
    if (dateValue instanceof Date) {
      const year = dateValue.getUTCFullYear();
      const month = String(dateValue.getUTCMonth() + 1).padStart(2, "0");
      const day = String(dateValue.getUTCDate()).padStart(2, "0");
      const hours = String(dateValue.getUTCHours()).padStart(2, "0");
      const minutes = String(dateValue.getUTCMinutes()).padStart(2, "0");
      const seconds = String(dateValue.getUTCSeconds()).padStart(2, "0");
      const milliseconds = String(dateValue.getUTCMilliseconds()).padStart(
        3,
        "0"
      );

      dateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    } else {
      dateStr = String(dateValue).trim();
    }
    const parts = dateStr.match(
      /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?/
    );

    if (parts) {
      return new Date(
        parseInt(parts[1]), // 📅 سال
        parseInt(parts[2]) - 1, // 🗓️ ماه (صفرمبنای JS)
        parseInt(parts[3]), // 📆 روز
        parseInt(parts[4]), // ⏰ ساعت
        parseInt(parts[5]), // ⌛ دقیقه
        parseInt(parts[6] || 0), // 🧭 ثانیه
        parseInt(parts[7] || 0) // 🪫 میلی‌ثانیه
      );
    }
    return new Date(dateStr);
  }

  parseDateFromUtcTimestamp(timestamp) {
    return new Date(timestamp * 1000);
  }

  static getInstance() {
    return this._instance || new ConfigUtil();
  }
}

module.exports = ConfigUtil.getInstance();
