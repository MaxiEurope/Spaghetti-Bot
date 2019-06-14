const mongoose = require('mongoose');

const schema = mongoose.Schema({
    serverID: String,
    prefix: String,
    active: Boolean
})

module.exports = mongoose.model('Guild', schema);