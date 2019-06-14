const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID: String,
    xp: Number,
    lvl: Number,
    creationDate: Number,
    shortDesc: String,
    longDesc: String,
    color: String
})

module.exports = mongoose.model('Profile', schema);