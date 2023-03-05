const express = require('express')
const app = express()
const errorMiddleware = require('./middleware/error')
const cookieparser = require('cookie-parser')
const bodyparser = require('body-parser')
const fileupload = require('express-fileupload')
const path = require('path')

if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:"../.env"})
 }

app.use(express.json())
app.use(cookieparser())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(fileupload())

//Route imports

const product = require('./routes/productRoute')
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')
const payment = require('./routes/paymentRoute')


app.use("/api/vi", product)
app.use("/api/vi", user)
app.use("/api/vi", order)
app.use("/api/vi", payment)
app.use(errorMiddleware)

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})
app.use('/', (req, res) => {
    res.json({ message: "Hello sidhant" })
})

module.exports = app