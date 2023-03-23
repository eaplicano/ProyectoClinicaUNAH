const express = require('express');
const OrdenCController = require('../controllers/OrdenCController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Orden_Compra',isLoggedIn, OrdenCController.index)
router.get('/Orden_Compra', OrdenCController.index);
router.get('/ordenC_create', OrdenCController.create);
router.post('/ordenC_create', OrdenCController.store);
router.post('/Orden_Compra/delete', OrdenCController.destroy);
router.get('/Orden_Compra/ordenC_edit/:id', OrdenCController.edit);
router.post('/Orden_Compra/ordenC_edit/:id', OrdenCController.update);

module.exports = router;