//import service
const transactionServices = require('./service');


//create withdraw request
exports.createWithdrawRequest = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const member = await transactionServices.createWithdrawRequest(data, admin);
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
//create transaction by member username
exports.createTransactionByMemberUsername = async(req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const transaction = await transactionServices.createTransactionByMemberUsername(data, admin);
        res.status(200).json({ message: 'สร้างรายการสำเร็จ' });
    } catch (error) {
        next(error);
    }
}
