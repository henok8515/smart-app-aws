const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
