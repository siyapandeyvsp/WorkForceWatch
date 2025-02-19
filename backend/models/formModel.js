const {Schema, model, Types} = require('../connection');

const formSchema = new Schema({
firstName: {
    type: String,
    required: true
},
number: {
    type: Number,
    required: true
},
email: {
    type: String,
    required: true
},
sex: {
    type: String,
    enum: ['male', 'female'],
    required: true
}
});
module.exports = model('FormCollection', formSchema);

