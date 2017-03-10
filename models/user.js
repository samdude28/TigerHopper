var mongoose = require("mongoose");
    
var UserSchema = new mongoose.Schema({
    // The twitter object used when a user logs in via Twitter.
    twitter : {
        id: String,
        token: String,
        username: String,
        displayName: String
    }
});


module.exports = mongoose.model("User", UserSchema);