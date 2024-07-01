var mongoose = require("mongoose");

var budgetschema = new mongoose.Schema({
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userinfos",
    },
    Category: {
      type: String,
    },
    Amount: {
      type: Number,
    },
  });

  var budget=mongoose.model('budgetinfo',budgetschema)

  module.exports=budget