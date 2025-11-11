const service = require('../services/orderDetailService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.list = asyncHandler(async (req, res) => { const data = await service.getAll(); res.json({ success: true, data }); });
exports.get = asyncHandler(async (req, res) => { const item = await service.getById(req.params.id); if (!item) throw new AppError(404, 'ORDERDETAIL_NOT_FOUND', 'جزئیات سفارش یافت نشد'); res.json({ success: true, data: item }); });
exports.create = asyncHandler(async (req, res) => { await service.create(req.body); res.status(201).json({ success: true, message: 'جزئیات سفارش اضافه شد' }); });
exports.update = asyncHandler(async (req, res) => { await service.update(req.params.id, req.body); res.json({ success: true, message: 'جزئیات سفارش بروزرسانی شد' }); });
exports.remove = asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).json({ success: true, message: 'جزئیات سفارش حذف شد' }); });
exports.withProducts = asyncHandler(async (req, res) => { const data = await service.getOrderWithProducts(req.params.orderId); res.json({ success: true, data }); });
