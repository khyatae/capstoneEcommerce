const express = require("express");
//create router instance
const router = express.Router();
//import productApi
const productApi = require("../apis/productapis");
//fetch all records
router.get("/fetch", productApi.showAllProducts);
router.post("/insertUser", productApi.createUser);
router.post("/login", productApi.login);
//update a record
router.post("/insertProduct", productApi.addToCart);
//delete a record
router.put("/deleteProduct", productApi.reduceFromCart);
router.post("/buyProduct", productApi.buyNow);

//export router
module.exports = router;
