const express = require('express');
const ExpedienteController = require('../controllers/ExpedienteController');
const PacienteController = require('../controllers/PacienteController');
const ConsultaController = require('../controllers/ConsultaController');
const checkAuth = require('../middleware/auth');

const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

// // Consulta
router.get('/consulta',isLoggedIn, ConsultaController.index);

// Paciente
router.get('/pacientes_create', PacienteController.create);

//Antecedentes
router.get('/expediente/antecedentes_index/:id',isLoggedIn, ExpedienteController.indexAntecedente);

// Expediente
router.get('/expediente_seleccion/:id',isLoggedIn,  ExpedienteController.indexSeleccion);
// router.post('/expediente_seleccion/:id/:expe',isLoggedIn, ExpedienteController.postSeleccion);

router.get('/expediente_paciente', isLoggedIn, ExpedienteController.indexPaciente);

router.get('/expediente/expediente_confirmar/:id', ExpedienteController.indexConfirmar);
router.post('/expediente/expediente_confirmar/:id', ExpedienteController.saveConfirmar);

router.get('/expediente/expediente_consulta/:id', ExpedienteController.indexConsulta);
router.post('/expediente/expediente_consulta/:id', ExpedienteController.saveConsulta);
// router.get('/expediente/expediente_consulta_resume', ExpedienteController.indexConsulta);
router.get('/expediente/expediente_consulta_resume', ExpedienteController.indexallConsulta);

// router.get('/expediente/expediente_sig_vital/:id', ExpedienteController.indexSigVital);
// router.post('/expediente/expediente_sig_vital/:id', ExpedienteController.saveConsulta);

router.get('/expediente/expediente_antecedentes/:id', ExpedienteController.createAntecedente);
router.post('/expediente/expediente_antecedentes/:id', ExpedienteController.storeAntecedente);

router.get('/expediente',isLoggedIn, ExpedienteController.index);
router.get('/expediente_create', ExpedienteController.create);
router.post('/expediente_create', ExpedienteController.store);
router.post('/expediente/delete', ExpedienteController.destroy);
router.get('/expediente/expediente_edit/:id', ExpedienteController.edit);
router.post('/expediente/expediente_edit/:id', ExpedienteController.update);

// router.get('expediente/expediente_confirmar/:paciente', ExpedienteController.busquedaExp);


module.exports = router;