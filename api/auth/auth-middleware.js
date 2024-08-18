const User = require('./auth-model')
const {JWT_SECRET} = require('./secrets/secrets')
const jwt = require('jsonwebtoken')

const checkUsernamePassword = (req, res, next) => {
    const {username, password} = req.body
    if(!username || !password){
        next({status: 401, message: "username and password required"})
    }else{
        next()
    }
}
//login
const checkUsernameExists = async (req, res, next) => {
    try{
        const users = await User.findBy({username: req.body.username})
        if(users.length){
            req.user = users[0]
            next()
        }else{
            next({status: 422, message: 'invalid credentials'})
        }
    }catch(err){
        next(err)
    }
}

//register
const checkUsernameFree = async (req, res, next) => {
    try{
        const users = await User.findBy({username: req.body.username})
        if(!users.length){
            next()
        }else{
            next({status: 422, message: 'username taken'})
        }
    }catch(err){
        next(err)
    }
}

const buildToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username
    }

    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = {
    checkUsernameExists,
    checkUsernameFree,
    checkUsernamePassword,
    buildToken,
}