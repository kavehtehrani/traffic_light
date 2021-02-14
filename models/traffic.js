const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrafficSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Number,
        default: 0
    },
    message: String
});

module.exports = mongoose.model('Traffic', TrafficSchema);