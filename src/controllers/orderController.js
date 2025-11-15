const service = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.list = asyncHandler(async (req, res) => { const data = await service.getAll(); res.json({ success: true, data }); });
exports.get = asyncHandler(async (req, res) => { const item = await service.getById(req.params.id); if (!item) throw new AppError(404, 'ORDER_NOT_FOUND', 'سفارش یافت نشد'); res.json({ success: true, data: item }); });
exports.create = asyncHandler(async (req, res) => { await service.create(req.body); res.status(201).json({ success: true, message: 'سفارش ثبت شد' }); });
exports.update = asyncHandler(async (req, res) => { await service.update(req.params.id, req.body); res.json({ success: true, message: 'سفارش بروزرسانی شد' }); });
exports.remove = asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).json({ success: true, message: 'سفارش حذف شد' }); });
exports.summary = asyncHandler(async (req, res) => { const data = await service.getOrderSummary(); res.json({ success: true, data }); });
exports.multiProduct = asyncHandler(async (req, res) => { const data = await service.getCustomersWithMultipleProducts(); res.json({ success: true, data }); });

exports.listView = asyncHandler(async (req, res) => {
    const data = await service.getAllFromView();
    res.json({ success: true, data });
});

exports.listViewFormatted = asyncHandler(async (req, res) => {
    const data = await service.getAllFromViewFormatted();
    res.json({ success: true, data });
});
