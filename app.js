require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require('node-cron')
const { user, expense, income, token, passwordreset } = require("./mongo");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");
const { isNumber } = require("@mui/x-data-grid/internals");

// user registration

app.post("/finduser",  authenticatetoken,async (req, res) => {
  const obj = req.body;
  console.log(obj);
  try {
    const i = await user.aggregate([
      {
        $match: {
          $or: [{ userName: obj.userName }, { email: obj.email }],
        },
      },
    ]);
    // const i = await user.find({ userName: obj.userName, email: obj.email });
    console.log("i", i);
    if (i.length === 0) res.status(201).send("valid user");
    else {
      console.log(i[0].userName);
      if (obj.userName === i[0].userName) {
        res.send("user already exist with this username");
      } else if (obj.email === i[0].email) {
        res.send("user already have account with this email");
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/user",  authenticatetoken,async (req, res) => {
  const obj = req.body;
  console.log(obj);
  try {
    const hashPassword = await bcrypt.hash(obj.password, 5);
    const i = await user.create({ ...obj, password: hashPassword });
    console.log("i", i);
    res.status(201).send(i);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.userName) {
      res.send("user already have account");
    } else if (error.code === 11000 && error.keyPattern.email) {
      res.send("user already have account with this email");
    } else {
      res.send("Error saving user:", error);
    }
  }
});

// user login

app.post("/login", async (req, res) => {
  const obj = req.body;

  const stud = {
    name: obj.userName,
    password: obj.password,
  };

  try {
    const data = await user.find({ userName: obj.userName });

    if (data.length === 0) {
      res.send("you don't have account please signup first");
    } else {
      const passwordMatch = await bcrypt.compare(
        obj.password,
        data[0].password
      );
      if (!passwordMatch) {
        res.send("password incorrect");
      } else {
        const accesstoken = jwt.sign(stud, process.env.ACCESS_TOKEN_SECRET);
        res.status(201).send(accesstoken);
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

//update userprofile

app.patch('/updateprofile', authenticatetoken,async(req,res)=>{
  const obj = req.body.data;
 
  delete obj.confpassword;

  try{
    const i=await user.findById(obj._id)
    const hashPassword= await bcrypt.compare(
      obj.password,
     i.password
    )
    console.log(hashPassword,i.password === obj.password,obj.password,i.password,i)
    if(i && i.password === obj.password){
      user.findByIdAndUpdate(obj._id, obj, { new: true })
        .then((user) => {
          if (!user) {
            console.log("not found")
           
            return res.status(404).send("not found");
          }
         res.status(201).send(user);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
    else if(i && hashPassword){
      const hashNewPassword = await bcrypt.hash(obj.newpassword, 5);
      user.findByIdAndUpdate(obj._id, {...obj,password:hashNewPassword}, { new: true })
      .then((user) => {
        if (!user) {
          console.log("not found")
          return res.status(404).send("not found");
        }
       res.status(201).send(user);
      })
      .catch((err) => {
      res.status(400).send(err);
      });
    }
  }
  catch(error){
    res.status(400).send(error)
  }


})

//get expense preview
app.post('/expensepreview', authenticatetoken,async(req,res)=>{
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
})


//get expense preview
app.post('/incomepreview', authenticatetoken,async(req,res)=>{
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
})

// get login user info

app.post("/loginn", async (req, res) => {
  const val = req.body;
  // console.log(val)

  try {
    const data = await user.find({ userName: val.userName });
    // console.log("data",data)
    res.status(201).send(data);
  } catch (error) {
    res.send(error);
  }
});

// create expense

app.post("/expense", authenticatetoken, async (req, res) => {
  const data = req.body;
  console.log("data", data);
  try {
    const i = await expense.create(data);
    console.log("i", i);
    res.status(201).send("expense successfully inserted");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/income", authenticatetoken, async (req, res) => {
  const data = req.body;
  console.log("data", data);
  try {
    const i = await income.create(data);
    console.log("i", i);
    res.status(201).send("income successfully inserted");
  } catch (error) {
    res.status(400).send(error);
  }
});

// update expense
app.patch("/expense",  authenticatetoken,async (req, res) => {
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
});

app.patch("/income",  authenticatetoken,async (req, res) => {
  const obj = req.body;
  // console.log("u id",obj._id)
  income
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
});

// delete expense
app.delete("/deleteexpense",  authenticatetoken,async (req, res) => {
  const id = req.body.id;
  //  console.log("delete id ",id)

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
});

app.delete("/deleteincome",  authenticatetoken,async (req, res) => {
  const id = req.body.id;
  //  console.log("delete id ",id)
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
});
// get particular expense details
app.post("/expenseupdate",  authenticatetoken,async (req, res) => {
  const id = req.body.id;

  try {
    const expenses = await expense.find({ _id: id });
    res.status(201).send(expenses);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/incomeupdate",  authenticatetoken,async (req, res) => {
  const id = req.body.id;

  try {
    const incomes = await income.find({ _id: id });
    res.status(201).send(incomes);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all expense details
app.post("/expensedetail", authenticatetoken, async (req, res) => {
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
    // console.log("expenses",expenses)
    res.status(201).send(expenses);
   
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all income details
app.post("/incomedetail", authenticatetoken, async (req, res) => {
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
});

// search functionality
app.post("/searchexpense",  authenticatetoken,async (req, res) => {
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
    
      
    

    console.log("search",e);
    res.status(201).send(e);
  } catch (error) {
    res.status(400).send(error);
  }
});



app.post("/searchincome",  authenticatetoken,async (req, res) => {
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
});

// get expense data between startdate and enddate
app.post("/expensereport",  authenticatetoken,async (req, res) => {
  let startdate = req.body.startdate;
  let enddate = req.body.enddate;

  try {
    let i = await expense.aggregate([
      {
        $match: {
          Date: {
            $lte: new Date(enddate),
            $gte: new Date(startdate),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
          TotalExpense: { $sum: "$Amount" },
        },
      },
      {
        $sort:{
          _id:1
        }
      }
    ]);
    // console.log(i)
    res.status(201).send(i);
  } catch (error) {
    res.status(400).send(error);
  }
});

// get income data between startdate and enddate
app.post("/incomereport",  authenticatetoken,async (req, res) => {
  let startdate = req.body.startdate;
  let enddate = req.body.enddate;

  try {
    let i = await income.aggregate([
      {
        $match: {
          Date: {
            $lte: new Date(enddate),
            $gte: new Date(startdate),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
          TotalIncome: { $sum: "$Amount" },
        },
      },
      {
        $sort:{
          _id:1
        }
      }
    ]);
    // console.log(i)
    res.status(201).send(i);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get latest expense and income

app.post("/latestuserinfo",  authenticatetoken,async (req, res) => {
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
});

//get category list
app.post("/categorylist",  authenticatetoken,async (req, res) => {
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
    // console.log("category", category);
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
});

// get income of current month

app.post("/currentmonthincome",  authenticatetoken,async (req, res) => {
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
});

//get daily category info

app.post("/dailycategory",  authenticatetoken,async (req, res) => {
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
// console.log("category cccc", data);
    res.status(201).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  } 

});

//get categorization data according to category month

app.post("/categorymonth",  authenticatetoken,async (req, res) => {
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  const month = req.body.month;
  const year = req.body.year;
  console.log(month, year);
  try {
    const i = await expense.aggregate([
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
    console.log("categorymonth", i);
    res.status(201).send(i);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get categorization  data according to category year

app.post("/categoryyear",  authenticatetoken,async (req, res) => {
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  const year = req.body.year;

  try {
    const i = await expense.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: [{ $year: "$Date" }, year] }],
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
    console.log("categoryyear", i);
    res.status(201).send(i);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get data acoording to category and month

app.post("/expensemonth",  authenticatetoken,async (req, res) => {
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  const month = req.body.month;
  const year = req.body.year;
  const category = req.body.category;
  console.log(month, year, category);
  try {
    const i = await expense.aggregate([
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
    console.log("expense month", i);
    res.status(201).send(i);
  } catch (error) {
    res.status(400).send(error);
  }
});



//get data according to category and year
app.post("/expenseyear",  authenticatetoken,async (req, res) => {

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

});

// app.post("/categoryinfo", async (req, res) => {
//   let period = req.body.period;
//   let userid = new mongoose.Types.ObjectId(req.body.userid);
//   let category = req.body.category;
//   console.log(category);
//   let data;
//   try {
//     if (period === "Daily") {
//       data = await expense.aggregate([
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 { $eq: [{ $month: "$Date" }, new Date().getMonth() + 1] },
//                 { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
//               ],
//             },
//             userid: userid,
//             Category: category,
//           },
//         },
//         {
//           $group: {
//             _id: { $dayOfMonth: "$Date" },
//             TotalExpense: { $sum: "$Amount" },
//           },
//         },
//         {
//           $sort: {
//             _id: 1,
//           },
//         },
//       ]);
//     } else if (period === "Monthly") {
//       data = await expense.aggregate([
//         {
//           $match: {
//             $expr: {
//               $eq: [{ $year: "$Date" }, new Date().getFullYear()],
//             },
//             userid: userid,
//             Category: category,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               month: { $month: "$Date" },
//             },
//             TotalExpense: { $sum: "$Amount" },
//           },
//         },
//         {
//           $sort: {
//             _id: 1,
//           },
//         },
//       ]);
//     } else if (period === "Yearly") {
//       data = await expense.aggregate([
//         {
//           $match: {
//             userid: userid,
//             Category: category,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               // Category: "$Category",
//               year: { $year: "$Date" },
//             },
//             TotalExpense: { $sum: "$Amount" },
//           },
//         },
//         {
//           $sort: {
//             _id: 1,
//           },
//         },
//       ]);
//     }
//     console.log("category info", data);
//     res.status(201).send(data);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });

//get particular category info

app.post("/categoryinformation",  authenticatetoken,async (req, res) => {
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
 
 
});

//get expense and income of particulay date

app.post('/dayinfo', authenticatetoken,async(req,res)=>{
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
})

//get data according to income period
app.post("/incomeperiod",  authenticatetoken,async (req, res) => {
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
        // {
        //   $group: {
        //     _id: { $year: "$Date" },
        //     TotalExpense: { $sum: "$Amount" },
        //   },
        // },
        // {
        //   $sort: {
        //     _id: 1,
        //   },
        // },
      ]);
    }
    console.log("period", data);
    res.status(201).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// get data according to expense period
app.post("/expenseperiod",  authenticatetoken,async (req, res) => {
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
});

app.post("/userincome",  authenticatetoken,async (req, res) => {
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
});

app.post("/userincomee",  authenticatetoken,async (req, res) => {
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
});

app.post("/userbudget",  authenticatetoken,async (req, res) => {
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  console.log("userid", userid);
  try {
    const budget = await user.aggregate([
      {
        $match: {
          _id: userid,
        },
      },
      {
        $project: {
          budget: 1,
        },
      },
    ]);

    console.log("budget", budget);

    res.status(201).send(budget);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/userexpense",  authenticatetoken,async (req, res) => {
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
});

function authenticatetoken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  console.log("t", authHeader);
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    console.log("verified");
    next();
  });
}

// transporter for sending email

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// for verify email

app.post("/varifymail", async (req, res) => {
  const { email } = req.body;
  try {
    sendvarifyemail(email, res);
  } catch (error) {
    res.status(400).send(error);
  }
});

const sendvarifyemail = (email, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    transporter
      .sendMail({
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "ExpenseForge Verify your mail",
        html: `<p>Here is your otp ${otp} for verify email </p>`,
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    res.status(201).send({ otp: otp });
  } catch (error) {
    res.status(400).send(error);
  }
};

// forgot password

app.post("/passwordreset", async (req, res) => {
  const { email } = req.body;
  try {
    const i = await user.find({ email: email });
    if (i.length) {
      sendresetemail(i[0], res);
    } else {
      res.send("user doesn't exist");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

const sendresetemail = ({ _id, email }, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    passwordreset.deleteMany({ userid: _id }).then((result) => {
      const newpasswordreset = new passwordreset({
        userid: _id,
        resetstring: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      });
      newpasswordreset.save();
      transporter
        .sendMail({
          from: process.env.SMTP_MAIL,
          to: email,
          subject: "ExpenseForge Reset your password",
          html: `<p>Here is your otp ${otp} for reset password </p>`,
        })
        .then((info) => {
          console.log("Message sent: %s", info.messageId);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    });
    res.status(201).send({ id: _id, otp: otp });
  } catch (error) {
    res.status(400).send(error);
  }
};

//update password
app.patch("/updatepassword", async (req, res) => {
  const obj = req.body;
  const hashPassword = await bcrypt.hash(obj.password, 5);
  console.log({ ...obj, password: hashPassword });
  user
    .findByIdAndUpdate(
      obj.id,
      { ...obj, password: hashPassword },
      { new: true }
    )
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
});

//generate monthly report

// app.post('/generatereport',async (req,res)=>{
//   try {

//         let i=await user.find();
//         i=i.map((obj)=>({id:obj._id,email:obj.email}))
        
//         i.forEach(async(value)=>{
    
//           let expenses = await expense.aggregate([
//             {
//               $match:{
//                 $expr:{
//                   $and: [
//                     { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
//                     { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
//                   ],
               
//                 },
//                 userid:value.id
                  
//                },
                
      
//               },
        
//             {
//               $sort:{
//                 Date:-1
//               }
//             },
           
//           ]);
    
//           console.log(expenses)
//           expenses=expenses.map((obj)=>({Category:obj.Category,Description:obj.Description,Date:obj.Date,Amount:obj.Amount,Merchant:obj.Merchant,PaidBy:obj.PaidBy,PaymentMode:obj.PaymentMode}))
        
//           console.log("ex",expenses)
    
//           let incomes = await income.aggregate([
//             {
//               $match:{
//                 $expr:{
//                   $and: [
//                     { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
//                     { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
//                   ],
               
//                 },
//                 userid:value.id
                  
//                },
                
      
//               },
        
//             {
//               $sort:{
//                 Date:-1
//               }
//             },
          
           
//           ]);
    
//           incomes=incomes.map((obj)=>({Source:obj.SourceOfIncome,Date:obj.Date,Amount:obj.Amount}))
          
//           console.log("in",incomes)
    
//           let TotalExpense;
//           expenses.forEach((obj)=>{
//             TotalExpense=TotalExpense+obj.Amount
//           })
    
//           let TotalIncome;
//           incomes.forEach((obj)=>{
//             TotalIncome=TotalIncome+obj.Amount
//           })


//           let categorization = await expense.aggregate([
//             {
//               $match:{
//                 $expr:{
//                   $and: [
//                     { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
//                     { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
//                   ],
               
//                 },
//                 userid:value.id
                  
//                },
                
      
//             },
//             {
//               $group:{
//                 _id:'$Category',
//                 TotalExpense:{$sum:'$Amount'}
//               }
//             },
        
//             {
//               $sort:{
//                TotalExpense:1
//               }
//             },
          
           
//           ]);


//           console.log("categorization",categorization)
        
       
//         })
//         // res.status(201).send({expense:expenses,income:incomes,TotalExpense:TotalExpense,TotalIncome:TotalIncome,Categorization:categorization})
       
    
//       } catch (error) {
//       res.status(400).send(error)
//       }
// })

// cron.schedule("* * 10 * * *",async function() { 
//   console.log("hello")
//   try {

//     let i=await user.find();
//     i=i.map((obj)=>({id:obj._id,email:obj.email}))
    
//     i.forEach(async(value)=>{

//       let expenses = await expense.aggregate([
//         {
//           $match:{
//             $expr:{
//               $and: [
//                 { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
//                 { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
//               ],
           
//             },
//             userid:value.id
              
//            },
            
  
//           },
    
//         {
//           $sort:{
//             Date:-1
//           }
//         },
       
//       ]);

//       console.log(expenses)
//       expenses=expenses.map((obj)=>({Category:obj.Category,Description:obj.Description,Date:obj.Date,Amount:obj.Amount,Merchant:obj.Merchant,PaidBy:obj.PaidBy,PaymentMode:obj.PaymentMode}))
//       console.log("ex",expenses)

//       let incomes = await income.aggregate([
//         {
//           $match:{
//             $expr:{
//               $and: [
//                 { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
//                 { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
//               ],
           
//             },
//             userid:value.id
              
//            },
            
  
//           },
    
//         {
//           $sort:{
//             Date:-1
//           }
//         },
      
       
//       ]);

//       incomes=incomes.map((obj)=>({Source:obj.SourceOfIncome,Date:obj.Date,Amount:obj.Amount}))
//       console.log("in",incomes)

//       let TotalExpense;
//       expenses.forEach((obj)=>{
//         TotalExpense=TotalExpense+obj.Amount
//       })

//       let TotalIncome;
//       incomes.forEach((obj)=>{
//         TotalIncome=TotalIncome+obj.Amount
//       })
//       let categorization = await expense.aggregate([
//         {
//           $match:{
//             $expr:{
//               $and: [
//                 { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
//                 { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
//               ],
           
//             },
//             userid:value.id
              
//            },
            
  
//         },
//         {
//           $group:{
//             _id:'$Category',
//             TotalExpense:{$sum:'$Amount'}
//           }
//         },
    
//         {
//           $sort:{
//            TotalExpense:1
//           }
//         },
      
       
//       ]);
//       console.log("categorization",categorization)
//       const msg=`
//       <table >
//        <tr>
//         <th>Category</th>
//         <th>Description</th>
//         <th>Date</th>
//         <th>Amount</th>
//         <th>Merchant</th>
//         <th>PaidBy</th>
//         <th>PaymentMode</th>
//        </tr>`+
//        expenses.map((obj)=>{
//          return (`
//         <tr>
//         <td>${obj.Category}</td>
//         <td>${obj.Description}</td>
//         <td>${obj.Date}</td>
//         <td>${obj.Amount}</td>
//         <td>${obj.Merchant}</td>
//         <td>${obj.PaidBy}</td>
//         <td>${obj.PaymentMode}</td>
//         </tr>
//          `)
//        }
       
//        )+`
//       </table>

//       <table >
//        <tr>
//         <th>Source Of Income</th>
//         <th>Date</th>
//         <th>Amount</th>
//        </tr>`+
//        incomes.map((obj)=>{
//          return (`
//         <tr>
//         <td>${obj.Source}</td>
//         <td>${obj.Date}</td>
//         <td>${obj.Amount}</td>
      
//         </tr>
//          `)
//        }
       
//        )+`
//       </table>
//       `
//       transporter.sendMail({
//         from: process.env.SMTP_MAIL,
//         to:value.email ,
//         subject: "ExpenseForge Verify your mail",
//         html: msg,
//       })
//       .then((info) => {
//         console.log("Message sent: %s", info.messageId);
//       })
//       .catch((error) => {
//         console.error("Error sending message:", error);
//       });
//     })
   

//   } catch (error) {
//    console.log(error)
//   }
// }); 


app.listen(1010);


