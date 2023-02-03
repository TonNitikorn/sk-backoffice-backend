const express = require('express');
const router = express.Router();
const memberServices = require('./controller');

//middleware
const passport = require('../../middleware/passport');

router.post('/member_list', [ passport.authorized ], memberServices.getMemberList);
router.post('/create_member',[ passport.authorized ], memberServices.createMember);
router.post('/update_member',[ passport.authorized ], memberServices.updateMember);
router.post('/set_member_status',[ passport.authorized ], memberServices.changeMemberStatus);
router.post('/get_member' , memberServices.getMemberByUuid);
//post member and transaction
router.post('/member_transaction' , memberServices.getMemberAndTransactionByUuid);



module.exports = router;


