const mongoose = require('mongoose');

const GlassSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    descirption: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Glass', GlassSchema);