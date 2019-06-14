const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID: String,
    xp: Number,
    lvl: Number,
    creationDate: Number,
    shortDesc: String,
    longDesc: String,
    color: String,
    lvlupMessage: Boolean
})

module.exports = mongoose.model('Profile', schema);