const express = require('express');
const TipServicioController = require('../controllers/TipServicioController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Tipo_Servicio',isLoggedIn, TipServicioController.index)
router.get('/Tipo_Servicio', TipServicioController.index);
router.get('/TipServicio_create', TipServicioController.create);
router.post('/TipServicio_create', TipServicioController.store);
router.post('/Tipo_Servicio/delete', TipServicioController.destroy);
router.get('/Tipo_Servicio/TipServicio_edit/:id', TipServicioController.edit);
router.post('/Tipo_Servicio/TipServicio_edit/:id', TipServicioController.update);

module.exports = router;