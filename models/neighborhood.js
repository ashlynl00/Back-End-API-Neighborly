const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const neighborhoodSchema = new Schema ({
    name: {type: String, required: true},
    location: {type: String, required: true},
    img: {type: String, required: true, default: "https://i.imgur.com/wG8tIvl.jpg"}
});

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

module.exports = Neighborhood;