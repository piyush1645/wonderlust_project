const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        default:"https://pixabay.com/photos/red-plum-republic-of-korea-4625194/",
        type: String,
        set: (v) => (v === "" ? "https://pixabay.com/photos/red-plum-republic-of-korea-4625194/" : v),
    },
    price: Number, 
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
