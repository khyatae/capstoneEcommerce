const axios = require("axios");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const MONGO_URI = require("../url"); // Replace with your actual MongoDB URI

const Product = require("../models/Product");

// Directory to save resized images
const IMAGE_DIR = path.join(__dirname, "images");
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR);
}

// Function to gather product data from DummyJSON API
const gatherData = async () => {
  const NUM_PRODUCTS = 200;

  try {
    // Fetch products from DummyJSON API
    const response = await axios.get(
      "https://dummyjson.com/products?limit=200"
    );
    let products = response.data.products;

    // Limit the products to NUM_PRODUCTS
    products = products.slice(100, NUM_PRODUCTS);

    // Process products to match the specified JSON format
    const data = products.map((product, index) => {
      const imageFilename = `https://github.com/khyatae/capstoneEcommerce/blob/master/Data%20collection/images/product_${
        index + 1
      }.jpg`; // Use index to match p_id

      return {
        p_id: index + 1, // Use index + 1 to match p_id starting from 1
        p_name: product.title,
        p_cost: product.price,
        p_cat: product.category,
        p_desc: product.description,
        p_img: imageFilename,
      };
    });

    // Save the data to a JSON file
    fs.writeFile(
      "./Data collection/product_data.json",
      JSON.stringify(data, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("Data saved to product_data.json");
        }
      }
    );

    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

const main = async () => {
  const data = await gatherData();
  console.log(data);
  try {
    if (data.length > 0) {
      await Product.insertMany(data);
      console.log("products inserted");
    } else {
      console.log("No data to insert");
    }
  } catch (e) {
    console.log("error in inserting", e);
  } finally {
    mongoose.connection.close();
  }
};

main();
