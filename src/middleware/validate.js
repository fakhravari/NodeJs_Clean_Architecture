const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const details = {};
        errors.array().forEach(e => {
            const key = normalizeKey(e);
            if (!details[key]) details[key] = [];
            details[key].push(e.msg);
        });

        return next(new AppError(400, 'VALIDATION_ERROR', 'Validation failed', details));
    }
    next();
};
function normalizeKey(e) {
    const raw = e.param ?? e.path ?? e.location ?? 'body';
    return String(raw).toLowerCase();
}
