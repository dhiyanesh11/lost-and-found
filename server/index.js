require("dotenv").config();   // MUST be at the top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Registration = require("./models/registrations");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/lostandfound")
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// routes
app.post("/lostitems", async (req, res) => {
  try {
    const item = await Registration.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/getlostitems", async (req, res) => {
  try {
    const items = await Registration.find();
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
