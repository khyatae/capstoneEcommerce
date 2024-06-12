const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const Routes = require("./Routes/routes");

const mongoose = require("mongoose");
let url = require("./url");

let app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

mongoose.connect(url, { dbName: "capstone" }).then(
  () => {
    console.log("Connection success");
  },
  (err) => {
    console.log("connection failed" + err);
  }
);

app.use("/", Routes);

let port = 8080;
app.listen(port, () => {
  console.log("Server listening port no:- ", port);
});
