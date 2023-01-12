const model = require('../../models/index');
const config = require('../../config/index');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

exports.login = async (data) => {
    //check username and password is null
    if (!data.username || !data.password) {
        return res.status(400).json({
            message: 'ข้อมูลไม่ถูกต้อง'
        });
    }

    const admin = await model.admins.findOne({
        where: {
            username: data.username
        }
    });

    if (!admin) {
        const error = new Error("Username หรือ Password ไม่ถูกต้อง");
        error.statusCode = 401
        throw error;
    }

    // check password by bcryptjs
    const isMatch = await bcrypt.compare(data.password, admin.password);
    if (!isMatch) {
        const error = new Error("รหัสผ่านไม่ถูกต้อง");
        error.statusCode = 401
        throw error;
    }

    // check status is active
    if (admin.status !== 'ACTIVE') {
        const error = new Error("Account is not active")
        error.statusCode = 401
        throw error;
    }

    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'login',
        description: data,
        create_at: new Date(),
    });

    const token = jwt.sign({ uuid: admin.uuid, }, config.JWT_KEY, { expiresIn: config.JWT_EXP });
    // const expiresin = jwt.decode(token).exp;

    return {
        access_token: token,
        token_type: "Bearer"
    }
};

exports.register = async (data) => {
    //check body data is null
    if (!data.name || !data.username || !data.password || !data.role || !data.tel || !data.status || !data.preference || !data.create_by) {
        return res.status(400).json({
            message: 'ข้อมูลไม่ถูกต้อง'
        });
    }
    // const member = await model.members.findOne({
    //     where: {
    //         tel : tel
    //     }
    // });
    // if (member) {
    //     const error = new Error("หมายเลขโทรศัพท์นี้มีผู้ใช้งานแล้ว");
    //     error.statusCode = 401
    //     throw error;
    // }

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
        create_by: data.create_by,
        create_at: new Date(),
    });

    //log action
    await model.log_actions.create({
        uuid: uuidv4(),
        admins_uuid: admin.uuid,
        actions: 'register',
        description: data,
        create_at: new Date(),
    });
    

    const token = jwt.sign({ uuid: admin.uuid, }, config.JWT_KEY, { expiresIn: config.JWT_EXP });
    // const expiresin = jwt.decode(token).exp;
    return {
        access_token: token,
        token_type: "Bearer"
    }
};
 

