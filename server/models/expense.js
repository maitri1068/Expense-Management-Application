var mongoose = require("mongoose");

var expenseschema = new mongoose.Schema({
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userinfos",
    },
    Category: {
      type: String,
    },
    SubCategory: {
      type: String,
    },
    Description: {
      type: String,
    },
    Date: {
      type: Date,
    },
    Amount: {
      type: Number,
    },
    Currancy: {
      type: String,
    },
    Merchant: {
      type: String,
    },
    PaidBy: {
      type: String,
    },
    PaymentMode: {
      type: String,
    },
    transaction: {
      type: String,
    },
  });

  var expense = mongoose.model("expenseinfo", expenseschema);

  module.exports=expense
  