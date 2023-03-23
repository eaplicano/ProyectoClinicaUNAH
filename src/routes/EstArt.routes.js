const express = require('express');
const InventarioController = require('../controllers/EstArtController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Estado_Articulo',isLoggedIn, EstArtController.index)
router.get('/Estado_Articulo', EstArtController.index);
router.get('/EstArt_create', EstArtController.create);
router.post('/EstArt_create', EstArtController.store);
router.post('/Estado_Articulo/delete', EstArtController.destroy);
router.get('/Estado_Articulo/EstArt_edit/:id', EstArtController.edit);
router.post('/Estado_Articulo/EstArt_edit/:id', EstArtController.update);

module.exports = router;