const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getConnection, sql } = require("../config/db");
const configUtil = require("../config/configUtil");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyAndGetExpireDate,
  verifyToken,
} = require("../utils/authHelpers");

exports.register = asyncHandler(async (req, res) => {
  const { FullName, Email, Password } = req.body;
  if (!FullName || !Email || !Password)
    throw new AppError(400, "VALIDATION_ERROR", "تمام فیلدها الزامی هستند");

  const pool = await getConnection();

  const check = await pool
    .request()
    .input("Email", sql.NVarChar(250), Email)
    .query("SELECT Email FROM Users WHERE Email=@Email");
  if (check.recordset.length > 0)
    throw new AppError(409, "EMAIL_EXISTS", "ایمیل قبلاً ثبت شده است");

  const jwtConfig = configUtil.getJwtConfig();

  const hashed = await bcrypt.hash(Password, 10);
  const accessToken = generateAccessToken(Email, FullName);
  const refreshToken = generateRefreshToken();
  const expireDate = jwtConfig.expireDate;
  const issuedAt = jwtConfig.issuedAt;
  const tsql = `
    INSERT INTO Users (FullName, Email, Password,Password2, Jwt, JwtIssuedAt, JwtExpiresAt, RefreshToken)
    VALUES (@FullName, @Email, @Password,@Password2, @Jwt, @JwtIssuedAt, @JwtExpiresAt, @RefreshToken);
`;

  await pool
    .request()
    .input("FullName", sql.NVarChar(350), FullName)
    .input("Email", sql.NVarChar(250), Email)
    .input("Password", sql.NVarChar(255), hashed)
    .input("Password2", sql.NVarChar(255), Password)
    .input("Jwt", sql.NVarChar(sql.MAX), accessToken)
    .input("JwtIssuedAt", sql.DateTime, issuedAt)
    .input("JwtExpiresAt", sql.DateTime, expireDate)
    .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
    .query(tsql);

  res.status(201).json({
    success: true,
    message: "ثبت‌نام موفق",
    user: { fullName: FullName, email: Email },
    accessToken,
    refreshToken,
    issuedAt: issuedAt.formatDateTimeSQL(),
    expiresAt: expireDate.formatDateTimeSQL(),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password)
    throw new AppError(400, "VALIDATION_ERROR", "ایمیل و رمز عبور الزامی است");

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("Email", sql.NVarChar(250), Email)
    .query("SELECT * FROM Users WHERE Email=@Email");

  const user = result.recordset[0];
  if (!user)
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "کاربر یا رمز عبور اشتباه است"
    );

  const valid = await bcrypt.compare(Password, user.Password);
  if (!valid)
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "کاربر یا رمز عبور اشتباه است"
    );

  const varifyExpireDate = verifyAndGetExpireDate(
    user.Jwt,
    Email,
    user.JwtExpiresAt
  );
  if (varifyExpireDate.valid === false) {
    throw new AppError(401, "INVALID_CREDENTIALS", "توکن مشکل دارد");
  }

  res.json({
    success: true,
    message: "ورود موفق",
    user: user,
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    throw new AppError(400, "VALIDATION_ERROR", "refreshToken is required");

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
    .query("SELECT * FROM Users WHERE RefreshToken=@RefreshToken");

  const user = result.recordset[0];
  if (!user)
    throw new AppError(401, "INVALID_REFRESH", "Refresh token not found");

  const toeknn = verifyToken(user.Jwt, user.Email);
  if (toeknn.valid === false) {
    throw new AppError(401, "INVALID_REFRESH", "token not Valid");
  }

  const jwtConfig = configUtil.getJwtConfig();
  const newAccessToken = generateAccessToken(user.Email, user.FullName);
  const newRefreshToken = generateRefreshToken();
  const expireDate = jwtConfig.expireDate;
  const issuedAt = jwtConfig.issuedAt;

  try {
    const result = await pool
      .request()
      .input("Email", sql.NVarChar(250), user.Email)
      .input("OldRefreshToken", sql.NVarChar(sql.MAX), refreshToken)
      .input("NewAccessToken", sql.NVarChar(sql.MAX), newAccessToken)
      .input("NewRefreshToken", sql.NVarChar(sql.MAX), newRefreshToken)
      .input("JwtExpiresAt", sql.DateTime, expireDate)
      .input("JwtIssuedAt", sql.DateTime, issuedAt)
      .query(
        `UPDATE Users SET Jwt=@NewAccessToken,RefreshToken=@NewRefreshToken,JwtExpiresAt=@JwtExpiresAt,JwtIssuedAt=@JwtIssuedAt WHERE Email=@Email and RefreshToken=@OldRefreshToken`
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Could not revoke refresh token",
      });
    }
  } catch (e) {
    console.error("Could not rotate refresh token in DB:", e.message || e);
  }

  res.json({
    success: true,
    newAccessToken,
    newRefreshToken,
    expireDate,
    issuedAt,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    throw new AppError(400, "VALIDATION_ERROR", "refreshToken is required");

  const pool = await getConnection();
  try {
    const findResult = await pool
      .request()
      .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
      .query(`SELECT Id FROM Users WHERE RefreshToken = @RefreshToken`);

    if (findResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const updateResult = await pool
      .request()
      .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
      .query(
        `UPDATE Users SET RefreshToken = '-', Jwt = '-' WHERE RefreshToken = @RefreshToken`
      );
    if (updateResult.rowsAffected[0] === 0) {
      return res.status(500).json({
        success: false,
        message: "Could not revoke refresh token",
      });
    }
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Refresh token not found",
    });
  }

  res.json({ success: true, message: "Logged out" });
});
