const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company must be provided"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Position must be provided"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["interwiev", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobsSchema);
