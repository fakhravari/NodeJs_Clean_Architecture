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

function verifyAndGetExpireDate(token, email) {
  try {
    const { secret } = configUtil.getJwtConfig();
    const decoded = jwt.verify(token, secret);

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

    const expireDate = new Date(decoded.exp * 1000);
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
};
