const Router=require('express')
const reimbursementController=require('../controller/reimbursementController')
const router=Router()



router.post('/reimbursementinfo',reimbursementController.reimbursementinfo_post)
router.post('/reimbursementtransaction',reimbursementController.reimbursementtransaction_post)

module.exports=router