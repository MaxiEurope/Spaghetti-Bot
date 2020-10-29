const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID: String,
    last: Number,
    streak: Number
});

module.exports = mongoose.model('Daily', schema);