const { Schema, model, Types } = require("../connection");

const WorkSessionSchema = new Schema({
  employeeId: { type: Types.ObjectId, ref: "UserCollection" },
  screenRecording: { type: String },
  videoRecording: { type: String },
  checkInTime: { type: Date, default: Date.now }, // check-in time
  checkOutTime: { type: Date }, // check-out time
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("WorkSessionCollection", WorkSessionSchema);