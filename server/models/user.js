var mongoose = require("mongoose");

var userschema = new mongoose.Schema({
    userName: { type: String, unique: true },
    email: {
      type: String,
      unique: true,
    },
    mobileNum: {
      type: Number,
    },
    password: {
      type: String,
    },
    income: {
      type: Number,
    },
    budget: {
      type: Number,
    },
    Expense: {
      type: Number,
    },
    Currancy: {
      type: String,
    },
  });

  var user = mongoose.model("userinfo", userschema);

  module.exports=user