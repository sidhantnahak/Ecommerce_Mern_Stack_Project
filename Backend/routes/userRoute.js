const express=require('express')
const { registerUser, userLogin, userLogout, forgetPassword, resetPassword, getUserdetails, updatePassword, updateProfile, getAlluser,getSingleuser, updateProfileRole, deleteUser } = require('../controllers/Usercontroller')
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router=express.Router()



router.route('/register').post(registerUser)
router.route('/login').post(userLogin)
router.route('/password/forget').post(forgetPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(userLogout)

router.route('/me').get(isAuthenticatedUser, getUserdetails)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizedRoles("admin"),getSingleuser).put(isAuthenticatedUser,authorizedRoles("admin"),updateProfileRole).delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser)
router.route('/admin/users').get(isAuthenticatedUser,authorizedRoles("admin"),getAlluser)


module.exports=router