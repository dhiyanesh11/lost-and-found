const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lostItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LostItem",
  },
  foundItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoundItem",
  },
  similarity: Number,
  message: String,
  read: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);