const express = require('express');
const RecetaController = require('../controllers/RecetaController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/receta',isLoggedIn, RecetaController.index);
router.get('/receta_create', RecetaController.create);
router.post('/receta_create', RecetaController.store);
router.post('/receta/delete', RecetaController.destroy);
router.get('/receta/receta_edit/:id', RecetaController.edit);
router.post('/receta/receta_edit/:id', RecetaController.update);



module.exports = router;