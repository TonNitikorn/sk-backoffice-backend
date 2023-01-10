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
        res.status(200).json({message: 'แก้ไขรหัสผ่านสำเร็จ'});
    } catch (error) {
        next(error);
    }
}