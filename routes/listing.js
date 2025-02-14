const express = require("express");
const router = express.Router({ mergeParams: true })
const mongoose = require("mongoose");
const app = express();
app.use(express.urlencoded({ extended: true }));
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const Listing = require("../models/listing.js");
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingcontroller.indexRoute))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,  wrapAsync(listingcontroller.createRoute));


router
    .route("/new")
    .get( isLoggedIn, listingcontroller.newRoute);


router
    .route("/search")
    .get(wrapAsync(listingcontroller.searchRoute));

router
    .route("/:id")
    .get(wrapAsync(listingcontroller.showRoute))
    .put( isLoggedIn, isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingcontroller.updateRoute))
    .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.deleteRoute));

router
    .route("/:id/edit")
    .get(isOwner, wrapAsync(listingcontroller.editRoute));




module.exports = router;