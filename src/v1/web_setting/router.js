const express = require('express');
const router = express.Router();
const uploadController = require('./controller');

const passport = require('../../middleware/passport');

//get game_type
router.get('/get_game_type', uploadController.getGameType)
//create web_setting_logo
router.post('/create_web_setting_logo', uploadController.createWebSettingLogo)
//create web_setting_banner
router.post('/create_web_setting_banner', uploadController.createWebSettingBanner)


module.exports = router;