const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID: String,
    coins: Number
});

module.exports = mongoose.model('Coins', schema);