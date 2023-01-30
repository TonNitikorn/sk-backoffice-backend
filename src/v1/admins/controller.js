//impoer authService 
const adminService = require('./service');

//get admin by token
exports.getAdminByToken = async (req, res, next) => {
    try {
        const admin = await adminService.getAdminByToken(req.admin);
        res.status(200).json(admin);
    } catch (error) {
        next(error);
    }
}

//update admin password
exports.updateAdminPassword = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const adminUpdate = await adminService.updateAdminPassword(data, admin);
        res.status(200).json({adminUpdate,message: 'แก้ไขรหัสผ่านสำเร็จ'});
    } catch (error) {
        next(error);
    }
}

exports.register = async (req, res, next) => {
    try {
        
        const admin = await adminService.register(req.body,req.admin);
        res.status(200).json(
            admin
        );
    } catch (error) {
        next(error);
    }
}

//udpate admin data
exports.updateAdmin = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const adminUpdate = await adminService.updateAdmin(data, admin);
        res.status(200).json({message: 'แก้ไขข้อมูลสำเร็จ'});
    } catch (error) {
        next(error);
    }
}

//get all admin
exports.getAllAdmin = async (req, res, next) => {
    try {
        const admin = await adminService.getAllAdmin();
        res.status(200).json(admin);
    } catch (error) {
        next(error);
    }
}

//change admin password by uuid
exports.changeAdminPasswordByUuid = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const admindata = await adminService.changeAdminPasswordByUuid(data,admin);
        res.status(200).json({message: 'แก้ไขรหัสผ่านสำเร็จ'});
    } catch (error) {
        next(error);
    }
}


 