const express = require('express');
const ConsultaController = require('../controllers/ConsultaController');
const { isLoggedIn } = require('../lib/auth');
const checkRoleAuth = require('../middleware/roleAuth');
 
const router = express.Router();

router.get('/consulta',isLoggedIn, ConsultaController.index);
// router.get('/consulta/index/:id',isLoggedIn, ConsultaController.index);
router.get('/consulta/consulta_create/:id', ConsultaController.create);
router.post('/consulta/consulta_create/:id', ConsultaController.store);

router.get('/consulta/sig_vital_create/:id', ConsultaController.createSigVital);
router.post('/consulta/sig_vital_create/:id', ConsultaController.storeSigVital);

router.get('/consulta/diagnostico_create/:id', ConsultaController.createDiagnostico);
router.post('/consulta/diagnostico_create/:id', ConsultaController.storeDiagnostico);

router.post('/consulta/delete', ConsultaController.destroy);
router.get('/consulta/consulta_edit/:id', ConsultaController.edit);
router.post('/consulta/consulta_edit/:id', ConsultaController.update);



module.exports = router;