const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //calling wrapAsync
const Listing = require("../models/listing.js"); //connect listing.js
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,  
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );
    

//index Route
// router.get("/", wrapAsync(listingController.index));

//Create Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// router.post("/",validateListing, isLoggedIn, wrapAsync(listingController.createListing));

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));


module.exports = router;