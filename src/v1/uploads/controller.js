const AWS = require('aws-sdk');
const config = require('../../config/index');
const { v4: uuidv4 } = require('uuid');
const model = require('../../models/index');
const { Op } = require("sequelize");
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
}).array('upload', 1);

//upload file
exports.uploadfile = async(req, res, next) => {
    upload(req, res, function(error) {
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

}

//create game_type
exports.createGameType = async(req, res, next) => {
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
          
            //check res.status 200
            // console.log('res.status :>> ', res.status);
            console.log('req.files :>> ', req.files);
            // console.log('req.body :>> ', req.body);
            
            let data = req.body;
            let admin = req.admin;
            let game_icon = req.files[0].location;
            //create game_type on service
            const game_type_data = await service.createGameType(data,admin,game_icon);
            res.status(201).json({
                message: 'success',
                status: true,
                data: game_type_data
            })
            
        });
    }
    catch (error) {
        next(error);
     }

}

//create sub_game_type
exports.createSubGameType = async(req, res, next) => {
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
            let game_icon = req.files[0].location;
            //create game_type on service
            const sub_game_type_data = await service.createSubGameType(data,admin,game_icon);
            res.status(201).json({
                message: 'success',
                status: true,
                data: sub_game_type_data
            })
            
        });
    }
    catch (error) {
        next(error);
     }
}

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

