const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Registration = require("./models/registrations");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// POST lost item
app.post("/lostitems", (req, res) => {
  Registration.create(req.body)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

// GET lost items
app.get("/getlostitems", async (req, res) => {
  try {
    const items = await Registration.find();
    res.status(200).json(items); // will be [] if no data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
