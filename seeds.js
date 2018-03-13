var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js")

var data = [
    {
        name: "Cloud's Rest",
        image: "http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"
    },
    {
        name: "Heaven's Test",
        image: "http://www.suttonfalls.com/communities/4/004/012/498/244//images/4628314067.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"
    },
    {
        name: "Cloud's Majors",
        image: "http://www.hamburgpa.org/wp-content/uploads/2010/11/mountain-springs-campground.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"
    }
]

function seedDB(){
    // Remove All Campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Campgrounds!");
        // Add Campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("Added Campground");
                     // Add Coments
                     Comment.create(
                         {
                             text: "This place is great",
                             author: "Homer"
                         }, function(err, comment){
                             if(err){
                                 console.log(err);
                             }
                             else {
                                 campground.comments.push(comment);
                                 campground.save();
                                 console.log("Comment Created");
                             }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;

