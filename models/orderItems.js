var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: "orders" },
    item:{ type: Schema.Types.ObjectId, ref: "items" },
    quantity:{type:Number,required:true}
});

module.exports = mongoose.model("orderItems", schema);