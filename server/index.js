require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const authorize = require("./middleware/authorize");
const auth = require("./middleware/auth");
const s3 = require("./config/s3");
const Claim = require("./models/Claim");
const User = require("./models/User");
const LostItem = require("./models/LostItem");
const FoundItem = require("./models/FoundItem");


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
      role: "student", // default
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message });
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
      {
        id: user._id,
        registerNo: user.registerNo,
        role: user.role,   // 🔥 role included
      },
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
   LOST ITEMS (STUDENT)
======================== */

// Student posts lost item
app.post(
  "/lostitems",
  auth,
  authorize(["student"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "Image required" });
      }

      const fileName = `${uuidv4()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      const newItem = await LostItem.create({
        title: req.body.name,
        description: req.body.description,
        location: req.body.place,
        imageUrl,
        studentId: req.user.id,
      });

      res.json(newItem);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

app.post("/claims", auth, authorize(["student"]), async (req, res) => {
  try {
    const { foundItemId } = req.body;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(foundItemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    // 2️⃣ Check if item exists
    const foundItem = await FoundItem.findById(foundItemId);

    if (!foundItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 3️⃣ Check availability
    if (foundItem.status !== "available") {
      return res.status(400).json({ message: "Item is not available" });
    }

    // 4️⃣ Prevent duplicate claim
    const existing = await Claim.findOne({
      foundItemId,
      studentId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already claimed" });
    }

    // 5️⃣ Create claim
    const claim = await Claim.create({
      foundItemId,
      studentId: req.user.id,
    });

    res.status(201).json(claim);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Claim failed" });
  }
});

// Admin can view all lost items
app.get("/lostitems", auth, authorize(["admin"]), async (req, res) => {
  try {
    const items = await LostItem.find()
      .populate("studentId", "name registerNo")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lost items" });
  }
});

/* ========================
   FOUND ITEMS (ADMIN)
======================== */

// Admin posts found item
app.post(
  "/founditems",
  auth,
  authorize(["admin"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "Image required" });
      }

      const fileName = `${uuidv4()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      const newItem = await FoundItem.create({
  title: req.body.title,
  description: req.body.description,
  location: req.body.location,
  imageUrl,
  postedBy: req.user.id,
});

      res.json(newItem);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

app.patch("/claims/:id", auth, authorize(["admin"]), async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Claim already processed" });
    }

    const foundItem = await FoundItem.findById(claim.foundItemId);

    if (foundItem.status === "closed") {
      return res.status(400).json({ message: "Item already closed" });
    }

    claim.status = status;
    claim.adminNote = adminNote || "";
    claim.reviewedBy = req.user.id;
    claim.reviewedAt = new Date();

    await claim.save();

    if (status === "approved") {
      foundItem.status = "closed";
      await foundItem.save();

      // Reject other pending claims
      await Claim.updateMany(
        {
          foundItemId: claim.foundItemId,
          status: "pending",
          _id: { $ne: claim._id }
        },
        {
          status: "rejected",
          adminNote: "Another claim approved"
        }
      );
    }

    res.json(claim);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});
app.get("/claims/me", auth, authorize(["student"]), async (req, res) => {
  try {
    const claims = await Claim.find({ studentId: req.user.id })
      .populate("foundItemId")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch claims" });
  }
});
app.get("/claims/me", auth, authorize(["student"]), async (req, res) => {
  const claims = await Claim.find({ studentId: req.user.id })
    .populate("foundItemId");

  res.json(claims);
});
app.delete("/claims/:id", auth, authorize(["student"]), async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel processed claim" });
    }

    await claim.deleteOne();

    res.json({ message: "Claim cancelled" });

  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
});
// Students can view found items
app.get("/founditems", auth, async (req, res) => {
  try {
    const items = await FoundItem.find({ status: "available" })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch found items" });
  }
});
app.get("/claims", auth, authorize(["admin"]), async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("studentId")
      .populate("foundItemId");

    // Attach lost post count for each student
    const enhancedClaims = await Promise.all(
      claims.map(async (claim) => {
        const lostCount = await LostItem.countDocuments({
          studentId: claim.studentId._id,
        });

        return {
          ...claim.toObject(),
          lostCount,
        };
      })
    );

    res.json(enhancedClaims);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch claims" });
  }
});
app.get(
  "/admin/students/:id/lost-items",
  auth,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const studentId = req.params.id;

      const lostItems = await LostItem.find({ studentId })
        .sort({ createdAt: -1 });

      res.json(lostItems);

    } catch (err) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  }
);

// Student raises complaint
app.post("/complaints", auth, authorize(["student"]), async (req, res) => {
  try {
    const complaint = await Complaint.create({
      lostItemId: req.body.lostItemId,
      studentId: req.user.id,
      message: req.body.message,
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to create complaint" });
  }
});

// Admin views complaints
app.get("/complaints", auth, authorize(["admin"]), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("lostItemId")
      .populate("studentId");

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// Admin replies to complaint
app.patch(
  "/complaints/:id",
  auth,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        req.params.id,
        {
          adminReply: req.body.adminReply,
          status: "resolved",
        },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to reply" });
    }
  }
);


app.listen(3001, () => {
  console.log("Server running on port 3001");
});