const expense=require('../models/expense')
const income=require('../models/income')
const mongoose = require("mongoose")
// /currentmonthincome
module.exports.currentmonthincome_post=async(req,res)=>{
    let userid = new mongoose.Types.ObjectId(req.body.userid);
console.log("ppp",new Date().getMonth() + 1)
  try {
    let data = await income.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
              { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
            ],
          },
          userid: userid,
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$Date" },
          TotalIncome: { $sum: "$Amount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    res.status(201).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
}

// /latestuserinfo
module.exports.latestuserinfo_post=async(req,res)=>{
    let userid = new mongoose.Types.ObjectId(req.body.userid);
    try {
      const latestExpense = await expense
        .findOne({ userid: userid })
        .sort({ Date: -1 });
      const latestIncome = await income
        .findOne({ userid: userid })
        .sort({ Date: -1 });
     
      res.status(201).send({
        latestExpense: latestExpense,
        latestIncome: latestIncome,
      });
    } catch (error) {
      res.status(400).send(error);
    }
}

// /expenseperiod post get data according to expense period
module.exports.expenseperiod_post = async (req,res)=>{
  let period = req.body.period;
  let userid = new mongoose.Types.ObjectId(req.body.userid);
  let month = req.body.month >= 0 ? req.body.month : new Date().getMonth() 
  let year =req.body.year ? req.body.year : new Date().getFullYear()
  console.log("p", userid,req.body.year,year,period);
  let data;
  try {
    if (period === "Daily") {
      data = await expense.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $month: "$Date" },  month+1] },
                { $eq: [{ $year: "$Date" }, year] },
              ],
            },
            userid: userid,
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: "$Date" },
            TotalExpense: { $sum: "$Amount" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    } else if (period === "Monthly") {
      data = await expense.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: "$Date" }, year] },
              ],
            },
            userid: userid,
          },
        },
        {
          $group: {
            _id: { $month: "$Date" },
            TotalExpense: { $sum: "$Amount" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    } else
     if (period === "Quaterly") {
      data = await expense.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: "$Date" }, year] },
              ],
            },
            userid: userid,
          }
        },
        {
          $group: {
            _id: {
                $switch: {
                  branches: [
                    { case: { $lte: [{ $month: "$Date" }, 3] }, then: "Q1" }, // Months 1 to 3 (January to March) belong to Q1
                    { case: { $lte: [{ $month: "$Date" }, 6] }, then: "Q2" }, // Months 4 to 6 (April to June) belong to Q2
                    { case: { $lte: [{ $month: "$Date" }, 9] }, then: "Q3" }, // Months 7 to 9 (July to September) belong to Q3
                  ],
                  default: "Q4" // Months 10 to 12 (October to December) belong to Q4
                }
             
            },
            TotalExpense: { $sum: "$Amount" } 
          }
        },
     
        
      ]);
    }
    console.log("period", data);
    res.status(201).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

// /incomeperiod post get data according to income period
module.exports.incomeperiod_post = async(req,res)=>{
  let period = req.body.period;
let userid = new mongoose.Types.ObjectId(req.body.userid);
let month = req.body.month >= 0 ? req.body.month : new Date().getMonth() 
let year =req.body.year ? req.body.year : new Date().getFullYear()
console.log("p", userid,req.body.year,year,period);
let data;
try {
  if (period === "Daily") {
    data = await income.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$Date" },  month+1] },
              { $eq: [{ $year: "$Date" }, year] },
            ],
          },
          userid: userid,
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$Date" },
          TotalIncome: { $sum: "$Amount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  } else if (period === "Monthly") {
    data = await income.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$Date" }, year] },
            ],
          },
          userid: userid,
        },
      },
      {
        $group: {
          _id: { $month: "$Date" },
          TotalIncome: { $sum: "$Amount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  } else
   if (period === "Quaterly") {
    data = await income.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$Date" }, year] },
            ],
          },
          userid: userid,
        }
      },
      {
        $group: {
          _id: {
              $switch: {
                branches: [
                  { case: { $lte: [{ $month: "$Date" }, 3] }, then: "Q1" }, // Months 1 to 3 (January to March) belong to Q1
                  { case: { $lte: [{ $month: "$Date" }, 6] }, then: "Q2" }, // Months 4 to 6 (April to June) belong to Q2
                  { case: { $lte: [{ $month: "$Date" }, 9] }, then: "Q3" }, // Months 7 to 9 (July to September) belong to Q3
                ],
                default: "Q4" // Months 10 to 12 (October to December) belong to Q4
              }
           
          },
          TotalIncome: { $sum: "$Amount" } 
        }
      }
 
    ]);
  }
  console.log("period", data);
  res.status(201).send(data);
} catch (error) {
  console.log(error);
  res.status(400).send(error);
}
}