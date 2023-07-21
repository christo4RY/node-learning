require("dotenv").config();
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/index");
const connectDB = require("./config/conDB");
const mongoose = require("mongoose");
connectDB();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);
mongoose.connection.once("open", () => {
  console.log("connected!");
  app.listen(PORT, () => {
    console.log(`server is running at port: localhost:${PORT}`);
  });
});
