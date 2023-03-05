const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Errorhandler = require('../utils/errorHandler');
const Product = require('../models/productModel');
const Order = require('../models/orderModel')



//Create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    const { shippingInfo, orderInfo, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    const order = await Order.create({
        shippingInfo, orderInfo, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id
    })

    res.status(200).json({
        sucess: true,
        order
    })
})

//Get a single order by order id
exports.GetsingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if (!order) {
        return next(new Errorhandler("Order on this id not found", 404))
    }
    res.status(200).json({
        sucess: true,
        order
    })
})

//Get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    if (!orders) {
        return next(new Errorhandler("order not found on this id", 404))
    }
    res.status(200).json({
        sucess: true,
        orders
    })
})

//Get all orders and total price - Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
    if (!orders) {
        return next(new Errorhandler("order not found on this id", 404))
    }
    let totalAmount = 0
    orders.forEach((ord) => {
        totalAmount += ord.totalPrice
    })
    res.status(200).json({
        sucess: true,
        totalAmount,
        orders
    })
})

//Update order status - Admin
exports.UpdateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new Errorhandler("order not found on this id", 404))
    }
    if (order.orderStatus === "Delivered") {
        return next(new Errorhandler("you have already delivered this order", 404))
    }

    if (req.body.status === "Shipped") {
        order.orderInfo.forEach(async (ord) => {
            await updateStock(ord.product, ord.quantity)
        })
    }
    order.orderStatus = req.body.status

    if (req.body.status === "Delivered") {
        order.paidAt == Date.now()
    }
    await order.save({
        validateBeforeSave: false
    })

    res.status(200).json({
        sucess: true,
        order
    })
})
async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.stock -= quantity;
    product.save({ validateBeforeSave: false })
}

//delete a order -- admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new Errorhandler("order not found on this id", 404))
    }
    await order.remove()
    res.status(200).json({
        sucess: true,
        message: `Order on ${req.params.id} id deleted sucessfully `
    })
})
