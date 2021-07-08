const mongoose = require('mongoose');

const highscoreSchema = mongoose.Schema({
    email: String,
    value: Number,
    puzzle: Number
});

module.exports = mongoose.model('Highscore', highscoreSchema);