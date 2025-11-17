const jwt = require("jsonwebtoken");
const { getConnection, sql } = require("../config/db");
const configUtil = require("../config/configUtil");

const AppError = require("../utils/AppError");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({
        success: false,
        error: {
          statusCode: 401,
          code: "NO_TOKEN",
          message: "توکن ارسال نشده است",
        },
      });

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      const { secret } = configUtil.getJwtConfig();
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("⏰ JWT داخلی منقضی شده");
        return res.status(401).json({
          success: false,
          error: {
            statusCode: 401,
            code: "TOKEN_EXPIRED",
            message: "⏰ توکن منقضی شده است",
          },
        });
      }
      console.log("❌ JWT نامعتبر");
      return res.status(401).json({
        success: false,
        error: {
          statusCode: 401,
          code: "INVALID_TOKEN",
          message: "توکن نامعتبر است",
        },
      });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Email", sql.NVarChar(100), decoded.email)
      .query("SELECT Jwt, CONVERT(NVARCHAR(50), JwtExpiresAt, 121) AS JwtExpiresAt FROM Users WHERE Email=@Email");

    const user = result.recordset[0];
    if (!user)
      return res.status(401).json({
        success: false,
        error: {
          statusCode: 401,
          code: "USER_NOT_FOUND",
          message: "کاربر یافت نشد",
        },
      });

    const now = configUtil.getCurrentDate();

    if (user.Jwt !== token) {
      console.log("❌ توکن با دیتابیس فرق دارد (احتمال login جدید)");
      return res.status(401).json({
        success: false,
        error: {
          statusCode: 401,
          code: "TOKEN_MISMATCH",
          message: "توکن ناهماهنگ است (احتمال logout یا login جدید)",
        },
      });
    }

    const dbExpireDate = configUtil.parseDateFromDatabase(user.JwtExpiresAt);
    if (!dbExpireDate || dbExpireDate < now) {
      console.log("⏰ توکن در دیتابیس منقضی شده");
      return res.status(401).json({
        success: false,
        error: {
          statusCode: 401,
          code: "TOKEN_EXPIRED",
          message: "⏰ توکن منقضی شده است",
        },
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return next(new AppError(500, "AUTH_ERROR", "خطای داخلی در بررسی توکن"));
  }
};
