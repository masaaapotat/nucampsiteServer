const mongoose = require('mongoose');
const { loadType } = require('mongoose-currency');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose );
const Currency = mongoose.Types.Currency;

// Create Schema for partners
const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    cost: {
      type: Currency,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
 // Creating the model for promotion
const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;