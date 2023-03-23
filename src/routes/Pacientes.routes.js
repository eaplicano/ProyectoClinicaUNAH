const express = require('express');
const PacienteController = require('../controllers/PacienteController');
const ExpedienteController = require('../controllers/ExpedienteController');
const { isLoggedIn } = require('../lib/auth');
const router = express.Router();

router.get('/Pacientes',isLoggedIn, PacienteController.index);
router.get('/pacientes_create', PacienteController.create);
router.post('/pacientes_create', PacienteController.store);
router.post('/Pacientes/delete', PacienteController.destroy);
router.get('/Pacientes/pacientes_edit/:id', PacienteController.edit);
router.post('/Pacientes/pacientes_edit/:id', PacienteController.update);

router.get('expediente/expediente_confirmar/:id', ExpedienteController.indexConfirmar);
module.exports = router;