const Router=require('express')
const reportController=require('../controller/reportController')
const router=Router()


router.post('/expenseperiod',reportController.expenseperiod_post)
router.post('/incomeperiod',reportController.incomeperiod_post)
router.post('/expensereport',reportController.expensereport_post)
router.post('/incomereport',reportController.incomereport_post)

module.exports=router