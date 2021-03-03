const mongoose = require('mongoose')

const DishSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    }
})

module.exports = mongoose.model('Dish', DishSchema)