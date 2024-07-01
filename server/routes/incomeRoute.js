const Router=require('express')
const incomeController = require('../controller/incomeController')
const router = Router()



router.post('/income',incomeController.income_post)
router.patch('/income',incomeController.income_patch)
router.delete('/deleteincome',incomeController.deleteincome_delete)
router.post('/incomeupdate',incomeController.incomeupdate_post)
router.post('/searchincome',incomeController.searchincome_post)
router.post('/incomepreview',incomeController.incomepreview_post)
router.post('/incomedetail',incomeController.incomedetail_post)
router.post('/userincome',incomeController.userincome_post)
router.post('/userincomee',incomeController.userincomee_post)

module.exports=router