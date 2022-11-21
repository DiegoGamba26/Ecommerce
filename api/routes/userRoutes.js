const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
router.get('/', controller.list);
router.post('/register', controller.register);
router.post('/checkout', controller.checkout);
router.post('/login', controller.login);
router.post('/products_insert', controller.products_insert);
router.get('/products_consult', controller.products_consult);
router.post('/verify', controller.verify);
router.get('/produtcs_id/:id_product', controller.products_id);
router.get('/profile/:document', controller.profile);



module.exports = router;