const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const registerController = async (req, res) => {
    const { username, password } = req.body
    const userExist = await userModel.findOne({
        username: username
    })
    if (userExist) {
        return res.status(409).json({
            message: "User already exist"
        })
    }

    const user = await userModel.create({
        username, password: await bcrypt.hash(password, 12)
    })
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)
    res.cookie('token', token)
    res.status(201).json({
        message: "User created sucessfully",
        token // Return token for mobile
    })
}
const loginController = async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({
        username: username
    })

    if (!user) {
        return res.status(401).json({
            message: "Json user doest not exist"
        })
    }
    const isPassCorrect = await bcrypt.compare(password, user.password)
    if (!isPassCorrect) {
        return res.status(410).json({
            message: "Unauthorized...."
        })
    }
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)
    res.cookie('token', token)
    res.status(203).json({
        message: "user logged in sucessfully",
        token // Return token for mobile
    })
}

module.exports = {
    registerController,
    loginController

}