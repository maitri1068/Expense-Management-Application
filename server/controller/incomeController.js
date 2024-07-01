const income=require('../models/income')
const user=require('../models/user')
const mongoose = require("mongoose")
// /income post create income
module.exports.income_post = async(req,res)=>{
    const data = req.body;
    try {
      const i = await income.create(data);
      res.status(201).send("income successfully inserted");
    } catch (error) {
      res.status(400).send(error);
    }
}

// /income patch update income
module.exports.income_patch = async(req,res)=>{
    const obj = req.body;
    income
      .findByIdAndUpdate(obj._id, req.body, { new: true })
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

// /deleteincome delete 
module.exports.deleteincome_delete = async(req,res)=>{
    const id = req.body.id;
   income
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

// /incomeupdate post
module.exports.incomeupdate_post=async(req,res)=>{
    const id = req.body.id;

    try {
      const incomes = await income.find({ _id: id });
      res.status(201).send(incomes);
    } catch (error) {
      res.status(400).send(error);
    }
}

// /searchincome post
module.exports.searchincome_post=async(req,res)=>{
    let data = req.body.value;
    let id = new mongoose.Types.ObjectId(data.userid);
    data = data.value;
  
    try {
      let e;
      if (data === "") {
        e = await income.aggregate([
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
          },
          {
            $limit:5
          }
        ]);
      } else {
        e = await income.aggregate([
          {
            $match: {
              $or: [
                { SourceOfIncome: { $regex: data, $options: "i" } },
                { Date: { $regex: data, $options: "i" } },
              ],
              userid: id,
            },
          },
          {
            $sort:{
              Date:-1
            }
          },
          {
            $limit:5
          }
        ]);
      }
  
      console.log(e);
      res.status(201).send(e);
    } catch (error) {
      res.status(400).send(error);
    }
}


// /incomepreview post income preview
module.exports.incomepreview_post = async(req,res)=>{
    const id=req.body.id
    console.log(id)
    try{
      const i=await income.findById(id)
      console.log("income: ",i)
      res.status(201).send(i)
  
    }
    catch(error){
      res.status(400).send(error)
    }
}

// /incomedetail post get all income detail
module.exports.incomedetail_post = async(req,res)=>{
    const userId = new mongoose.Types.ObjectId(req.body.userid);

  try {
    const expenses = await income.aggregate([
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

// /userincomee post get total income of user
module.exports.userincomee_post =async(req,res)=>{
    const userid = new mongoose.Types.ObjectId(req.body.userid);
    console.log("userid", userid);
    try {
      const i = await income.aggregate([
        {
          $match: {
            userid: userid,
          },
        },
        {
          $group: {
            _id: "$userid",
            TotalIncome: { $sum: "$Amount" },
          },
        },
      ]);
      console.log("userincome", i);
      res.status(201).send(i);
    } catch (error) {
      res.status(400).send(error);
    }
}

// /userincome
module.exports.userincome_post = async(req,res)=>{
  const data = req.body.value;
  const username = req.body.username;
  const label = req.body.label;
  try {
    let i;
    if (label === "income") {
      i = await user.findOneAndUpdate(
        { userName: username },
        { income: data },
        { upsert: true, new: true }
      );
    } else if (label === "budget") {
      i = await user.findOneAndUpdate(
        { userName: username },
        { budget: data },
        { upsert: true, new: true }
      );
    } else if (label === "expense") {
      i = await user.findOneAndUpdate(
        { userName: username },
        { expense: data },
        { upsert: true, new: true }
      );
    }

    // console.log(i);
    res.status(201).send(i);
  } catch (error) {
    res.status(400).send(error);
  }
}

// incomepreview and incomeupdate are same so delete one api