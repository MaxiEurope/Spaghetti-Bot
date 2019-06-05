const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID: String,
    dailyMulti: Number,
    dailyStreak: Number,
    dailyLast: Number,
    patreonTF: Boolean
})

module.exports = mongoose.model('User', schema);