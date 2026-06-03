const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    assignee: String,
    dueDate: String,
    priority: String,
    status: {
      type: String,
      default: "todo",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);