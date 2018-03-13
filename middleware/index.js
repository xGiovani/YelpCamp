var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                if(campground.author.id.equals(req.user._id)){
                    // campground.author.id => Object
                    // req.user._id => String
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back"); // previous page
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                // console.log(err);
                res.redirect("back");
            }
            else {
                if(comment.author.id.equals(req.user._id)){
                    // campground.author.id => Object
                    // req.user._id => String
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back"); // previous page
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first");
    res.redirect("/login");
}

module.exports = middlewareObj