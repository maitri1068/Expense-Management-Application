var mongoose = require("mongoose");

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

var income = mongoose.model("incomeinfo", incomeschema);

module.exports=income