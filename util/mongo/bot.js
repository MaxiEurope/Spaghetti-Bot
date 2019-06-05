const mongoose = require('mongoose');

const schema = mongoose.Schema({
    botID: String,
    totalGFeeds: Number
})

module.exports = mongoose.model('Bot', schema);