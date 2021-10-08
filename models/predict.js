const mongoose = require('mongoose');

const predictsSchema = new mongoose.Schema ({
    name: {type: String, required: true},
    home: {type: Number, default: 0},
    away: {type: Number, default: 0},
    comment: {type: String}
});


const Predict = mongoose.model('Predict', predictsSchema);

module.exports = Predict;