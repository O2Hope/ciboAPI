const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

//Protect routes
exports.protect = asyncHandler((async (req, res, next) => {
    let token;

    const {authorization} = req.headers

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1]
    }

    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    // Make sure token exists

    if (!token) return next(new ErrorResponse('Not authorized to access', 401))

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id)

        next()
    }catch (e) {
        console.log(e.message)
        return next(new ErrorResponse('Not authorized to access', 401))
    }
}))

exports.authorize = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access to this resource`, 403))
    }
    next();
}