const budget=require('../models/budget')
const mongoose = require("mongoose")

// /budget post create budget
module.exports.budget_post = async (req,res)=>{
    const data=req.body.data
try{
  const j=await budget.find({userid:data.userid,Category:data.Category})
 
  if(j.length === 0){
    const i=await budget.create(data)
    res.status(201).send(i)
  
  }
  else{
    // console.log(j[0]._id)
    budget.findByIdAndUpdate(j[0]._id,data, { new: true })
    .then((s) => {
      if (!s) {
        
        return res.status(404).send("not found");
      }
      res.status(201).send(s)
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  }


}
catch(error){
  res.status(400).send(error)
}
}

// /getbudgetinfo post 
module.exports.budgetinfo_post = async (req,res)=>{
    const id=req.body.userid;
    try{
      const i=await budget.find({userid:id})
      res.status(201).send(i)
      console.log("budgetttt",i)
    }
    catch(error){
      res.status(400).send(error)
    }
}

// /getcategorybudget post total expense in particular category
module.exports.getcategorybudget_post = async (req,res)=>{
    const id=new mongoose.Types.ObjectId(req.body.userid)
    const category=req.body.category
    try{
  
      const i=await expense.aggregate([
        {
          $match:{
            userid:id,
            Category:category
          }
        }
        ,
        {
          $group:{
            _id:'$Category',
            TotalExpense:{$sum:'$Amount'}
          }
        }
      ])
      console.log("budget",i)
      res.status(201).send(i)
     
    }
    catch(error){
      res.status(400).send(error)
    }
}

// /userbudget

module.exports.userbudget_post = async(req,res)=>{
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  console.log("userid", userid);
  try {
    const b = await budget.aggregate([
      {
        $group: {
          _id: '$userid',
          TotalBudget: { $sum: "$Amount" },
        }
      },
    
    ]);

    console.log("budget", b);

    res.status(201).send(b);
  } catch (error) {
    res.status(400).send(error);
  }
}