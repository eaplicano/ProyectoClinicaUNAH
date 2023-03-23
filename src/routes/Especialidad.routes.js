const express = require('express');
const EspecialidadController = require('../controllers/EspecialidadController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/especialidad',isLoggedIn, EspecialidadController.index);
router.get('/especialidad_create', EspecialidadController.create);
router.post('/especialidad_create', EspecialidadController.store);
router.post('/especialidad/delete', EspecialidadController.destroy);
router.get('/especialidad/especialidad_edit/:id', EspecialidadController.edit);
router.post('/especialidad/especialidad_edit/:id', EspecialidadController.update);



module.exports = router;