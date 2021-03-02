const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RoommmateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    message: String,
    lastUpdate: {type: Date, default: Date.now()}
}, { collection: 'roommate' });


module.exports = mongoose.model('ModelRoommate', RoommmateSchema);







