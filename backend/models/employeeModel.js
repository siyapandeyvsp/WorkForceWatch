// const { Schema, model } = require("../connection");
// const employeeSchema = new Schema({
//     email: {type: String, required: true},
//     name: {type: String, required: true},    
//     password: {type: String , required: true},
//     avatar: {type: String},
//     designation: {type: String},
//     employerId: {type: Schema.Types.ObjectId, ref: 'UserCollection'},
//     createdAt: {type: Date, default: Date.now},
// });
// module.exports = model('EmployeeCollection', employeeSchema);
    

const { Schema, model } = require("../connection");

const employeeSchema = new Schema({
  // Basic Information
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  designation: { type: String },
  employerId: { type: Schema.Types.ObjectId, ref: 'UserCollection' },
  createdAt: { type: Date, default: Date.now },

  // Enhanced General Information
 
  fathersName: { type: String },
  mothersName: { type: String },
  dob: { type: Date },
  age: { type: Number },
  bloodGroup: { type: String },
  maritalStatus: { type: String },
  gender: { type: String },
  employeeId: { type: String },
  category: { type: String },
  employmentType: { type: String },
  religion: { type: String },
  dateOfJoining: { type: Date },
  probationMonths: { type: Number },
  dateOfConfirmation: { type: Date },
  officialEmail: { type: String },
  writtenLanguage: { type: String },
  spokenLanguage: { type: String },
  motherTongue: { type: String },

  // Enhanced Contact Information
  houseNumber: { type: String },
  area: { type: String },
  townCity: { type: String },
  district: { type: String },
  country: { type: String },
  state: { type: String },
  pincode: { type: String },
  contactNumber: { type: String },
  emergencyNumber: { type: String },
  personalEmail: { type: String },

  // Enhanced Qualification Information
  highSchoolPercentage: { type: Number },
  highSchoolName: { type: String },
  highSchoolBoard: { type: String },
  intermediatePercentage: { type: Number },
  intermediateSchool: { type: String },
  intermediateBoard: { type: String },
  graduationDegree: { type: String },
  graduationPercentage: { type: Number },
  postGraduationDegree: { type: String },
  postGraduationPercentage: { type: Number },
  additionalCertifications: { type: String },

  // Enhanced Bank Information
  accountNumber: { type: String },
  bankName: { type: String },
  bankBranch: { type: String },
  ifscCode: { type: String },

  // Enhanced Payroll Information
  grossSalary: { type: Number },
  basicSalary: { type: Number },
  hra: { type: Number },
  da: { type: Number },
  taxDeductions: { type: Number },
  employeeEPF: { type: Number },
  employeeESIC: { type: Number },
});

module.exports = model('EmployeeCollection', employeeSchema);
