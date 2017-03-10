var express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    flash = require("connect-flash");
    
// DATABASE CONFIGURATION
var configDB = require('./config/database');
mongoose.connect(configDB.url);

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
seedDB(); // seeds the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "random string of text",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// requiring routes
require('./routes/index')(app, passport);

app.listen(port, function() {
    console.log('Server running on port ' + port);
});