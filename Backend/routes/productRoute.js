
const express=require('express')
const { getAllproducts,createProduct,updateProduct, delteProduct,getProductdetails, createProductReview, getallReview, DeleteReview, getAdminproducts } = require('../controllers/productController')
const { isAuthenticatedUser ,authorizedRoles} = require('../middleware/auth')
const router=express.Router()


router.route('/products').get(getAllproducts)
router.route('/admin/products').get(isAuthenticatedUser,authorizedRoles("admin"),getAdminproducts)
router.route('/admin/products/new').post(isAuthenticatedUser,authorizedRoles("admin"),createProduct)
router.route('/admin/products/:id')
.put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizedRoles("admin"),delteProduct)

router.route('/products/:id').get(getProductdetails)
router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(getallReview).delete(isAuthenticatedUser,DeleteReview)



module.exports=router