const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js"); 
const app = express();
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
    console.log("Connected to MongoDB");
}
main().catch(err => console.log(err));

let port = 8080;


app.get("/", (req, res) => {
    console.log("Hello, Home Route");
    res.send("Welcome to Home Page");
});


//index route
app.get("/listing",async(req,res)=>{
    const AllListing=await Listing.find({}); 
    console.log(AllListing);
    res.render("listings/index.ejs",{AllListing});
});

//new route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const item=await Listing.findById(id);
    res.render("listings/show.ejs",{item});
});
//create route
app.post("/listing",async(req,res)=>{
    // let {title,price,location,country,image}=req.body;
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
});

app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const item=await Listing.findById(id);
    res.render("listings/edit.ejs",{item});
});

//update route
app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const item=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");

});

//delete route
app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const deleteitem=await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
