const express = require('express');
const router = express.Router();
const bankController = require('./controller');

const passport = require('../../middleware/passport');


router.post('/bank_list',[ passport.authorized ], bankController.getBankList);
router.post('/create_bank',[ passport.authorized ], bankController.createBank);
router.post('/update_bank/:uuid',[ passport.authorized ], bankController.updateBank);
router.post('/delete_bank/:uuid',[ passport.authorized ], bankController.deleteBank);


module.exports = router;