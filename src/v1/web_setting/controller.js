const service = require('./service');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, paginateListObjectsV2 } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "sgp1",
    credentials: {
        accessKeyId: 'DO00JH8GAEMF94ZKTTWM',
        secretAccessKey: 'ZVW8XXfuyMsldau2olroF/zJ7padKgQTRkF2oL6FlIs'
    },
    sslEnabled: true,

});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'cdn.softkingdoms',
        acl: 'public-read',
        key: function(request, file, cb) {
            console.log(file);
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
}).array('upload', 10);
//get game_type associated with sub_game_type
exports.getGameType = async(req, res, next) => {
    try {
        let data = req.body;
        let admin = req.admin;
        //get game_type on service
        const game_type_data = await service.getGameType(data,admin);
        res.status(201).json(game_type_data)
    }
    catch (error) {
        next(error);
     }
}

//create web_setting logo
exports.createWebSettingLogo = async(req, res, next) => {
    try {
        upload(req, res,async function(error) {
            if (error) {
                //throw error;
                console.log(error);
                // return res.status(400).json({message: error.message});
                const error = new Error(error.message);
                error.statusCode = 400
                throw error;
    
            }
 
            let data = req.body;
            let admin = req.admin;
            let logo = req.files[0].location;
            //create game_type on service
            const web_setting_logo_data = await service.createWebSetting(data,admin,logo);
            res.status(201).json({
                message: 'success',
                status: true,
                data: web_setting_logo_data
            })
        });
      
        
    }
    catch (error) {
        next(error);
     }
}

//create web_setting banner
exports.createWebSettingBanner = async(req, res, next) => {
    try {
        upload(req, res,async function(error) {
            if (error) {
                //throw error;
                console.log(error);
                // return res.status(400).json({message: error.message});
                const error = new Error(error.message);
                error.statusCode = 400
                throw error;
    
            }
            let data = req.body;
            let admin = req.admin;
            let banner = [];
//loop get req.files by length
            for (let i = 0; i < req.files.length; i++) {
                // banner = req.files[i].location;
                //map req.files to banner
                banner.push(req.files[i].location);
            }

            //create game_type on service
            const web_setting_banner_data = await service.createWebSettingBanner(data,admin,banner);
            res.status(201).json({
                message: 'success',
                status: true,
                data: web_setting_banner_data
            })
        });
      
        
    }
    catch (error) {
        next(error);
     }
}

//create web_setting slide
exports.createWebSettingSlide = async(req, res, next) => {
    try {
        upload(req, res,async function(error) {
            if (error) {
                //throw error;
                console.log(error);
                // return res.status(400).json({message: error.message});
                const error = new Error(error.message);
                error.statusCode = 400
                throw error;
    
            }
            let data = req.body;
            let admin = req.admin;
            let slide = [];
//loop get req.files by length
            for (let i = 0; i < req.files.length; i++) {
                // banner = req.files[i].location;
                //map req.files to banner
                slide.push(req.files[i].location);
            }

            //create game_type on service
            const web_setting_slide_data = await service.createWebSettingSlide(data,admin,slide);
            res.status(201).json({
                message: 'success',
                status: true,
                data: web_setting_slide_data
            })
        });

    }
    catch (error) {
        next(error);
     }
}

