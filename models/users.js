var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, required: true}
  });
  
  schema.statics.hashPassword = function hashedPassword(password) {
    return bcrypt.hashSync(password, 10);
  };
  
  schema.methods.isValid = function (hashedPassword) {
    return bcrypt.compareSync(hashedPassword, this.password);
  };
  
  module.exports = mongoose.model("Users", schema);