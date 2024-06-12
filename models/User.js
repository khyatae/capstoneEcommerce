const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  u_id: Number,
  u_name: String,
  u_email: String,
  u_pwd: String,
  u_addr: String,
  u_contact: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
