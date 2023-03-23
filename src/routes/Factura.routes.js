const express = require('express');
const FacturaController = require('../controllers/FacturaController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/factura',isLoggedIn, FacturaController.index);
router.get('/factura_create', FacturaController.create);
router.post('/factura_create', FacturaController.store);
router.post('/Factura/delete', FacturaController.destroy);
router.get('/Factura/factura_edit/:id', FacturaController.edit);
router.post('/Factura/factura_edit/:id', FacturaController.update);

module.exports = router;