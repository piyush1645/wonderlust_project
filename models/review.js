const { object } = require("joi");
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
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});
const Review= mongoose.model("Review", reviewSchema);
module.exports =Review;
