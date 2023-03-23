const express = require('express');
const OperacionController = require('../controllers/OperacionController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Operacion',isLoggedIn, OperacionController.index)
router.get('/Operacion', OperacionController.index);
router.get('/operacion_create', OperacionController.create);
router.post('/operacion_create', OperacionController.store);
router.post('/Operacion/delete', OperacionController.destroy);
router.get('/Operacion/operacion_edit/:id', OperacionController.edit);
router.post('/Operacion/operacion_edit/:id', OperacionController.update);

module.exports = router;