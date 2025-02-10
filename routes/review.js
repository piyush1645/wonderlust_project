const express = require("express");
const router=express.Router({mergeParams:true});
const mongoose = require("mongoose");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview}=require("../middleware.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

//review route
//post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("new review saved");
    req.flash("success","review is added");
    res.redirect(`/listing/${req.params.id}`);
}));

// delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
     let {id,reviewId}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull: { reviews : reviewId}});
     await Review.findByIdAndDelete(reviewId);
    req.flash("success","review is deleted");
     res.redirect(`/listing/${id}`);
}));

module.exports=router;


