var mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/temp")
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

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
var tokenschema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userinfos",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});
var expenseschema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfos",
  },
  Category: {
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
});

var incomeschema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfos",
  },
  SourceOfIncome: {
    type: String,
  },
  Date: {
    type: Date,
  },
  Amount: {
    type: Number,
  },
});

var passwordresetschema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfos",
  },
  resetstring: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

var user = mongoose.model("userinfo", userschema);
var expense = mongoose.model("expenseinfo", expenseschema);
var income = mongoose.model("incomeinfo", incomeschema);
var token = mongoose.model("tokeninfo", tokenschema);
var passwordreset = mongoose.model("passwordreset", passwordresetschema);

module.exports = {
  user: user,
  expense: expense,
  income: income,
  token: token,
  passwordreset: passwordreset,
};
