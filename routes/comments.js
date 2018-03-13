var express = require("express");
var router = express.Router({mergeParams: true}); // access campgrounds ID from :id
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

// NEW ROUTE - Show a form to create a new comment on specific campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            // console.log(err);
        }
        else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Create a new Comment
router.post("/",  middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            // console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    // console.log(err);
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added your comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comments Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            // console.log(err);
            res.redirect("back");
        }
        else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});

// Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            // console.log(err);
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);    
        }
    });
});

// Comments Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            // console.log(err);
            res.redirect("back");
        }
        else {
            req.flash("sucess", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;