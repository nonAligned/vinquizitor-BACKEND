const mongoose = require('mongoose');


const VarietySchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    alt_names: {
        type: [String]
    },
    description: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    body: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    alcohol: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    sweetness: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    tannin: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    acidity: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    regional_varieties_ids: {
        type: [String],
    },
    food_pairing: {
        type: String,
    },
    serving_temperature: {
        type: Number,
        required: true
    },
    price_range: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    decant: {
        type: Boolean,
        required: true
    },
    flavors: {
        type: {
            list: {type: [String], required: true},
            description: {type: String, required: true}
        },
        required: true
    },
    glass_serving: {
        type: String,
        required: true
    },
    cellar_storage: {
        type: String,
        required: true
    },
    rarity: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    top_producers: {
        type: [String],
        required: true
    },
    styles: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Varieties', VarietySchema);