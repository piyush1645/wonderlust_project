const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const Review=require("./models/review.js");
const app = express();
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const methodOverride = require('method-override');
const routers=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.use("/listing",routers);
app.use("/listing/:id/reviews",reviewRouter);

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


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err, req, res, next) => {
    let {statusCode=500,message="Something want wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
