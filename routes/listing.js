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

router
    .route("/")
    .get(wrapAsync(listingcontroller.indexRoute))
    .post(validateListing, isLoggedIn, wrapAsync(listingcontroller.createRoute));


router
    .route("/new")
    .get( isLoggedIn, listingcontroller.newRoute);

router
    .route("/:id")
    .get(wrapAsync(listingcontroller.showRoute))
    .put(validateListing, isLoggedIn, isOwner, wrapAsync(listingcontroller.updateRoute))
    .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.deleteRoute));

router
    .route("/:id/edit")
    .get(isOwner, wrapAsync(listingcontroller.editRoute));

module.exports = router;