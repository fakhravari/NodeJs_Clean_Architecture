const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getConnection, sql } = require('../config/db');
const configUtil = require('../config/configUtil');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

function generateToken(email, fullName) {
    const { secret, expiresIn } = configUtil.getJwtConfig();
    return jwt.sign({ email, fullName }, secret, { expiresIn });
}

// 🟢 ثبت‌نام
exports.register = asyncHandler(async (req, res) => {
    const { FullName, Email, Password } = req.body;
    if (!FullName || !Email || !Password) throw new AppError(400, 'VALIDATION_ERROR', 'تمام فیلدها الزامی هستند');

    const pool = await getConnection();

    const check = await pool.request()
        .input('Email', sql.NVarChar(100), Email)
        .query('SELECT Email FROM Users WHERE Email=@Email');
    if (check.recordset.length > 0) throw new AppError(409, 'EMAIL_EXISTS', 'ایمیل قبلاً ثبت شده است');

    const hashed = await bcrypt.hash(Password, 10);
    const token = generateToken(Email, FullName);
    const issuedAt = configUtil.nowTehran();
    const expiresAt = configUtil.getExpiryDateTehran();

    await pool.request()
        .input('FullName', sql.NVarChar(100), FullName)
        .input('Email', sql.NVarChar(100), Email)
        .input('Password', sql.NVarChar(255), hashed)
        .input('Jwt', sql.NVarChar(500), token)
        .input('JwtIssuedAt', sql.DateTime, issuedAt)
        .input('JwtExpiresAt', sql.DateTime, expiresAt)
        .query(`
    INSERT INTO Users (FullName, Email, Password, Jwt, JwtIssuedAt, JwtExpiresAt)
    VALUES (@FullName, @Email, @Password, @Jwt, @JwtIssuedAt, @JwtExpiresAt)
  `);

    res.status(201).json({
        success: true,
        message: 'ثبت‌نام موفق',
        user: { fullName: FullName, email: Email },
        token,
        issuedAt: issuedAt.toISOString().replace('T', ' ').split('.')[0],
        expiresAt: expiresAt.toISOString().replace('T', ' ').split('.')[0]
    });
});

// 🟢 ورود
exports.login = asyncHandler(async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) throw new AppError(400, 'VALIDATION_ERROR', 'ایمیل و رمز عبور الزامی است');

    const pool = await getConnection();
    const result = await pool.request()
        .input('Email', sql.NVarChar(100), Email)
        .query('SELECT * FROM Users WHERE Email=@Email');

    const user = result.recordset[0];
    if (!user) throw new AppError(401, 'INVALID_CREDENTIALS', 'کاربر یا رمز عبور اشتباه است');

    const valid = await bcrypt.compare(Password, user.Password);
    if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'کاربر یا رمز عبور اشتباه است');

    res.json({ success: true, message: 'ورود موفق', user });
});
