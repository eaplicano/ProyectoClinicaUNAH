const express = require('express');
const ArticuloController = require('../controllers/ArticuloController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Articulo',isLoggedIn, ArticuloController.index);
router.get('/articulo_create', ArticuloController.create);
router.post('/articulo_create', ArticuloController.store);
router.post('/Articulo/delete', ArticuloController.destroy);
router.get('/Articulo/articulo_edit/:id', ArticuloController.edit);
router.post('/Articulo/articulo_edit/:id', ArticuloController.update);

module.exports = router;