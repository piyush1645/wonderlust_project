const express = require("express");
const router=express.Router({mergeParams:true})
const mongoose = require("mongoose");
const app=express();
app.use(express.urlencoded({extended:true}));
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const Listing = require("../models/listing.js");
const user=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");


//index route
router.get("/", wrapAsync(async (req, res) => {
    const AllListing = await Listing.find({});
    console.log(AllListing);
    res.render("listings/index.ejs", { AllListing });
}));

//new route
router.get("/new",isLoggedIn,(req, res) => {
        res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
let { id } = req.params;
const item = await Listing.findById(id).populate("reviews").populate("owner");
console.log(item);
if(!item){
    req.flash("error","listing is does not exist");
    res.redirect("/listing");
}
res.render("listings/show.ejs", { item });
}));

//create route
router.post("/", validateListing,isLoggedIn,wrapAsync(async (req, res) => {
// let {title,price,location,country,image}=req.body;
const newlisting = new Listing(req.body.listing);
newlisting.owner=req.user._id;
await newlisting.save();
req.flash("success","listing is created!");
res.redirect("/listing");
}));

router.get("/:id/edit", isOwner,wrapAsync(async (req, res) => {
let { id } = req.params;
const item = await Listing.findById(id);
if(!item){
    req.flash("error","listing is does not exist");
    res.redirect("/listing");
}
res.render("listings/edit.ejs", { item });
}));

//update route
router.put("/:id",validateListing,isLoggedIn,isOwner, wrapAsync(async (req, res) => {
let { id } = req.params;
const item = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
req.flash("success","listing is update");
res.redirect(`/listing/${id}`);

}));

//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
let { id } = req.params;
const deleteitem = await Listing.findByIdAndDelete(id);
req.flash("success","listing is deleted");
res.redirect("/listing");
}));

module.exports=router;