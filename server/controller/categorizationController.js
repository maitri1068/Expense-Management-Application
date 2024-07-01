const expense = require('../models/expense')
const income= require('../models/income')
const mongoose = require("mongoose")

// /categorylist
module.exports.categorylist_post = async(req,res)=>{
    const id = new mongoose.Types.ObjectId(req.body.userid);
    console.log("userid",id);
    try {
      const category = await expense.aggregate([
        {
          $match: {
            userid: id,
          },
        },
        {
          $group: {
            _id: "$Category",
            TotalExpense: { $sum: "$Amount" },
          },
        },
      ]);
      res.status(201).send(category);
    } catch (error) {
      res.status(400).send(error);
    }
}

// /dailycategory
module.exports.dailycategory_post = async(req,res)=>{
  let userid = new mongoose.Types.ObjectId(req.body.userid);
  let data;
  try {
    data = await expense.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$Date" }, new Date().getMonth() + 1] },
              { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
            ],
          },
          userid: userid,
        },
      },
      {
        $group: {
          _id: "$Category" ,
          TotalExpense: { $sum: "$Amount" },
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
    console.log(error);
    res.status(400).send(error);
  } 

}

// /categoryinformation
module.exports.categoryinformation_post = async(req,res)=>{
  const category = req.body.category;
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  const month=req.body.month
  const year=req.body.year
  console.log(userid, category,month,year);
  if(category === 'All'){
    if(month !== 'All'){
      try {
        
        let data2 = await expense.aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $month: "$Date" }, month + 1] },
                  { $eq: [{ $year: "$Date" }, year] },
                ],
              },
              userid: userid,
           
            },
          },
          {
            $group: {
              _id:'$Category',
              TotalExpense: { $sum: "$Amount" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ]);
        console.log("xyz", data2);
        res.status(201).send({ pie: data2, table: data2 });
      } catch (error) {
        res.status(400).send(error);
      }
    }
    else{
      try {
        let data = await expense.aggregate([
          {
            $match: {
              $expr: {
                $eq: [{ $year: "$Date" }, year],
              },
              userid: userid,
          
            },
          },
          {
            $group: {
              _id:'$Category',
              TotalExpense: { $sum: "$Amount" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ]);
        console.log({ pie: data, table: data })
      
        res.status(201).send({ pie: data, table: data });
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
  else{
    if(month !== 'All'){
      try {
        
        let data2 = await expense.aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $month: "$Date" }, month + 1] },
                  { $eq: [{ $year: "$Date" }, year] },
                ],
              },
              userid: userid,
              Category: category,
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
        console.log("xyz", data2);
        res.status(201).send({ pie: data2, table: data2 });
      } catch (error) {
        res.status(400).send(error);
      }
    }
    else{
      try {
        let data = await expense.aggregate([
          {
            $match: {
              $expr: {
                $eq: [{ $year: "$Date" }, year],
              },
              userid: userid,
              Category: category,
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
        console.log({ pie: data, table: data })
      
        res.status(201).send({ pie: data, table: data });
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
 
}

// /expenseyear
module.exports.expenseyear_post = async(req,res)=>{
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  const year = req.body.year;
  const category = req.body.category;
  const month=req.body.month
  console.log(userid,year,category,month)
  let data;
  if(category === 'All'){
    try{
      if(month !== 'All'){
        data = await expense.aggregate([
          {
            $match:{
              $expr: {
                $and: [
                  { $eq: [{ $month: "$Date" }, month+1] },
                  { $eq: [{ $year: "$Date" }, year] },
                ],
              },
              userid:userid,
             
            }

          },
          
          {
            $group: {
              _id: "$Category",
              TotalExpense: { $sum: "$Amount" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ]);
      console.log("hi")

      }
      else{
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
              _id: "$Category",
              TotalExpense: { $sum: "$Amount" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ]);
      

      }
      console.log("all",data)
      res.status(201).send(data)
    }
    catch(error){
      res.status(400).send(error);
    }

  }
  else{
    try{

      if(month !== 'All'){
        data = await expense.aggregate([
          {
            $match:{
              $expr: {
                $and: [
                  { $eq: [{ $month: "$Date" }, month+1] },
                  { $eq: [{ $year: "$Date" }, year] },
                ],
              },
              userid:userid,
              Category:category
            }

          },
          
          {
            $group: {
              _id: "$Date" ,
              TotalExpense: { $sum: "$Amount" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ]);
      

      }
      else{
        data = await expense.aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $year: "$Date" }, year] },
                ],
              },
              userid: userid,
              Category:category
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
      

      }
 
      
      res.status(201).send(data)
      console.log("category data",data)
    }
    catch(error){
      res.status(400).send(error)
    }
  

  }

}


