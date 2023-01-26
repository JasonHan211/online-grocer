const mongoose = require('mongoose');

const WeatherSchema  = new mongoose.Schema({
    container: {
        type: String,
        required: false
    },
    temperature: {
        type: String,
        required: false
    },
    humidity: {
        type: Number,
        required: false
    },
    time: {
        type: String,
        required: false
    },
    oriTime: {
        type: Date,
        required: false
    }
    
},{timestamps: true});

const Weather = mongoose.model('Weather',WeatherSchema);

module.exports = Weather;