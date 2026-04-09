const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); //calling wrapAsync
const Review = require("../models/review.js"); //calling Review Schema
const Listing = require("../models/listing.js"); //connect listing.js.
const {validateReview, isLoggedIn} = require("../MIDDLEWARE.JS");
const { isReviewAuthor } = require("../MIDDLEWARE.js");
const reviewcontroller = require("../controllers/reviews.js");
const review = require("../models/review.js");


//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewcontroller.createReview));
//Delete Review Route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewcontroller.deleteReview));

module.exports = router;