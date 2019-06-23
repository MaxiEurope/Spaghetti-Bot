const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID: String,
    totalFeeds: Number,
    multiTF: Boolean,
    multi: Number,
    multiRounds: Number,
    getIndex: Number
})

module.exports = mongoose.model('Feed', schema);