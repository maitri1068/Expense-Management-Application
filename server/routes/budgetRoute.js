const Router=require('express')
const budgetController=require('../controller/budgetController')
const router=Router()

router.post('/budget',budgetController.budget_post)
router.post('/budgetinfo',budgetController.budgetinfo_post)
router.post('/getcategorybudget',budgetController.getcategorybudget_post)
router.post('/userbudget',budgetController.userbudget_post)

module.exports=router