const mongoose = require('mongoose');
const { loadType } = require('mongoose-currency');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose );
const Currency = mongoose.Types.Currency;

// Create Schema for comments
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, 
{
    // Automatically creates `createdAt` and `updatedAt` fields
    timestamps: true
});

// Create Schema for campsites
const CampsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true // No two documents should have the same name
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    // Add the comments as an array of subdocuments
    comments: [commentSchema]
}, 
{
    // Automatically creates `createdAt` and `updatedAt` fields
    timestamps: true
});

// Creating the model using the schema
const Campsite = mongoose.model('Campsite', CampsiteSchema);


module.exports = Campsite;
