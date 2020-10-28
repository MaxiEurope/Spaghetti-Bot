const mongoose = require('mongoose');

const schema = mongoose.Schema({
    channelID: String,
    disabled: Array
});

module.exports = mongoose.model('Channel', schema);