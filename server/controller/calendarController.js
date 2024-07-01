const expense=require('../models/expense')
const income=require('../models/income')
const mongoose = require("mongoose")
// /dayinfo
module.exports.dayinfo_post=async (req,res)=>{
    const id=new mongoose.Types.ObjectId(req.body.userid)
    const date=new Date(req.body.date).getDate()
    const month=new Date(req.body.date).getMonth()
    const year=new Date(req.body.date).getFullYear()
    // console.log("i",date,month,year)
    try{
      const i=await expense.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                {$eq:[{$dayOfMonth:'$Date'},date]},
                { $eq: [{ $month: "$Date" },  month+1] },
                { $eq: [{ $year: "$Date" }, year] },
              ],
            },
            userid: id,
          },
        },
      ])
      const i1=await income.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                {$eq:[{$dayOfMonth:'$Date'},date]},
                { $eq: [{ $month: "$Date" },  month+1] },
                { $eq: [{ $year: "$Date" }, year] },
              ],
            },
            userid: id,
          },
        },
      ])
      console.log(i)
      res.status(201).send({expense:i,income:i1})
  
    }
    catch(error){
      res.status(400).send(error)
    }
}