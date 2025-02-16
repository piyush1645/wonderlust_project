const express = require("express");
const router=express.Router({mergeParams:true});
const mongoose = require("mongoose");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const reviewcontroller=require("../controllers/review.js");

//review route
//post route
router
    .route("/")
    .post(isLoggedIn,validateReview,wrapAsync(reviewcontroller.post));

// delete review route
router
    .route("/:reviewId")
    .delete(isLoggedIn,isReviewAuthor,wrapAsync(reviewcontroller.delete));

module.exports=router;


