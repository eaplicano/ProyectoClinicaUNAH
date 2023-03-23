const express = require('express');
const InventarioController = require('../controllers/InventarioController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Inventario',isLoggedIn, InventarioController.index)
router.get('/Inventario', InventarioController.index);
router.get('/inventario_create', InventarioController.create);
router.post('/inventario_create', InventarioController.store);
router.post('/Inventario/delete', InventarioController.destroy);
router.get('/Inventario/inventario_edit/:id', InventarioController.edit);
router.post('/Inventario/inventario_edit/:id', InventarioController.update);

module.exports = router;