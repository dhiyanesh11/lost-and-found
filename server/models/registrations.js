const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    yourname: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },

    // 🔥 NEW FIELD FOR S3 IMAGE
    imageUrl: {
      type: String,
      required: true,
    },

    // 🔥 Track which user posted it
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("LostItems", RegistrationSchema);

module.exports = Registration;
