const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
router.get('/', controller.list);
router.post('/register', controller.register);
router.post('/checkou', controller.checkout);
router.post('/login', controller.login);
router.post('/products_insert', controller.products_insert);
router.get('/products_consult', controller.products_consult);
router.post('/verify', controller.verify);
router.post('/transfer/:document', controller.transfer);
router.get('/profile/:document', controller.profile);



module.exports = router;