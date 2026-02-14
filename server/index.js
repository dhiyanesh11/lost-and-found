require("dotenv").config({ path: __dirname + "/.env" });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Registration = require("./models/registrations");
const auth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/lostandfound")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ========================
   AUTH ROUTES
======================== */

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, registerNo, password } = req.body;
    

    const existingUser = await User.findOne({ registerNo });
    if (existingUser) {
      return res.status(400).json({ message: "Register number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      registerNo,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json(err);
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { registerNo, password } = req.body;

    const user = await User.findOne({ registerNo });
    console.log("USER FOUND:", user);
    console.log("JWT SECRET:", process.env.JWT_SECRET);


    if (!user) {
      return res.status(400).json({ message: "Invalid register number" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, registerNo: user.registerNo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



/* ========================
   LOST ITEMS ROUTES
======================== */

// PROTECTED POST
app.post("/lostitems", auth, async (req, res) => {
  try {
    const item = await Registration.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL
app.get("/getlostitems", async (req, res) => {
  try {
    const items = await Registration.find();
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
