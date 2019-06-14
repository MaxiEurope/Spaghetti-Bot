const mongoose = require('mongoose');

const schema = mongoose.Schema({
    channelID: String,
    c1: Boolean,
    c2: Boolean,
    c3: Boolean,
    c4: Boolean,
    c5: Boolean,
    c6: Boolean,
    c7: Boolean,
    c8: Boolean,
    c9: Boolean,
    c10: Boolean,
    c11: Boolean,
    c12: Boolean,
    c13: Boolean,
    c14: Boolean
})

module.exports = mongoose.model('Channel', schema);