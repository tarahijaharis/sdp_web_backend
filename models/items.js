var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    name: { type: String, required: true },
    count: {type: Number, required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true}
  });

module.exports = mongoose.model("items", schema);