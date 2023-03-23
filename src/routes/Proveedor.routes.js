const express = require('express');
const ProveedorController = require('../controllers/ProveedorController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Proveedor',isLoggedIn, ProveedorController.index)
router.get('/Proveedor', ProveedorController.index);
router.get('/proveedor_create', ProveedorController.create);
router.post('/proveedor_create', ProveedorController.store);
router.post('/Proveedor/delete', ProveedorController.destroy);
router.get('/Proveedor/proveedor_edit/:id', ProveedorController.edit);
router.post('/Proveedor/proveedor_edit/:id', ProveedorController.update);

module.exports = router;