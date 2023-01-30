const model = require('../../models/index');
const { v4: uuidv4 } = require('uuid');
const Op = require("sequelize").Op;
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

//update member by uuid
exports.updateMember = async(data, admin, uuid) => {
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

//create transaction
exports.createTransaction = async(data, admin) => {
    // //check model transaction is null
    // if (!data.members_uuid || !data.amount || !data.type || !data.description) {
    //     return res.status(400).json({
    //         message: 'ข้อมูลไม่ถูกต้อง'
    //     });
    // }

    // //create log_actions
    // await model.log_actions.create({
    //     uuid: uuidv4(),
    //     admins_uuid: admin.uuid,
    //     actions: 'create_transaction',
    //     description: data,
    //     create_at: new Date(),
    // });

    //create transaction
    const transaction = await model.transaction.create({
        uuid: uuidv4(),
        credit: data.credit,
        credit_before: data.credit_before,
        credit_after: data.credit_after,
        amount: data.amount,
        amount_before: data.amount_before,
        amount_after: data.amount_after,
        transfer_by: data.transfer_by,
        transfer_type: data.transfer_type,
        status_transction: data.status_transction,
        status_provider: data.status_provider,
        status_bank: data.status_bank,
        content: data.content,
        member_uuid: data.member_uuid,
        detail: data.detail,
        detail_bank: data.detail_bank,
        slip: data.slip,
        create_at: new Date(),

    });
 
    return transaction
}

//list transaction by transfer_type
exports.listTransactionByTransferType = async(admin,transfer_type) => {
    //get transaction
    const transaction = await model.transaction.findAll({
        where: {
            transfer_type: transfer_type,
        },
        attributes: { exclude: ['id'] }
    });
    //sum transaction amount_after
    const sumAmount = await model.transaction.sum('amount_after', {
        where: {
            transfer_type: transfer_type,
        }
    });

    //sum transaction credit
    const sumCredit = await model.transaction.sum('credit', {
        where: {
            transfer_type: transfer_type,
        }
    });


    //return transaction
    return {sumAmount,sumCredit,transaction}
}


