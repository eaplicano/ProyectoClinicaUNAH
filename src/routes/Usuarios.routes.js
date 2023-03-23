const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/auth',isLoggedIn, UsuarioController.index);
// router.get('/singup', UsuarioController.create);
// router.post('/singup', UsuarioController.store);
router.post('/auth/delete', UsuarioController.destroy);
router.get('/auth/singup_edit/:id', UsuarioController.edit);
router.post('/auth/singup_edit/:id', UsuarioController.update);


module.exports = router;