if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session =require("express-session");
const flash=require("connect-flash");
const Listing = require("./models/listing.js");
const Review=require("./models/review.js");
const app = express();
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const methodOverride = require('method-override');
const listingRouters=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const passport=require("passport");
const localstrategy=require("passport-local");
const user=require("./models/user.js");




const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new user({
//         email:"student@gmail.com",
//         username:"piyush-mevada",
//     });

//     let registeredUser=await user.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listing",listingRouters);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
    console.log("Connected to MongoDB");
}
main().catch(err => console.log(err));

let port = 8080;



// app.get("/", (req, res) => {
//     console.log("Hello, Home Route");
//     res.send("Welcome to Home Page");
// });


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
