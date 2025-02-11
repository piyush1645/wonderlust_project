const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.post=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("new review saved");
    req.flash("success","review is added");
    res.redirect(`/listing/${req.params.id}`);
};

module.exports.delete=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
   req.flash("success","review is deleted");
    res.redirect(`/listing/${id}`);
};

