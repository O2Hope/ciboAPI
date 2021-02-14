const mongoose = require('mongoose')

const Restaurant = new mongoose.Schema({
   name: {
       type: String,
       required: [true, 'Name is required'],
       unique: true,
       trim: true,
       maxlength: 50
   },
    slug: String,
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    website: {
       type: String,
    },
    phone: {
       type: String,
        maxlength: 20
    },
    email: {
       type: String
    },
    address: {
       type: String,
        required: true
    },
    location: {
       type: {
           type: String,
           enum: ['Point'],
        },
        coordinates: {
           type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    averageRating: {
       type: Number,
        min: 1,
        max: 10
    },
    averageCost: {
        type: Number,
        min: 1,
        max: 5
    },
    photo: {
       type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
       type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Restaurant', Restaurant)