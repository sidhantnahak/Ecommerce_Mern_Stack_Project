//Create token and save it in cookies

const sendToken=(user,statusCode,res)=>{
    const token=user.getJwtToken()
   
    //save it in cookies
    const options={
        expires:new Date(Date.now()+process.env.COOKIEEXPIRE_KEY*24*60*60*1000),
        httpOnly:true
    }
    res.status(statusCode).cookie("token",token,options).json({sucess:true,user,token})
}

module.exports=sendToken