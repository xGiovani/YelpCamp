var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");

router.get("/", function(req, res){
    res.render("landing");
});


// Show the sign up form
router.get("/register", function(req, res){
    res.render("register");
});

// Handles the sign up
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show Login Form
router.get("/login", function(req, res){
   res.render("login"); 
});

// Handles the user's login
// router.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out")
    res.redirect("/campgrounds");
    // res.redirect("back");
});

module.exports = router;