const express = require('express');
const router = express.Router();
const uploadController = require('./controller');

const passport = require('../../middleware/passport');


router.post('/upload_file', uploadController.uploadfile)
router.post('/create_game_type', uploadController.createGameType)
router.post('/create_sub_game_type', uploadController.createSubGameType)
//get game_type
router.get('/get_game_type', uploadController.getGameType)

module.exports = router;