const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  p_id: Number,
  p_name: String,
  p_cost: Number,
  p_cat: String,
  p_desc: String,
  p_img: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
