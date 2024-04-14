const { Schema, model } = require("../connection");
const employeeSchema = new Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},    
    password: {type: String , required: true},
    avatar: {type: String},
    designation: {type: String},
    employerId: {type: Schema.Types.ObjectId, ref: 'UserCollection'},
    createdAt: {type: Date, default: Date.now},
});
module.exports = model('EmployeeCollection', employeeSchema);
    