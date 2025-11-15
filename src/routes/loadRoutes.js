const express = require('express');
const router = express.Router();

const loadController = require('../controllers/loadController');

// /loads
router.get('/', loadController.list);

// /loads/new
router.get('/new', loadController.showCreateForm);

// POST /loads → yeni kayıt
router.post('/', loadController.create);

// /loads/:id/edit → düzenleme formu
router.get('/:id/edit', loadController.showEditForm);

// POST /loads/:id → güncelle
router.post('/:id', loadController.update);

// /loads/:id → detay
router.get('/:id', loadController.showDetail);

// POST /loads/:id/delete → sil
router.post('/:id/delete', loadController.delete);

module.exports = router;
