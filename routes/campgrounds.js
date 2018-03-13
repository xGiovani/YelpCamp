var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware");
// Automatic gets index.js because "index" is special

// Index - Show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
    if(err){
        console.log(err);
    }
    else {
        res.render("campgrounds/index", {campgrounds:campgrounds});
    }
    });
});

//CREATE - Add new Campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var newName = req.body.name;
    var newPrice = req.body.price;
    var newImage = req.body.image;
    var newDesc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: newName, price: newPrice, image: newImage, description: newDesc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else {
            req.flash("success", newlyCreated.name + " Successfully created");
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE - Show a form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

// SHOW ROUTE - Show info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// Update campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;