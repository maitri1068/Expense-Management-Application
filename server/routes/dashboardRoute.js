const Router =require('express')
const dashboardController=require('../controller/dashboardController')
const router=Router()


router.post('/currentmonthincome',dashboardController.currentmonthincome_post)
router.post('/latestuserinfo',dashboardController.latestuserinfo_post)
router.post('/expenseperiod',dashboardController.expenseperiod_post)
router.post('/incomeperiod',dashboardController.incomeperiod_post)
module.exports=router