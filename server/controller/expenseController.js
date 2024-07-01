const expense=require('../models/expense')
const user=require('../models/user')
const jsonData=require('C:/backup2/expense_tracker/client/src/assets/currencies.json')
const CC = require('currency-converter-lt')
const mongoose = require("mongoose")
// /expense post create expense
module.exports.expense_post = async(req,res)=>{
    const data = req.body;
    let u;
    try{
     u=await user.findById(data.userid)
    }
    catch(error){
      res.status(400).send(error)
    }
    let from=jsonData.filter((x)=>x.name === data.Currancy)
    let to=jsonData.filter((x)=>x.name === u.Currancy)
    if(from.length > 0 && to.length > 0){
  var CC = require("currency-converter-lt");
  try {
    let currencyConverter = new CC({ from: from[0].code, to: to[0].code, amount: data.Amount });
    const convertedAmount = await currencyConverter.convert();
    let temp = { ...data, Amount: convertedAmount };
    const i = await expense.create(temp);
    res.status(201).send("expense successfully inserted");
  } catch (error) {
    res.status(400).send(error);
  }
  
    
    }
}


// /expense patch update expense
module.exports.expense_patch = async(req,res)=>{
    const obj = req.body;
    // console.log("u id",obj._id)
    expense
      .findByIdAndUpdate(obj._id, req.body, { new: true })
      .then((stud) => {
        if (!stud) {
          return res.status(404).send("not found");
        }
        //  console.log("exp",stud)
        res.send(stud);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
}


// /deleteexpens delete delete expense
module.exports.deleteexpense_delete = async(req,res)=>{
    const id = req.body.id;

    expense
      .findByIdAndDelete(id)
      .then((stud) => {
        if (!stud) {
          return res.status(404).send("not found");
        }
        res.send(stud);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
}


// /searchexpense post search expenses
module.exports.searchexpense_post =async(req,res)=>{
    let data = req.body.value;
    let id = new mongoose.Types.ObjectId(data.userid);
    data = data.value;
  
    try {
      let e;
      if (data === "") {
        e = await expense.aggregate([
          {
            $match:{
              $expr:{
                $and: [
                  { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
                  { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
                ],
             
              },
              userid:id
                
             },
             },
          {
            $sort:{
              Date:-1
            }
          }
        ]);
      } 
        else{
          e = await expense.aggregate([
            {
              $match: {
                $or: [
                  { Category: { $regex: data, $options: "i" } },
                  { Description: { $regex: data, $options: "i" } },
                  { Merchant: { $regex: data, $options: "i" } },
                  { PaidBy: { $regex: data, $options: "i" } },
                  { PaymentMode: { $regex: data, $options: "i" } },
                  { Currancy: { $regex: data, $options: "i" } },
                ],
                userid: id,
              },
            },
            {
              $sort:{
                Date:-1
              }
            }
          ]);
        }
      res.status(201).send(e);
    } catch (error) {
      res.status(400).send(error);
    }
}


// /expensedetail post get all expense details
module.exports.expensedetail_post =async(req,res)=>{
    const userId = new mongoose.Types.ObjectId(req.body.userid);
  try {
    const expenses = await expense.aggregate([
      {
        $match:{
          $expr:{
            $and: [
              { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
              { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
            ],
         
          },
          userid:userId  
         },
        },
      {
        $sort:{
          Date:-1
        }
      },
     
    ]);
   
    res.status(201).send(expenses);
   
  } catch (error) {
    res.status(400).send(error);
  }
}

// /expenseupdate post get particular expense detail for update expense
module.exports.expenseupdate_post = async(req,res)=>{
    const id = req.body.id;

    try {
      const expenses = await expense.find({ _id: id });
      res.status(201).send(expenses);
    } catch (error) {
      res.status(400).send(error);
    }
}


// /expensepreview post for expense preview
module.exports.expensepreview_post =async(req,res)=>{
    const id=req.body.id
  console.log(id)
  try{
    const i=await expense.findById(id)
    console.log("expense: ",i)
    res.status(201).send(i)

  }
  catch(error){
    res.status(400).send(error)
  }
}

// expenspreview and expenseupdate are same so delete one api

// /userexpense post get total expense of user
module.exports.userexpense = async (req,res)=>{
    const userid = new mongoose.Types.ObjectId(req.body.userid);
  console.log("userid", userid);
  try {
    const e = await expense.aggregate([
      {
        $match: {
          userid: userid,
        },
      },
      {
        $group: {
          _id: "$userid",
          TotalExpense: { $sum: "$Amount" },
        },
      },
    ]);

    console.log("userexpense", e);
    res.status(201).send(e);
  } catch (error) {
    res.status(400).send(error);
  }
}