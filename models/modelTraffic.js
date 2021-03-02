const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModelRoommate = require('./modelRoommate')

const TrafficInstanceSchema = new Schema({
    url: String,
    roommates: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ModelRoommate'
        }
    ]
}, { collection: 'trafficLights' });

module.exports = mongoose.model('ModelTrafficInstance', TrafficInstanceSchema);

