const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model")


async function authMiddleware(req, res, next) {
    let token = req.cookies.token;

    // Also check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({
            _id: decoded.id
        })

        req.user = user;
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token, please login again"
        })
    }

}

module.exports = authMiddleware;