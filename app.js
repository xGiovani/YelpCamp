var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground     = require("./models/campground.js"),
    Comment        = require("./models/comment.js"),
    User           = require("./models/user"),
    seedDB         = require("./seeds.js");
    
// Requiring Routes
var commentRoutes    = require("./routes/comments.js"),
    campgroundRoutes = require("./routes/campgrounds.js"),
    indexRoutes      = require("./routes/index.js");
    
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://giovani:452613@ds213209.mlab.com:13209/yelpcamp_webdev");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// Passport Config
app.use(require("express-session")({
    secret: "I love Dogs",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Function that enables verifying on header.ejs if the user is logged in
// This function is called on every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
// Put /campgrounds in front of all routes on campgrounds.js routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Has Started");
});

// RESTFULL ROUTES
// name /   url /     verb /  desc
// ========================
// INDEX   /dogs      GET    Display a list of all dogs
// NEW     /dogs/new  GET    Display form to make a new dog
// CREATE  /dogs      POST   Add new dog to DB from the form
// SHOW    /dogs/:id  GET    Shows info about one specific dog