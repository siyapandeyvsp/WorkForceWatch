const { Schema, model, Types } = require("../connection");
const userSchema = new Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    password: {type: String , required: true},
    avatar: {type: String},
    companyId: {type: Types.ObjectId, ref: 'companyCollection'},
    role: {type: String},
    createdAt: {type: Date, default: Date.now},
});
module.exports = model('UserCollection', userSchema);
    