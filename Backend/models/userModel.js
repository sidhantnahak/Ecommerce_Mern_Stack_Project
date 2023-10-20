const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"name can not exceed 30 characters"],
        minLength:[4,"name should be greaterthan 4 characters"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"please enter your email"],
        validate:[validator.isEmail,"please enter a valid email"],
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"password should be greaterthan 4 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    cretedAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){

      next()
    }

    //hashing password
    this.password=await bcryptjs.hash(this.password,10)

})

//jwt token
userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECREATEKEY,{
        expiresIn:process.env.EXPIRE_DAY,
    })
}

//compare password
userSchema.methods.comparePassword=async function(enteredpassword){
    return await bcryptjs.compare(enteredpassword,this.password)
}

//Generate password reset token
userSchema.methods.getResetToken=function(){

    //generate token
    const resetToken=crypto.randomBytes(20).toString("hex")

    //hashing and adding to userschema

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
    this. resetPasswordExpire=Date.now() + 15 * 60 * 1000
    return resetToken
}


module.exports=mongoose.model("User",userSchema)