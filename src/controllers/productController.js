const service = require('../services/productService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.list = asyncHandler(async (req, res) => {
  const data = await service.getAll();
  res.json({ success: true, data });
});

exports.get = asyncHandler(async (req, res) => {
  const item = await service.getById(req.params.id);
  if (!item) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'محصول یافت نشد');
  res.json({ success: true, data: item });
});

exports.create = asyncHandler(async (req, res) => {
  await service.create(req.body);
  // service.create currently doesn't return the created object; respond with 201 and a message
  res.status(201).json({ success: true, message: 'محصول اضافه شد' });
});

exports.update = asyncHandler(async (req, res) => {
  await service.update(req.params.id, req.body);
  res.json({ success: true, message: 'محصول بروزرسانی شد' });
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).json({ success: true, message: 'محصول حذف شد' });
});
