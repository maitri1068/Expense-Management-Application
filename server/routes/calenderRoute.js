const Router=require('express')
const calendarController=require('../controller/calendarController')
const router=Router()


router.post('/dayinfo',calendarController.dayinfo_post)

module.exports=router