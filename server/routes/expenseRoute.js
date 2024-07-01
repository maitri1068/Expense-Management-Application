const Router=require('express')
const expenseController=require('../controller/expenseController')
const router=Router()



router.post('/expense',expenseController.expense_post)
router.patch('/expense',expenseController.expense_patch)
router.delete('/deleteexpense',expenseController.deleteexpense_delete)
router.post('/searchexpense',expenseController.searchexpense_post)
router.post('/expensedetail',expenseController.expensedetail_post)
router.post('/expenseupdate',expenseController.expenseupdate_post)
router.post('/expensepreview',expenseController.expensepreview_post)
router.post('/userexpense',expenseController.userexpense)

module.exports=router