const express = require('express');
const router = express.Router();
const adminController = require('./controller');

const passport = require('../../middleware/passport');

router.post('/register',[ passport.authorized ],  adminController.register);
router.post('/admin_profile',[ passport.authorized ], adminController.getAdminByToken);
router.post('/update_admin_password',[ passport.authorized ], adminController.updateAdminPassword);
router.post('/update_admin',[ passport.authorized ], adminController.updateAdmin);




module.exports = router;