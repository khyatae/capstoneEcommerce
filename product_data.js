const axios = require("axios");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

// Directory to save resized images
const IMAGE_DIR = path.join(__dirname, "images");
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR);
}

// Function to download and resize image, then save it locally
const downloadAndResizeImage = async (imageUrl, width, height, filename) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const resizedImagePath = path.join(IMAGE_DIR, filename);
    await sharp(response.data).resize(width, height).toFile(resizedImagePath);
    return resizedImagePath;
  } catch (error) {
    console.error("Error resizing image:", error.message);
    return null;
  }
};

// Function to gather product data from DummyJSON API
const gatherData = async () => {
  const NUM_PRODUCTS = 200;
  const IMAGE_WIDTH = 300;
  const IMAGE_HEIGHT = 300;

  try {
    // Fetch products from DummyJSON API
    const response = await axios.get(
      "https://dummyjson.com/products?limit=200"
    );
    let products = response.data.products;

    // Limit the products to NUM_PRODUCTS
    products = products.slice(100, NUM_PRODUCTS);

    // Process products to match the specified JSON format
    const data = await Promise.all(
      products.map(async (product, index) => {
        const imageFilename = `product_${index + 1}.jpg`; // Use index to match p_id
        const resizedImagePath = await downloadAndResizeImage(
          product.thumbnail, // Using the thumbnail for consistency
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          imageFilename
        );
        return {
          p_id: index + 1, // Use index + 1 to match p_id starting from 1
          p_name: product.title,
          p_cost: product.price,
          p_cat: product.category,
          p_desc: product.description,
          p_img: resizedImagePath ? resizedImagePath : null,
        };
      })
    );

    // Save the data to a JSON file
    fs.writeFile("capstone_data.json", JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("Data saved to capstone_data.json");
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

// Execute function to gather data
gatherData();
