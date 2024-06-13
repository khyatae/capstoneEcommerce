const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const createUser = async (req, res) => {
  try {
    const obj = req.body;
    console.log(obj);
    const existingUser = await User.findOne(obj);
    if (existingUser) {
      res.status(400).send("USER already exists" + existingUser);
    }
    const newUser = User.create(obj);
    const data = (await newUser).save();
    console.log("user inserted");
    res.send("user inserted");
  } catch (e) {
    console.log(e);
  }
};

const login = async (req, res) => {
  console.log(req.body);
  let { u_name, u_pwd } = req.body;

  const user = await User.findOne({ u_name, u_pwd });
  console.log(user);
  if (user) {
    console.log(user);
    res.send("login success" + user);
  } else {
    console.log("error");
    res.send("login unsuccessful");
  }
};

const showAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.send(products);
};

const addToCart = async (req, res) => {
  const { u_id, p_id } = req.body;
  try {
    let cart = await Cart.findOne({ u_id });
    if (!cart) {
      cart = new Cart({ u_id, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product_id.toString() == p_id
    );

    if (productIndex != -1) {
      console.log("count increased");
      cart.products[productIndex].count += 1;
    } else {
      cart.products.push({ product_id: p_id, count: 1 });
    }
    await cart.save();
    res.send("Product added to cart successfully");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

const createProduct = async (req, res) => {
  try {
    const obj = req.body;
    console.log(obj);
    const existingProduct = await Product.findOne(obj);
    if (existingProduct) {
      console.log("product already exists");
      res.status(400).send("Product already exists" + existingUser);
    }
    const newProduct = Product.create(obj);
    const data = (await newProduct).save();
    console.log("product inserted");
    res.send("product inserted");
  } catch (e) {
    console.log(e);
  }
};

const reduceFromCart = async (req, res) => {
  const { u_id, p_id } = req.body;
  try {
    let cart = await Cart.findOne({ u_id });
    if (!cart) {
      res.send("no products in cart");
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product_id.toString() === p_id
    );

    if (productIndex != -1) {
      console.log("count decreased");
      cart.products[productIndex].count -= 1;
      if (cart.products[productIndex].count == 0) {
        cart.products.splice(productIndex, 1);
      }
      res.send("Product removed from cart successfully");
    } else {
      res.send("product not found");
    }
    await cart.save();
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

const buyNow = async (req, res) => {
  const { u_id } = req.body;
  try {
    const cart = await Cart.findOne({ u_id }).populate("products.product_id");
    if (!cart || cart.products.length === 0) {
      return res.send("cart is empty");
    }
    const total_cost = cart.products.reduce((total, product) => {
      return total + product.product_id.p_cost * product.count;
    }, 0);

    cart.products = [];
    await cart.save();
    console.log("Order placed successfully");
    res.send("order placed successfully. Total cost is " + total_cost);
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
};

module.exports = {
  createUser,
  login,
  showAllProducts,
  addToCart,
  reduceFromCart,
  buyNow,
  createProduct,
};
