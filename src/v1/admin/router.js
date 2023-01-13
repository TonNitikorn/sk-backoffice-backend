const express = require('express');
const router = express.Router();
const adminController = require('./controller');

router.post('/register', adminController.register);



module.exports = router;