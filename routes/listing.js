const express = require("express");
const router=express.Router({mergeParams:true})
const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        const err=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//index route
router.get("/", wrapAsync(async (req, res) => {
    const AllListing = await Listing.find({});
    console.log(AllListing);
    res.render("listings/index.ejs", { AllListing });
}));

//new route
router.get("/new", (req, res) => {
res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
let { id } = req.params;
const item = await Listing.findById(id).populate("reviews");
res.render("listings/show.ejs", { item });
}));

//create route
router.post("/", validateListing,wrapAsync(async (req, res) => {
// let {title,price,location,country,image}=req.body;
const newlisting = new Listing(req.body.listing);
await newlisting.save();
res.redirect("/listing");
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
let { id } = req.params;
const item = await Listing.findById(id);
res.render("listings/edit.ejs", { item });
}));

//update route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
let { id } = req.params;
const item = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
res.redirect("/listing");

}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
let { id } = req.params;
const deleteitem = await Listing.findByIdAndDelete(id);
res.redirect("/listing");
}));

module.exports=router;