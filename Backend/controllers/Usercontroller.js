const Errorhandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User=require('../models/userModel')
const sendToken=require('../utils/jwttokenhandler')
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto')
const cloudinary=require('cloudinary')


//create user
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{

    const mycloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop: "scale"
    })
    const {name,email,password}=req.body;
    const user=await User.create({
        name,email,password,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url
        }
    })

     sendToken(user,201,res)
})

//Login User
exports.userLogin=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(new Errorhandler("Invalid email and password",400))
    }

    const user=await User.findOne({email}).select("+password")

    if(!user){
        return next(new Errorhandler("Invalid email",401))

    }
    const ispasswordMatched=await user.comparePassword(password)

    if(!ispasswordMatched){
        return next(new Errorhandler("Invalid password",401))

    }
    sendToken(user,201,res)
 

})

//Logout user

exports.userLogout=catchAsyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{
       expires:new Date(Date.now()),
       httpOnly:true
    })

    res.status(200).json({
        sucess:true,
        message:"Logged out succefully"
    })
})

//Forget password
exports.forgetPassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email})

    if(!user){
        return next(new Errorhandler("user not found",404))
    }

    //get reset password token
    const resetToken=user.getResetToken()

    await user.save({validateBeforeSave:false});

    const resetPasswordURl=`${req.protocol}://${req.get('host')}/password/reset/${resetToken}`
    const message=`your password reset token is :-\n\n ${resetPasswordURl} \n\n if you have not requested this email then,please ignore it`;

    try {
        await sendEmail({
            email:user.email,
            subject:`Ecommerece password recovery`,
            message:message
        })
        res.status(200).json({
            sucess:true,
            message:`Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordExpire=undefined
        user.resetPasswordToken=undefined;
       await user.save({validateBeforeSave:false});
       return next(new Errorhandler(error.message,500))
        
    }

})

//Reset password
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{

    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt : Date.now() }
    })

    if(!user){
        return next(new Errorhandler("Reset token is invalid or has been expired",404))
    }
    if(req.body.password != req.body.confirmPassword){
        return next(new Errorhandler("password or confirm password does not match",404))
    }
    user.password=req.body.password;
    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;

    await user.save()
    sendToken(user,200,res)


})

//get user details
exports.getUserdetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    
    res.status(200).json({
        sucess:true,
        user
    })

})

//change password
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findById(req.user.id).select("+password")

    const ispasswordMatched=await user.comparePassword(req.body.oldPassword)

    if(!ispasswordMatched){
        return next(new Errorhandler("old password is incorrect",401))
    }
    if(req.body.newPassword!=req.body.confirmPassword){
        return next(new Errorhandler("new password and confirm password are not same password is incorrect",401))

    }
    user.password=req.body.newPassword
    await user.save()
    sendToken(user,201,res)
})

//update profile
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
   

    const newprofileData={
        name:req.body.name,
        email:req.body.email
    }

    if(req.body.avatar !== ""){

        const user= await User.findById(req.user.id)
        const imageId= user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId)
        const mycloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop: "scale"
        })

        newprofileData.avatar={
            public_id:mycloud.public_id,
            url:mycloud.url
        }
    }

    const user=await User.findByIdAndUpdate(req.user.id,newprofileData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        sucess:true,
        message:"profile updated"
    })
})

//get single user by id(admin)
exports.getSingleuser=catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`user does not exist with ${req.params.id} id`))
        
    }
    res.status(200).json({
        sucess:true,
        user
    })
})

//get all user details(admin)
exports.getAlluser=catchAsyncErrors(async(req,res,next)=>{
    const users= await User.find();

    if(!users){
        return next(new Errorhandler(`there are no users are availble`))
        
    }
    res.status(200).json({
        sucess:true,
        users
    })
})

//update user role(admin)
exports.updateProfileRole=catchAsyncErrors(async(req,res,next)=>{
   
    const newprofileData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    let user= await User.findById(req.params.id)

    if(!user){
        return next(new Errorhandler(`User not found on this id`))
    }

     user=await User.findByIdAndUpdate(req.params.id,newprofileData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        sucess:true,
        message:"Role updated"
    })
})

//delete user (admin)
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
   
    const user=await User.findByIdAndRemove(req.params.id)

    if(!user){
        return next(new Errorhandler(`user not found on this id `))
    }
     const imageId= user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId)

    res.status(200).json({
        sucess:true,
        message:"user deleted successfully"
    })
})
