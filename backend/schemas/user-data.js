const mongoose = require('mongoose');
const { stringify } = require('querystring');

const userDataSchema = mongoose.Schema({
    email: String,
    password: String,
    street: String, 
    city: String, 
    postcode: String,
    token: String
});
console.log(mongoose.model('UserData', userDataSchema));
module.exports = mongoose.model('UserData', userDataSchema);