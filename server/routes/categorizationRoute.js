const Router=require('express')
const categorizationController=require('../controller/categorizationController')
const router = Router()



router.post('/categorylist',categorizationController.categorylist_post)
router.post('/dailycategory',categorizationController.dailycategory_post)
router.post('/categoryinformation',categorizationController.categoryinformation_post)
router.post('/expenseyear',categorizationController.expenseyear_post)

module.exports=router