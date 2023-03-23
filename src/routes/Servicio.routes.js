const express = require('express');
const ServicioController = require('../controllers/ServicioController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Servicio',isLoggedIn, ServicioController.index)
router.get('/Servicio', ServicioController.index);
router.get('/servicio_create', ServicioController.create);
router.post('/servicio_create', ServicioController.store);
router.post('/Servicio/delete', ServicioController.destroy);
router.get('/Servicio/servicio_edit/:id', ServicioController.edit);
router.post('/Servicio/servicio_edit/:id', ServicioController.update);

module.exports = router;