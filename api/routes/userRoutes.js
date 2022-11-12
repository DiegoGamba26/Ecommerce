const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
router.get('/', controller.list);
router.get('/historyTransactions', controller.historyTransactions);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify', controller.verify);
router.get('/currency_list/:id', controller.currency_list);
router.post('/topUpBalance/:document', controller.topUpBalance);
router.post('/transfer/:document', controller.transfer);
router.get('/balance/:id', controller.balance);
router.get('/profile/:document', controller.profile);



module.exports = router;