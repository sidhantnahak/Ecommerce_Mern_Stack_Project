const Errorhandler=require('../utils/errorHandler')

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "internal server error"
    
    //wrong mongodb id error
    // if(err.name==="CastError"){
    //     const message=`Resource not found: Invalid :${err.path}`
    //     err=new Errorhandler(message,400)
    // }
    //wrong duplicate key error
    if(err.code===11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`
        err=new Errorhandler(message,400)
    }

    //wrong jsonwebtoken error
    if(err.name==="jsonWebTokenError"){
        const message=`json web token invalid,try again`
        err=new Errorhandler(message,400)
    }

    //jwt expire error
    if(err.name==="TokenExpiredError"){
        const message=`json web token expired,try again`
        err=new Errorhandler(message,400)
    }

    res.status(err.statusCode).json({
        sucess:false,
        message:err.message
    })
}