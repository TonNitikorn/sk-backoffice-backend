//import service
const reportServices = require('./service');

//update member
exports.updateMember = async(req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const uuid = req.body.uuid;
        const member = await reportServices.updateMember(data, admin, uuid);
        res.status(200).json({ message: 'แก้ไขสมาชิกสำเร็จ' });
    } catch (error) {
        next(error);
    }
}

//create transaction
exports.createTransaction = async(req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        const transaction = await reportServices.createTransaction(data, admin);
        res.status(200).json({ message: 'สร้างรายการสำเร็จ' });
    } catch (error) {
        next(error);
    }
}

//list transaction by transfer_type
exports.listTransactionByTransferType = async(req, res, next) => {
    try {
        const admin = req.admin;
        const transfer_type = req.body.transfer_type;
 //check transfer_type is null
        if (transfer_type == null || transfer_type == undefined  || !transfer_type == 'DEPOSIT' || !transfer_type == 'WITHDRAW' ) {
            const error = new Error("ประเภทคำขอไม่ถูกต้อง");
                error.statusCode = 400;
                throw error;
        }

        const transaction = await reportServices.listTransactionByTransferType(admin, transfer_type);
        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
}

//list transaction by if status_transction = 'MANUAL'
exports.listTransactionByStatusTransction = async(req, res, next) => {

    try {
        const admin = req.admin;
        const status_transction = req.body.status_transction;
        //check status_transction is null
        if (status_transction == null || status_transction == undefined || !status_transction == 'MANUAL') {
            const error = new Error("สถานะคำขอไม่ถูกต้อง");
                error.statusCode = 400;
                throw error;
        }

        const transaction = await reportServices.listTransactionByStatusTransction(admin, status_transction);
        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
}



