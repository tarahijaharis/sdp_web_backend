var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    date: { type: Date, default: Date.now },
    deliver_due_date: { type: Date, default: Date.now },
    payment_due_date: { type: Date, default: Date.now },
    message:{type:String}
});

module.exports = mongoose.model("orders", schema);