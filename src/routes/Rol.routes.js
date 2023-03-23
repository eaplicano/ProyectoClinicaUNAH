const express = require('express');
const RolController = require('../controllers/RolController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/Rol/Rol_Resumen',isLoggedIn, RolController.index);
router.get('/Rol/Permiso_Create/:id',isLoggedIn, RolController.indexpermiso);
router.get('/Rol/Permiso_Create/:id',isLoggedIn, RolController.storepermiso);
router.get('/Rol/Rol', RolController.create);
router.post('/Rol/Rol', RolController.store);
router.post('/Rol/delete', RolController.destroy);
router.get('/Rol/Rol_edit/:id', RolController.edit);
router.post('/Rol/Rol_edit/:id', RolController.update);

module.exports = router;