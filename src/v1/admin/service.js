const model = require('../../models/index');
const config = require('../../config/index');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

//get admin by token
exports.getAdminByToken = async (admin) => {
    const admin = await model.admins.findOne({
        where: {
            uuid: admin.uuid
        },
        attributes: { exclude: ['id', 'update_at', 'password'] }
    });

    return admin;
}

//update admin password
exports.updateAdminPassword = async (data, admin) => {
    // //check body data is null
    // if (!data.password) {
    //     const error = new Error("ข้อมูลไม่ถูกต้อง");
    //     error.statusCode = 400
    //     throw error;
    // }

    // //check password is match
    // const isMatch = await bcrypt.compare(data.password, admin.password);
    // if (isMatch) {
    //     const error = new Error("รหัสผ่านเดิมไม่ถูกต้อง");
    //     error.statusCode = 400
    //     throw error;
    // }

    //find admin by uuid
    const admin = await model.admins.findOne({
        where: {
            uuid: admin.uuid
        }
    });
    
    //check admin is ACTIVE
    if (admin.status !== 'ACTIVE') {
        const error = new Error("Account is not active")
        error.statusCode = 401
        throw error;
    }

    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'update password',
        description: data,
        create_at: new Date(),
    });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    await model.admins.update({
        password: hashPassword,
        update_at: new Date()
    }, {
        where: {
            uuid: admin.uuid
        }
    });
    return {
        message: 'แก้ไขรหัสผ่านสำเร็จ'
    }
}
