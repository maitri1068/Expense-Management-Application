require("dotenv").config()

const user=require('../models/user')
const jwt=require('jsonwebtoken')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const createToken = (userinfo) => {
    return jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET)
}

const mongoose = require("mongoose")

// /login post
module.exports.login_post =async(req,res)=>{
    const obj = req.body;

    const userinfo = {
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
        const accesstoken = createToken(userinfo);
        res.status(201).send(accesstoken);
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
}


// /user post
module.exports.register_post = async(req,res)=>{
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
}

// /finduser post
module.exports.finduser_post = async(req,res)=>{
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
}


// /updateprofile patch
module.exports.updateprofile_patch = async(req,res)=>{
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
  
  
}


// /loginn post
module.exports.loginn_post = async(req,res)=>{
    const val = req.body;
    // console.log(val)
  
    try {
      const data = await user.find({ userName: val.userName });
      // console.log("data",data)
      res.status(201).send(data);
    } catch (error) {
      res.send(error);
    }
}

// /verifyemail
module.exports.verifyemail_post =async(req,res)=>{
  const { email } = req.body;
  try {
    sendvarifyemail(email, res);
  } catch (error) {
    res.status(400).send(error);
  }
}

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


// /passwordreset 
module.exports.passwordreset_post = async (req,res)=>{
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
}

const sendresetemail = ({ _id, email }, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
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
    res.status(201).send({ id: _id, otp: otp });
  } catch (error) {
    res.status(400).send(error);
  }
};

// /updatepassword
module.exports.updatepassword_patch = async (req,res)=>{
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
}

//transporter for sending email

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});