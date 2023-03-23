const express = require('express');
const Contacto_emergController = require('../controllers/Contacto_emergController');
const { isLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/contacto_emerg',isLoggedIn, Contacto_emergController.index);
router.get('/contacto_emerg_create', Contacto_emergController.create);
router.post('/contacto_emerg_create', Contacto_emergController.store);
router.post('/contacto_emerg/delete', Contacto_emergController.destroy);
router.get('/contacto_emerg/contacto_emerg_edit/:id', Contacto_emergController.edit);
router.post('/contacto_emerg/contacto_emerg_edit/:id', Contacto_emergController.update);



module.exports = router;