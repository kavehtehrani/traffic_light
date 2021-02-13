const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrafficSchema = new Schema({
    name: String,
    status: Number,
    message: String
});

module.exports = mongoose.model('Traffic', TrafficSchema);