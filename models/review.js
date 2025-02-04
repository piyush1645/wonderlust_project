const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,  // Use Number instead of number
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,  // Use Date instead of date
        default: Date.now // Use function reference instead of invoking it
    }
});

module.exports = mongoose.model("Review", reviewSchema);
