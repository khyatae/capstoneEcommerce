const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  u_id: Number,
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      count: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
