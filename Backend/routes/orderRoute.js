const express=require('express')
const { newOrder, GetsingleOrder, myOrders, getAllOrders, UpdateOrder, deleteOrder } = require('../controllers/orderController')
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router=express.Router()


router.route('/orders/new').post(isAuthenticatedUser, newOrder)
router.route('/orders/:id').get(isAuthenticatedUser,GetsingleOrder)
router.route('/orders/me').post(isAuthenticatedUser,myOrders)
router.route('/admin/orders').get(isAuthenticatedUser,authorizedRoles("admin"),getAllOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizedRoles("admin"),UpdateOrder).delete(isAuthenticatedUser,authorizedRoles("admin"),deleteOrder)

module.exports=router