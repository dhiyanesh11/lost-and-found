require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const s3 = require("./config/s3");
const User = require("./models/User");
const Registration = require("./models/registrations");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

/* ========================
   MULTER CONFIG
======================== */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ========================
   MONGODB CONNECTION
======================== */
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

    const newUser = await User.create({
      name,
      registerNo,
      password: hashedPassword,
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { registerNo, password } = req.body;

    const user = await User.findOne({ registerNo });
    if (!user) {
      return res.status(400).json({ message: "Invalid register number" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

/* ========================
   LOST ITEMS ROUTES
======================== */

// PROTECTED POST WITH IMAGE UPLOAD
app.post("/lostitems", auth, upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image required" });
    }

    const fileName = `${uuidv4()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const newItem = await Registration.create({
  name: req.body.name,
  place: req.body.place,
  description: req.body.description,
  date: req.body.date,
  yourname: req.body.yourname,
  contact: req.body.contact,
  message: req.body.message,
  imageUrl: imageUrl,
  userId: req.user.id,
});
    res.json(newItem);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET ALL LOST ITEMS
app.get("/getlostitems", async (req, res) => {
  try {
    const items = await Registration.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

/* ========================
   SERVER
======================== */
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
