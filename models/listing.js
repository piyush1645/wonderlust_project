const mongoose = require("mongoose");
const review = require("./review");
const user= require("./user");
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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        },
    
});

listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
    await review.deleteMany({_id : {$in: Listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


