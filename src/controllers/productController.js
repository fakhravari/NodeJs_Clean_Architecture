const service = require('../services/productService');

exports.list = async (req, res, next) => {
  try { res.json(await service.getAll()); } catch (e) { next(e); }
};
exports.get = async (req, res, next) => {
  try { res.json(await service.getById(req.params.id)); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try { await service.create(req.body); res.send('✅ محصول اضافه شد'); } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try { await service.update(req.params.id, req.body); res.send('✏️ محصول بروزرسانی شد'); } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try { await service.remove(req.params.id); res.send('🗑️ محصول حذف شد'); } catch (e) { next(e); }
};
