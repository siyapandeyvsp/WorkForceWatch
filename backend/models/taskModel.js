const { Schema, model, Types } = require("../connection");

const taskSchema = new Schema({
  taskName: { type: String, required: true },
  description: { type: String },
  assignedBy: { type: Types.ObjectId, ref: "UserCollection" },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
  },
  comments: [
    {
      comment: { type: String },
      commentedBy: { type: Types.ObjectId, ref: "UserCollection" },
    },
  ],
  assigned: {type : Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
});
module.exports = model("TaskCollection", taskSchema);
