const express = require('express');
const DiagnosticoController = require('../controllers/DiagnosticoController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/diagnostico',isLoggedIn, DiagnosticoController.index);
router.get('/diagnostico_create', DiagnosticoController.create);
router.post('/diagnostico_create', DiagnosticoController.store);
router.post('/diagnostico/delete', DiagnosticoController.destroy);
router.get('/diagnostico/diagnostico_edit/:id', DiagnosticoController.edit);
router.post('/diagnostico/diagnostico_edit/:id', DiagnosticoController.update);



module.exports = router;