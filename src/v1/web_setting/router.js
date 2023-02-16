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
//create web_setting_slide
router.post('/create_web_setting_slide', uploadController.createWebSettingSlide)
//create web_setting_img_url
router.post('/create_web_setting_img_url', uploadController.createWebSettingImgUrl)
//get web_setting
router.get('/get_web_setting', uploadController.getWebSettingAll)
//delete web_setting by uuid
router.delete('/delete_web_setting', uploadController.deleteWebSetting)





module.exports = router;