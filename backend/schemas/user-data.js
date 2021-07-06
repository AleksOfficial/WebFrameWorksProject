const mongoose = require('mongoose');
const { stringify } = require('querystring');

const userDataSchema = mongoose.Schema({
    email: String,
    password: String,
    street: String, 
    city: String, 
    postcode: String 
});

module.exports = mongoose.model('UserData', userDataSchema);