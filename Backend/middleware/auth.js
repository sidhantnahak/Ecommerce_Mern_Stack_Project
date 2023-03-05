const jwt=require('jsonwebtoken')
const Errorhandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User=require('../models/userModel')

exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new Errorhandler("please login to access the details",401))
    }

    const decodedData=jwt.verify(token,process.env.JWT_SECREATEKEY)
    req.user=await User.findById(decodedData.id)
    next()
})
exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new Errorhandler(`Role:${req.user.role} is not allowed to access this resource`,401))
        }
        next()
    }
}