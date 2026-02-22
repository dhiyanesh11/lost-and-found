const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "closed"],
      default: "available",
    },
    status: {
      type: String,
      enum: ["available", "closed"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);