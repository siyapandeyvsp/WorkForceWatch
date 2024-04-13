const { Schema, model } = require("../connection");
const companySchema = new Schema({
    name: {type: String, required: true},
    description:{type: String, required: true},
    logo: {type: String},
    cover: {type: String},
    address: {type: String},    
    createdAt: {type: Date, default: Date.now},
});
module.exports = model('companyCollection', companySchema);
    