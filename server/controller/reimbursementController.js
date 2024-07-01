const user=require('../models/user')
const expense=require('../models/expense')
const mongoose = require("mongoose")
// /reimbursementinfo post
module.exports.reimbursementinfo_post=async (req,res)=>{
    const userid=new mongoose.Types.ObjectId(req.body.userid);
    const transactiontype=req.body.transaction
    const paidby=req.body.paidby;
    const flag=req.body.flag;
    try{
      const i=await expense.aggregate([
        {
          $match:{
            userid:userid,
            transaction:transactiontype,
            PaidBy:(flag === 'pay' ? {$ne:paidby}:{$eq:paidby} )
          }
        },
        {
          $group:{
            _id:(flag === 'pay' ? '$PaidBy' : '$Merchant'),
            TotalAmount:{$sum:'$Amount'}
  
          }
        }
      ])
      res.status(201).send(i)
    }
    catch(error){
      res.status(400).send(error)
    }
}

// /reimbursementtransaction post
module.exports.reimbursementtransaction_post = async (req,res)=>{
    const name=req.body.name
    try{
      const i=await expense.aggregate([
      {
        $match:{
         $or:[
          {$and:[
            {transaction:'mytransaction'},
            {PaidBy:name}
          ]},
          {$and:[
            {Merchant:name},
            {PaidBy:'me'}
          ]}
         ]
        }
      },
      {
        $sort:{
          Date:1
        }
      }
      ])
      res.status(201).send(i)
     
    }
    catch(error){
      res.status(400).send(error)
    }
}