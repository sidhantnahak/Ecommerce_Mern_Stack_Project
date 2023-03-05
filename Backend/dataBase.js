const mongoose=require("mongoose")

const connectDatabasae=()=>{
    mongoose.connect(process.env.DB_URL,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    })
    .then((data)=>{
      console.log(`MongoDb connected with server:${data.connection.host}`)
    })
}

module.exports=connectDatabasae