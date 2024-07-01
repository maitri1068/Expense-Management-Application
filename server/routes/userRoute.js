const Router = require('express')
const userController=require('../controller/userController')

const router=Router()

router.post('/login',userController.login_post);
router.post('/user',userController.register_post)
router.post('/finduser',userController.finduser_post)
router.patch('/updateprofile',userController.updateprofile_patch)
router.post('/loginn',userController.loginn_post)
router.post('/verifyemail',userController.verifyemail_post)
router.post('/passwordreset',userController.passwordreset_post)
router.patch('/updatepassword',userController.updatepassword_patch)

module.exports=router