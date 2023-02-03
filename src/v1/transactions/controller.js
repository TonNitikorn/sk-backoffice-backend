//import service
const memberServices = require('./service');


//create withdraw request
exports.createWithdrawRequest = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const member = await memberServices.createWithdrawRequest(data, admin);
        res.status(200).json(
            {
                message: 'สร้างคำขอถอนเงินสำเร็จ',
                member
            }
        );
    } catch (error) {
        next(error);
    }
}
