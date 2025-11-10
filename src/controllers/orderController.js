const service = require('../services/orderService');

exports.list = async (req, res, next) => { try { res.json(await service.getAll()); } catch (e) { next(e); } };
exports.get = async (req, res, next) => { try { res.json(await service.getById(req.params.id)); } catch (e) { next(e); } };
exports.create = async (req, res, next) => { try { await service.create(req.body); res.send('✅ سفارش ثبت شد'); } catch (e) { next(e); } };
exports.update = async (req, res, next) => { try { await service.update(req.params.id, req.body); res.send('✏️ سفارش بروزرسانی شد'); } catch (e) { next(e); } };
exports.remove = async (req, res, next) => { try { await service.remove(req.params.id); res.send('🗑️ سفارش حذف شد'); } catch (e) { next(e); } };
exports.summary = async (req, res, next) => { try { res.json(await service.getOrderSummary()); } catch (e) { next(e); } };
exports.multiProduct = async (req, res, next) => { try { res.json(await service.getCustomersWithMultipleProducts()); } catch (e) { next(e); } };
