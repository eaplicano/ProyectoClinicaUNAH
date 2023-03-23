const express = require('express');
const AntecedentesController = require('../controllers/AntecedentesController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/antecedentes',isLoggedIn, AntecedentesController.index);
router.get('/antecedentes_create', AntecedentesController.create);
router.post('/antecedentes_create', AntecedentesController.store);
router.post('/antecedentes/delete', AntecedentesController.destroy);
router.get('/antecedentes/antecedentes_edit/:id', AntecedentesController.edit);
router.post('/antecedentes/antecedentes_edit/:id', AntecedentesController.update);



module.exports = router;