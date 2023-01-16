const model = require('../../models/index');
const { v4: uuidv4 } = require('uuid');
const Op = require("sequelize").Op;
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');


//get member list
exports.getMemberList = async () => {
    const where = {};

    // //check type is null
    // if (!type) {
    //     where.type = {
    //         [Op.all]: sequelize.literal('SELECT 1'),
    //     };
    // }

    const member = await model.members.findAll({
        where: where,
        attributes: { exclude: [ 'id', 'update_at','password'] },
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
        if (!data.fname || !data.lname || !data.bank_name || !data.bank_number || !data.tel || !data.line_id || !data.platform || !data.password || !data.affiliate_by) {
            const error = new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
            error.statusCode = 400
            throw error;
        }
        //check username is duplicate
        const check_member = await model.members.findOne({
            where: {
                username: data.username
            }
        });
    
        if (check_member) {
            const error = new Error("ชื่อผู้ใช้ซ้ำ");
            error.statusCode = 401
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
    
        //create member
        const member = await model.members.create({
            uuid: uuidv4(),
            name: data.fname +' '+ data.lname,
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
exports.updateMember = async (data, admin,uuid) => {
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
        name: data.fname +' '+ data.lname,
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
        attributes: { exclude: ['id','password'] }
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
        attributes: { exclude: ['id','password'] }
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
        attributes: { exclude: ['id','password'] }
    });

    //return member
    return member
}
