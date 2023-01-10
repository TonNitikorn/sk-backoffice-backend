const express = require('express');
const router = express.Router();
const memberServices = require('./controller');

//middleware
const passport = require('../../middleware/passport');

router.get('/member_list', [ passport.authorized ], memberServices.getMemberList);
router.post('/create_member',[ passport.authorized ], memberServices.createMember);
router.post('/update_member/:uuid',[ passport.authorized ], memberServices.updateMember);
router.post('/set_member_status/:uuid',[ passport.authorized ], memberServices.setMemberStatus);
router.get('/get_member/:uuid',[ passport.authorized ], memberServices.getMemberByUuid);


module.exports = router;


