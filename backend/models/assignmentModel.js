const { Schema, model, Types } = require("../connection");

const assignmentSchema = new Schema({
  task: { type: Types.ObjectId, ref: 'TaskCollection' },
  assignedTo: { type: Types.ObjectId, ref: "UserCollection" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = model("AssignmentCollection", assignmentSchema);
