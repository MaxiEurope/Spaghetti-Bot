const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID: String,
    total: Number
});

module.exports = mongoose.model('Commands', schema);