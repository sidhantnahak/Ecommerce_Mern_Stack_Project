const app=require('./app')
const cloudinary=require('cloudinary')
// const dotenv=require('dotenv')

require('dotenv').config()
const connectDatabasae=require('./dataBase')

//handleing uncaught exception

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`shutting down the server due to uncaught exception rejection`)
    server.close(()=>{
        process.exit(1)
    })
})
// config
if(process.env.NODE_ENV!=="PRODUCTION"){
   require('dotenv').config({path:"../.env"})
}
//connect to database
connectDatabasae()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
const server=app.listen(process.env.PORT_KEY,()=>{
    console.log(`the server is running at http://localhost:${process.env.PORT_KEY}`)
})

//unhandled promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
}) 