const express = require('express');
const ClinicaController = require('../controllers/ClinicaController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/clinica',isLoggedIn, ClinicaController.index);
router.get('/clinica', ClinicaController.create);
router.post('/clinica', ClinicaController.store);
router.post('/clinica/delete', ClinicaController.destroy);
router.get('/clinica/clinica_edit/:id', ClinicaController.edit);
router.post('/clinica/clinica_edit/:id', ClinicaController.update);



module.exports = router;