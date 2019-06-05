const mongoose = require('mongoose');

const schema = mongoose.Schema({
    serverID: String,
    prefix: String
})

module.exports = mongoose.model('Guild', schema);