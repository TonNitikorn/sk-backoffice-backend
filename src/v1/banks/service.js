const model = require('../../models/index');
const { v4: uuidv4 } = require('uuid');
const Op = require("sequelize").Op;
const sequelize = require('sequelize');


//get bank list by type = deposit
exports.getBankList = async (type) => {
    const where = {};


//check type is null
    if (!type) {
      where.type = {
        [Op.all]: sequelize.literal('SELECT 1'),
      };
    }


    const bank = await model.banks.findAll({
        where: where,
        attributes: { exclude: ['id', 'update_at'] }
    });


    //return bank list
    return bank
}

//create bank by model bank
exports.createBank = async (data, admin) => {
// console.log('data.type :>> ', data.type);
    //check model bank is null
    if (!data.bank_no || !data.bank_number || !data.bank_name || !data.bank_account_name || !data.bank_total || !data.type || !data.tel || !data.birthdate || !data.pin || !data.device_id || !data.status || !data.sub_type || !data.is_decimal || !data.username_ibanking || !data.password_ibanking || !data.qr_code || !data.status_system ) {
        const error = new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
        error.statusCode = 400
        throw error;
    }
    //check bank_number and bank_name is duplicate
    const check_bank = await model.banks.findOne({
        where: {
            bank_number: data.bank_number,
            bank_name: data.bank_name
        }
    });

    if (check_bank) {
        const error = new Error("บัญชีธนาคารซ้ำ");
        error.statusCode = 401
        throw error;
    }

    //create log_actions
    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'create_bank',
        description: data,
        create_at: new Date(),
    });

    const bank = await model.banks.create({
        uuid: uuidv4(),
        bank_no: data.bank_no,
        bank_number: data.bank_number,
        bank_name: data.bank_name,
        bank_account_name: data.bank_account_name,
        bank_total: data.bank_total,
        type: data.type,
        tel: data.tel,
        birthdate: data.birthdate,
        pin: data.pin,
        device_id: data.device_id,
        status: data.status,
        sub_type: data.sub_type,
        is_decimal: data.is_decimal,
        username_ibanking: data.username_ibanking,
        password_ibanking: data.password_ibanking,
        qr_code: data.qr_code,
        status_system: data.status_system,
        create_at: new Date(),
    });

    //return bank list
    return bank
}

//update bank by model bank
exports.updateBank = async (data, admin,uuid) => {
    
        // //check model bank is null
        // if (!data.bank_no || !data.bank_number || !data.bank_name || !data.bank_account_name || !data.bank_total || !data.type || !data.tel || !data.birthdate || !data.pin || !data.device_id || !data.status || !data.sub_type || !data.is_decimal || !data.username_ibanking || !data.password_ibanking || !data.qr_code || !data.status_system ) {
        //     const error = new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
        //     error.statusCode = 400
        //     throw error;
        // }
    
        // //check bank_number and bank_name is duplicate
        // const check_bank = await model.banks.findOne({
        //     where: {
        //         bank_number: data.bank_number,
        //         bank_name: data.bank_name
        //     }
        // });
    
        // if (check_bank) {
        //     const error = new Error("บัญชีธนาคารซ้ำ");
        //     error.statusCode = 401
        //     throw error;
        // }
    
        //create log_actions
        await model.log_actions.create({
            uuid: uuidv4(),
            admins_uuid: admin.uuid,
            actions: 'update_bank',
            description: data,
            create_at: new Date(),
        });
    
        const bank = await model.banks.update({
            bank_no: data.bank_no,
            bank_number: data.bank_number,
            bank_name: data.bank_name,
            bank_account_name: data.bank_account_name,
            bank_total: data.bank_total,
            type: data.type,
            tel: data.tel,
            birthdate: data.birthdate,
            pin: data.pin,
            device_id: data.device_id,
            status: data.status,
            sub_type: data.sub_type,
            is_decimal: data.is_decimal,
            username_ibanking: data.username_ibanking,
            password_ibanking: data.password_ibanking,
            qr_code: data.qr_code,
            status_system: data.status_system,
            update_at: new Date(),
        }, {
            where: {
                uuid: uuid
            }
        });
    
        //return bank list
        return bank
    }

    //delete bank by uuid
    exports.deleteBank = async (uuid, admin) => {
        
            //create log_actions
            await model.log_actions.create({
                uuid: uuidv4(),
                admins_uuid: admin.uuid,
                actions: 'delete_bank',
                description: uuid,
                create_at: new Date(),
            });
        
            const bank = await model.banks.destroy({
                where: {
                    uuid: uuid
                }
            });
        
            //return bank list
            return bank
        }
        