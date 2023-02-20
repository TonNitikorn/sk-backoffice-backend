const express = require('express');
const router = express.Router();
const transactionServices = require('./controller');

//middleware
const passport = require('../../middleware/passport');

router.post('/withdraw_request', transactionServices.createWithdrawRequest);
router.post('/create_manual',[ passport.authorized ], transactionServices.createTransactionByMemberUsername);


module.exports = router;


