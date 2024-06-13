const express = require("express");
//create router instance
const router = express.Router();
//import productApi
const productApi = require("../apis/productapis");
//fetch all records
router.get("/fetch", productApi.showAllProducts);
router.get("/fetch/:id", productApi.showProduct);
router.post("/insertUser", productApi.createUser);
router.post("/login", productApi.login);
//update a record
router.post("/createProduct", productApi.createProduct);
router.post("/updateProduct", productApi.updateProduct);
router.post("/deleteProduct", productApi.deleteProduct);

router.post("/addToCart", productApi.addToCart);
//delete a record
router.put("/removeFromCart", productApi.reduceFromCart);
router.post("/buyProduct", productApi.buyNow);

//export router
module.exports = router;
