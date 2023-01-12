// Description: Bank controller

const bankServices = require('./service');



//get bank list by type = deposit
exports.getBankList = async (req, res, next) => {
    try {
        console.log('req.params.type :>> ', req.query);
        const bank = await bankServices.getBankList(req.query.type);
       
    
        res.status(200).json(
             bank
        );

    } catch (error) {
        next(error);
    }
}

//create bank
exports.createBank = async (req, res, next) => {
    try {

        const data = req.body;
        const admin = req.admin;
        const bank = await bankServices.createBank(data, admin);
        res.status(200).json({
            message: 'สร้างบัญชีธนาคารสำเร็จ'
        });
    } catch (error) {
        next(error);
    }
}

//update bank
exports.updateBank = async (req, res, next) => {
    try {
        const uuid =   req.body.uuid;
        // console.log('uuid :>> ', uuid);
        const data = req.body;
        const admin = req.admin;
        const bank = await bankServices.updateBank(data, admin,uuid);
        res.status(200).json({
            message: 'แก้ไขบัญชีธนาคารสำเร็จ'
        });
    } catch (error) {
        next(error);
    }
}

//delete bank by uuid query
exports.deleteBank = async (req, res, next) => {
    try {
        const uuid =  req.body.uuid;
        const admin = req.admin;
        const bank = await bankServices.deleteBank(uuid, admin);
        res.status(200).json({
            message: 'ลบบัญชีธนาคารสำเร็จ'
        });
    } catch (error) {
        next(error);
    }
}
