const jwt = require("jsonwebtoken");
const configUtil = require("../config/configUtil");
const { v4: uuidv4 } = require("uuid");

function generateAccessToken(email, fullName) {
  const { secret, expiresIn } = configUtil.getJwtConfig();
  return jwt.sign({ email, fullName }, secret, { expiresIn: `${expiresIn}m` });
}

function generateRefreshToken() {
  return uuidv4();
}

function verifyAndGetExpireDate(tokenDb, email, expireDateDb) {
  try {
    const { secret } = configUtil.getJwtConfig();
    const decoded = jwt.verify(tokenDb, secret);

    if (!decoded.exp) {
      return {
        error: "Token does not contain exp field",
        valid: false,
        decoded: null,
      };
    }
    if (!decoded.email) {
      return {
        error: "Email does not contain exp field",
        valid: false,
        decoded: null,
      };
    }

    if (decoded.email !== email) {
      return {
        error: "Email does not match token",
        valid: false,
        decoded: null,
      };
    }

    // ⏱️ استفاده از توابع کمکی برای هماهنگی تاریخ‌ها
    const expireDateToken = configUtil.parseDateFromUtcTimestamp(decoded.exp);
    const expireDateDB = configUtil.parseDateFromDatabase(expireDateDb);

    if (!expireDateDB || isNaN(expireDateDB.getTime())) {
      return {
        error: "Database expireDate is not valid",
        valid: false,
        decoded: null,
      };
    }

    const tokenTime = expireDateToken.getTime();
    const dbTime = expireDateDB.getTime();

    const diff = Math.abs(tokenTime - dbTime);

    if (diff > 5000) {
      return {
        error: "Token expire date does not match database",
        valid: false,
        decoded: null,
      };
    }

    return {
      valid: true,
      decoded: decoded,
      error: "Ok",
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return {
        valid: false,
        decoded: null,
        error: "Token expired",
      };
    }

    return {
      valid: false,
      decoded: null,
      error: "Invalid token",
    };
  }
}

function verifyToken(tokenDb, email) {
  try {
    const { secret } = configUtil.getJwtConfig();
    const decoded = jwt.verify(tokenDb, secret);

    if (!decoded.exp) {
      return {
        error: "Token does not contain exp field",
        valid: false,
        decoded: null,
      };
    }
    if (!decoded.email) {
      return {
        error: "Email does not contain exp field",
        valid: false,
        decoded: null,
      };
    }

    if (decoded.email !== email) {
      return {
        error: "Email does not match token",
        valid: false,
        decoded: null,
      };
    }

    return {
      valid: true,
      decoded: decoded,
      error: "Ok",
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return {
        valid: false,
        decoded: null,
        error: "Token expired",
      };
    }

    return {
      valid: false,
      decoded: null,
      error: "Invalid token",
    };
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAndGetExpireDate,
  verifyToken,
};
