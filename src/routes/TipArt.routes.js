const express = require('express');
const TipArtController = require('../controllers/TipArtController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Tipo_Articulo',isLoggedIn, TipArtController.index)
router.get('/Tipo_Articulo', TipArtController.index);
router.get('/TipArt_create', TipArtController.create);
router.post('/TipArt_create', TipArtController.store);
router.post('/Tipo_Articulo/delete', TipArtController.destroy);
router.get('/Tipo_Articulo/TipArt_edit/:id', TipArtController.edit);
router.post('/Tipo_Articulo/TipArt_edit/:id', TipArtController.update);

module.exports = router;