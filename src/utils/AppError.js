class AppError extends Error {
  /**
   * ⚠️ خطای کنترل‌شده همراه با جزئیات قابل گزارش
   * @param {number} statusCode وضعیت HTTP
   * @param {string} code کد خطای کوتاه
   * @param {string} message پیام خوانا برای کاربر
   * @param {any} details توضیحات تکمیلی اختیاری
   */
  constructor(statusCode = 500, code = 'INTERNAL_ERROR', message = 'Internal Server Error', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // 🛡️ مشخص می‌کند خطا قابل پیش‌بینی است
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
