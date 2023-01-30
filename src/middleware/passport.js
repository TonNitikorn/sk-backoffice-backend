const models = require("../models/index");
const passport = require('passport');
const config = require('../config/index');

// const JwtStrategy = require('passport-jwt').Strategy,ExtractJwt = require('passport-jwt').ExtractJwt;
const { Strategy: JwtStrategy, ExtractJwt: ExtractJwt } = require('passport-jwt');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_KEY,
}, async(token, done) => {
    return done(null, token);
}));

exports.authorized = async(req, res, next) => {
    passport.authenticate('jwt', { session: false, }, async(error, token) => {
        try {
            if (error || !token) {
                const error = new Error("Unauthorized")
                error.statusCode = 401
                throw error;
            }

            const admin = await models.admins.findOne({
                where: { uuid: token.uuid },
            });

            if (!admin) {
                const error = new Error("Invalid Token")
                error.statusCode = 401
                throw error;
            }

            // check status is active
            if (admin.status !== 'ACTIVE') {
                const error = new Error("Account is not active")
                error.statusCode = 401
                throw error;
            }

            req.admin = admin;

        } catch (error) {
            next(error);
        }
        next();
    })(req, res, next);

}

exports.owner = async(req, res, next) => {
    try {
        if (req.admin.role !== "OWNER") {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};

exports.support = async(req, res, next) => {
    try {
        if (req.admin.role !== "SUPPORT" && req.admin.role !== "OWNER") {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};


exports.superadmin = async(req, res, next) => {
    try {
        if (req.admin.role !== "SUPERADMIN" && req.admin.role !== "SUPPORT" && req.admin.role !== "OWNER") {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};

exports.admin = async(req, res, next) => {
    try {
        if (req.admin.role !== "ADMIN" && req.admin.role !== "SUPERADMIN" && req.admin.role !== "SUPPORT" && req.admin.role !== "OWNER") {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};

exports.staff = async(req, res, next) => {
    try {
        if (req.admin.role !== "STAFF" && req.admin.role !== "ADMIN" && req.admin.role !== "SUPERADMIN" && req.admin.role !== "SUPPORT" && req.admin.role !== "OWNER") {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
}