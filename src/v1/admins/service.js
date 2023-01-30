const model = require('../../models/index');
const config = require('../../config/index');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

//get admin by token
exports.getAdminByToken = async (admin) => {
    const admin_data = await model.admins.findOne({
        where: {
            uuid: admin.uuid
        },
        attributes: { exclude: ['id', 'update_at', 'password'] }
    });

    return admin_data;
}

//update admin password
exports.updateAdminPassword = async (data, admin) => {

    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'update password',
        description: data,
        create_at: new Date(),
    });


    //generate 5 digit random number and charactor
    const new_password = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
    const salt = await bcrypt.genSalt(10);
    
    const hashPassword = await bcrypt.hash(new_password, salt);

    //find admin by uuid
    const admin_data = await model.admins.findOne({
        where: {
            uuid: data.uuid
        },
        attributes: { exclude: ['id', 'update_at', 'password','tel','create_by','create_at'] }
    });


    await model.admins.update({
        password: hashPassword,
        update_at: new Date()
    }, {
        where: {
            uuid: data.uuid
        }
    });

    return {new_password,admin_data}
}

exports.register = async (data,req_admin) => {
    //check body data is null
    if (!data.name || !data.username || !data.password || !data.role || !data.tel || !data.status || !data.preference) {
        const error = new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
        error.statusCode = 400
        throw error;
    }

    // check password by bcryptjs   
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    // create member
    const admin = await model.admins.create({
        uuid: uuidv4(),
        name: data.name,
        username: data.username,
        password: hashPassword,
        role: data.role,
        tel: data.tel,
        status: data.status,
        preference: data.preference,
        create_by: req_admin.uuid,
        create_at: new Date(),
    }, {
            attributes: { exclude: ['id', 'update_at', 'password'] }
        }
    );

    //log action
    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: req_admin.uuid,
        actions: 'register',
        description: data,
        create_at: new Date(),
    });


    const token = jwt.sign({ uuid: admin.uuid, }, config.JWT_KEY, { expiresIn: config.JWT_EXP });
    // const expiresin = jwt.decode(token).exp;
    return { admin }
};

//update admin
exports.updateAdmin = async (data, admin) => {
    //check body data is null
    if (!data.name || !data.role || !data.tel || !data.status || !data.preference) {
        const error = new Error("ข้อมูลไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'update',
        description: data,
        create_at: new Date(),
    });
    await model.admins.update({
        name: data.name,
        role: data.role,
        tel: data.tel,
        status: data.status,
        preference: data.preference,
        update_at: new Date()
    }, {
        where: {
            uuid: data.uuid
        }
    });
    return {
        message: 'แก้ไขข้อมูลสำเร็จ'
    }
}

//get all admin
exports.getAllAdmin = async () => {
    const admin_data = await model.admins.findAll({
        attributes: { exclude: ['id', 'update_at', 'password'] }
    });

    return admin_data;
}

//change admin password by uuid
exports.changeAdminPasswordByUuid = async (data, admin) => {
    //check body data is null
    if (!data.password) {
        const error = new Error("ข้อมูลไม่ถูกต้อง");
        error.statusCode = 400
        throw error;
    }

    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'change password',
        description: data,
        create_at: new Date(),
    });

    //generate password 10 digit
    const password = Math.random().toString(36).slice(-10);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);


    await model.admins.update({
        password: hashPassword,
        update_at: new Date()
    }, {
        where: {
            uuid: data.uuid
        }
    });
    return {
        message: 'แก้ไขรหัสผ่านสำเร็จ'
    }
}
