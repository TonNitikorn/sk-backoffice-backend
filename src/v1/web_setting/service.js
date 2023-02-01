const AWS = require('aws-sdk');
const config = require('../../config/index');
const { v4: uuidv4 } = require('uuid');
const model = require('../../models/index');
const { Op, where } = require("sequelize");
const service = require('./service');


const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, paginateListObjectsV2 } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "sgp1",
    credentials: {
        accessKeyId: config.SPACES_ACCESS_KEY_ID,
        secretAccessKey: config.SPACES_SECRET_ACCESS_KEY
    },
    sslEnabled: true,

});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'cdn.softkingdoms',
        acl: 'public-read',
        key: function (request, file, cb) {
            console.log(file);
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
}).array('upload', 10);

exports.upload = async (req, res, next) => {
    let imgae_upload = await upload(req, res, function (error) {
        if (error) {
            //throw error;
            console.log(error);
            // return res.status(400).json({message: error.message});
            const error = new Error(error.message);
            error.statusCode = 400
            throw error;


        }
        res.status(200).json({
            message: 'File uploaded successfully',
            url: req.files[0].location
        });
    });
    return imgae_upload


}

//create game_type on service
exports.createGameType = async (data, admin, game_icon) => {
    const game_type_data = await model.game_type.create({
        uuid: uuidv4(),
        type_logo: game_icon,
        type_name_th: data.type_name_th,
        type_name_eng: data.type_name_eng,
        create_at: new Date(),
    })
    return game_type_data
}

//create sub_game_type by game_type on service
exports.createSubGameType = async (data, admin, game_icon) => {
    console.log('data :>> ', data.game_type_uuid);
    const sub_game_type_data = await model.sub_game_type.create({
        game_type_uuid: data.game_type_uuid,
        uuid: uuidv4(),
        game_icon: game_icon,
        game_id: data.game_id,
        game_name: data.game_name,
        create_at: new Date(),
    })
    return sub_game_type_data
}

//get game_type associate sub_game_type
exports.getGameType = async () => {
    const game_type_data = await model.game_type.findAll({
        include: [
            {
                model: model.sub_game_type,
                as: 'sub_game_type'
            }
        ]
    })
    return game_type_data
}



//create web_setting logo check findandcountall if 0 create else update
exports.createWebSetting = async (data, admin, logo) => {
    const web_setting = await model.web_setting.findAll();
    if (web_setting.count == 0) {
        const web_setting_data = await model.web_setting.create({
            uuid: uuidv4(),
            logo: logo,
            create_at: new Date(),
        })
        return web_setting_data
    } else {
        let uuid = web_setting[0].uuid;

        const web_setting_data = await model.web_setting.update({
            logo: logo,
            update_at: new Date(),
        }, {
            where: {
                uuid: uuid
            }
        })
        return web_setting_data
    }
}

//create web_setting banner check findandcountall if 0 create else update
exports.createWebSettingBanner = async (data, admin, banner) => {
    const web_setting = await model.web_setting.findAll();
    if (web_setting.count == 0) {
        const web_setting_data = await model.web_setting.create({
            uuid: uuidv4(),
            banner: banner,
            create_at: new Date(),
        })
        //return web_setting_data and banner count
        let banner_count = banner.length
        web_setting_data.banner_count = banner_count
        return web_setting_data
    } else {
        let uuid = web_setting[0].uuid
        const web_setting_data = await model.web_setting.update({
            banner: banner,
            update_at: new Date(),
        }, {
            where: {
                uuid: uuid
            }
        })
        //get web_setting
        const web_setting_data_get = await model.web_setting.findAll();
        return web_setting_data_get
    }
}

//create web_setting slide check findandcountall if 0 create else update
exports.createWebSettingSlide = async (data, admin, slide) => {
    const web_setting = await model.web_setting.findAll();
    if (web_setting.count == 0) {
        const web_setting_data = await model.web_setting.create({
            uuid: uuidv4(),
            slide: slide,
            create_at: new Date(),
        })
        //return web_setting_data and slide count
        let slide_count = slide.length
        web_setting_data.slide_count = slide_count
        return web_setting_data
    } else {
        let uuid = web_setting[0].uuid
        const web_setting_data = await model.web_setting.update({
            slide: slide,
            update_at: new Date(),
        }, {
            where: {
                uuid: uuid
            }
        })
        //get web_setting
        const web_setting_data_get = await model.web_setting.findAll();
        return web_setting_data_get
    }
}

