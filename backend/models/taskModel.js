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
  startTime:{type: Date,default: () => new Date().setHours(0, 0, 0, 0)},
  endTime:{type: Date,default: () => new Date().setHours(0,0,0,0)},
  duration: { type: Number, required: true, default: 0 }, // Change to Number type
});
module.exports = model("TaskCollection", taskSchema);
