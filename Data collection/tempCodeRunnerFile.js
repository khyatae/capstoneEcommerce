const axios = require("axios");
const fs = require("fs");
const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/capstone"; // Replace with your MongoDB URI

const User = require("../models/User");

const getUsers = async (apiUrl, numUsers) => {
  try {
    const response = await axios.get(apiUrl);
    console.log("API response status:", response.status);
    console.log("API response data:", JSON.stringify(response.data, null, 4));

    const users = response.data.users;
    return users.slice(0, numUsers);
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error(
        "Error response from API:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received from API:", error.request);
    } else {
      // Something else caused the error
      console.error("Error in setting up the API request:", error.message);
    }
    return [];
  }
};

// Constants
const DUMMY_JSON_API_URL = "https://dummyjson.com/users";
const NUM_USERS = 15;

// Gather data
const main = async () => {
  const users = await getUsers(DUMMY_JSON_API_URL, NUM_USERS);

  if (users.length === 0) {
    console.error("No users found or error fetching users.");
    return;
  }

  // Process data to ensure consistent structure
  const processedUsers = users.map((user) => ({
    u_id: user.id,
    u_name: `${user.firstName} ${user.lastName}`,
    u_email: user.email,
    u_pwd: user.password,
    u_addr: `${user.address.address}, ${user.address.city}, ${user.address.state}`,
    u_contact: user.phone,
  }));

  // Print or save the processed data
  console.log(JSON.stringify(processedUsers, null, 4));

  // Save the processed data to a JSON file
  fs.writeFile("users.json", JSON.stringify(processedUsers, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data successfully written to users.json");
    }
  });

  try {
    await User.insertMany(processedUsers);
    console.log("Users successfully inserted into MongoDB");
  } catch (err) {
    console.error("Error inserting users into MongoDB:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the main function
main();
