//impoer authService 
const authService = require('./service');

// login with jwt token 
exports.login = async (req, res, next) => {
    try {
      const admin = await authService.login(req.body);
        res.status(200).json(
            admin
        );

    } catch (error) {
        next(error);
    }
}

