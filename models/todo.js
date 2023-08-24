const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  sharedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sharedUser",
  },
  authentication: {
    type: String
  }
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
