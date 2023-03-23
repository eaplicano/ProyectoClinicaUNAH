const express = require('express');
const Tipo_consultaController = require('../controllers/Tipo_consultaController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/tipo_consulta',isLoggedIn, Tipo_consultaController.index);
router.get('/tipo_consulta_create', Tipo_consultaController.create);
router.post('/tipo_consulta_create', Tipo_consultaController.store);
router.post('/tipo_consulta/delete', Tipo_consultaController.destroy);
router.get('/tipo_consulta/tipo_consulta_edit/:id', Tipo_consultaController.edit);
router.post('/tipo_consulta/tipo_consulta_edit/:id', Tipo_consultaController.update);



module.exports = router;