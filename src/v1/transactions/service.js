const model = require('../../models/index');
const { v4: uuidv4 } = require('uuid');
const Op = require("sequelize").Op;
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');


//get member list
exports.getMemberList = async (data, admin) => {
    const where = {};

    //where by create_at
    if (data.create_at_start && data.create_at_end) {
        where.create_at = {
            [Op.between]: [data.create_at_start, data.create_at_end]
        }
    }
    //set data.type = where

    if (data.type && data.data_search) {
        where[data.type] = data.data_search
    }

    const member = await model.members.findAll({
        where: where,
        attributes: { exclude: ['id', 'update_at', 'password'] },
        order: [
            ['id', 'DESC']
        ]

    });

    //return member list
    return member
}

//create member
exports.createMember = async (data, admin) => {

    //check model member is null
    if (!data.fname || !data.lname || !data.bank_name || !data.bank_number || !data.tel || !data.line_id || !data.platform || !data.password) {
        const error = new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
        error.statusCode = 400
        throw error;
    }
    //check bank_number and tel is duplicate
    const checkBankNumber = await model.members.findOne({
        where: {
            bank_number: data.bank_number
        }
    });
    if (checkBankNumber) {
        const error = new Error("เลขบัญชีซ้ำ");
        error.statusCode = 400
        throw error;
    }
    const checkTel = await model.members.findOne({
        where: {
            tel: data.tel
        }
    });
    if (checkTel) {
        const error = new Error("เบอร์โทรซ้ำ");
        error.statusCode = 400
        throw error;
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    //create log_actions
    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'create_member',
        description: data,
        create_at: new Date(),
    });

    //check platform is not friend set data.affiliate_by = -
    if (data.platform != 'friend') {
        data.affiliate_by = '-'
    }


    //create member
    const member = await model.members.create({
        uuid: uuidv4(),
        name: data.fname + ' ' + data.lname,
        fname: data.fname,
        lname: data.lname,
        bank_name: data.bank_name,
        bank_number: data.bank_number,
        tel: data.tel,
        line_id: data.line_id,
        platform: data.platform,
        password: hashPassword,
        create_by: '-',
        affiliate_by: data.affiliate_by,
        status: 'ACTIVE',
        credit: 0,
        points: 0,
        rank: 'MEMBER',
        point_affiliate: 0,
        create_at: new Date(),
    });

    //return member
    return member
}

//update member by uuid
exports.updateMember = async (data, admin, uuid) => {
    //check model member is null
    // if (!data.fname || !data.lname || !data.bank_name || !data.bank_number || !data.tel || !data.line_id || !data.platform || !data.password || !data.affiliate_by) {
    //     return res.status(400).json({
    //         message: 'ข้อมูลไม่ถูกต้อง'
    //     });
    // }

    //create log_actions
    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'update_member',
        description: data,
        create_at: new Date(),
    });

    //update member
    const member = await model.members.update({
        name: data.fname + ' ' + data.lname,
        fname: data.fname,
        lname: data.lname,
        bank_name: data.bank_name,
        bank_number: data.bank_number,
        tel: data.tel,
        line_id: data.line_id,
        platform: data.platform,
        create_by: '-',
        affiliate_by: data.affiliate_by,
        status: 'ACTIVE',
        credit: 0,
        points: 0,
        rank: 'MEMBER',
        point_affiliate: 0,
        create_at: new Date(),
    }, {
        where: {
            uuid: uuid
        },
        attributes: { exclude: ['id', 'password'] }
    });

    //return member
    return member
}

//chane member status by uuid
exports.changeMemberStatus = async (data, admin) => {
    //check model member is null
    if (!data.status) {
        return res.status(400).json({
            message: 'ข้อมูลไม่ถูกต้อง'
        });
    }

    //create log_actions
    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'change_member_status',
        description: data,
        create_at: new Date(),
    });

    //update member
    const member = await model.members.update({
        status: data.status,
    }, {
        where: {
            uuid: data.uuid
        },
        attributes: { exclude: ['id', 'password'] }
    });

    //return member
    return member
}

//get member by uuid
exports.getMemberByUuid = async (uuid) => {
    const member = await model.members.findOne({
        where: {
            uuid: uuid
        },
        attributes: { exclude: ['id', 'password'] }
    });

    //return member
    return member
}

//create withdraw request
exports.createWithdrawRequest = async (data, admin) => {
    //check model member is null
    if (!data.member_uuid || !data.amount) {
        const error = new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
        error.statusCode = 400
        throw error;
    }

    //check amount is not 0
    if (data.amount == 0) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check amount is not negative
    if (data.amount < 0) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check amount is not decimal
    if (data.amount % 1 != 0) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check amount is not more than 100,000
    if (data.amount > 100000) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check member is exist
    const member = await model.members.findOne({
        where: {
            uuid: data.member_uuid
        }
    });
    if (!member) {
        const error = new Error("ไม่พบสมาชิก");
        error.statusCode = 400
        throw error;
    }

    //check member credit is not 0
    if (member.credit == 0) {
        const error = new Error("เครดิตไม่พอ");
        error.statusCode = 400
        throw error;
    }

    //check member credit is not negative
    if (member.credit < 0) {
        const error = new Error("เครดิตไม่พอ");
        error.statusCode = 400
        throw error;
    }

    //check member credit is not more than amount
    if (member.credit < data.amount) {
        const error = new Error("เครดิตไม่พอ");
        error.statusCode = 400
        throw error;
    }

    //create withdraw request
    const withdraw_request = await model.transaction.create({
        // uuid: uuidv4(),
        // member_uuid: data.member_uuid,
        // amount: data.amount,
        // status: 'WAITING',
        // create_at: new Date(),
        uuid: uuidv4(),
        credit: data.amount,
        credit_before: 0,
        credit_after: 0,
        amount: 0,
        amount_before: 0,
        amount_after: 0,
        transfer_by: "admin.uuid",
        transfer_type: "WITHDRAW",
        status_transction: 'CREATE',
        status_provider: 'SUCCESS',
        status_bank: 'SUCCESS',
        content:'-',
        member_uuid: data.member_uuid,
        detail: '-',
        detail_bank: '-',
        slip: '-',
        create_at: new Date(),
    });

    // //create log_actions
    // await model.log_actions.create({
    //     uuid: uuidv4(),
    //     admins_uuid: admin.uuid,
    //     actions: 'create_withdraw_request',
    //     description: data,
    //     create_at: new Date(),
    // });

    //return withdraw_request
    return withdraw_request
}

// create transaction by member username
exports.createTransactionByMemberUsername = async (data, admin) => {
    //check model member is null
    if (!data.member_username || !data.amount) {
        const error = new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
        error.statusCode = 400
        throw error;
    }

    //check amount is not 0
    if (data.amount == 0) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check amount is not negative
    if (data.amount < 0) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check amount is not decimal
    if (data.amount % 1 != 0) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check amount is not more than 100,000
    if (data.amount > 100000) {
        const error = new Error("จำนวนเงินไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    //check member is exist
    const member = await model.members.findOne({
        where: {
            username: data.member_username
        }
    });
    if (!member) {
        const error = new Error("ไม่พบสมาชิก");
        error.statusCode = 400
        throw error;
    }

    //create transaction
    const transaction = await model.transaction.create({
        uuid: uuidv4(),
        credit: data.amount,
        credit_before: 0,
        credit_after: 0,
        amount: 0,
        amount_before: 0,
        amount_after: 0,
        transfer_by: admin.username,
        transfer_type: data.transfer_type,
        status_transction: 'MANUAL',
        status_provider: 'SUCCESS',
        status_bank: 'SUCCESS',
        content:data.content,
        member_uuid: member.uuid,
        detail: '-',
        detail_bank: '-',
        slip: '-',
        create_at: new Date(),
    });

    // //create log_actions
    // await model.log_actions.create({
    //     uuid: uuidv4(),
    //     admins_uuid: admin.uuid,
    //     actions: 'create_transaction_by_member_username',
    //     description: data,
    //     create_at: new Date(),
    // });

    //return transaction
    return transaction
}
