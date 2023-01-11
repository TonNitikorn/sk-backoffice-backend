//import service
const memberServices = require('./service');

//get member list
exports.getMemberList = async (req, res, next) => {
    try {
        const member = await memberServices.getMemberList();
        res.status(200).json(
            member
        );
    } catch (error) {
        next(error);
    }
}

//create member
exports.createMember = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const member = await memberServices.createMember(data, admin);
        res.status(200).json(
            {
                message: 'สร้างสมาชิกสำเร็จ',
                member
            }
        );
    } catch (error) {
        next(error);
    }
}

//update member
exports.updateMember = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const uuid = req.params.uuid;
        const member = await memberServices.updateMember(data, admin,uuid);
        res.status(200).json({message: 'แก้ไขสมาชิกสำเร็จ'});
    } catch (error) {
        next(error);
    }
}

//set member status by uuid
exports.setMemberStatus = async (req, res, next) => {
    try {
        const uuid = req.body.uuid;
        const admin = req.admin;
        const member = await memberServices.setMemberStatus(uuid, admin);
        res.status(200).json(
            {
                message: 'แก้ไขสถานะสมาชิกสำเร็จ',
                member
            }
        );
    } catch (error) {
        next(error);
    }
}

//get member by uuid
exports.getMemberByUuid = async (req, res, next) => {
    try {
        const uuid = req.body.uuid;
        const member = await memberServices.getMemberByUuid(uuid);
        res.status(200).json(
            member
        );
    } catch (error) {
        next(error);
    }
}
