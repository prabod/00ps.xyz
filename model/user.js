var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    fullName         : String,
    email            : String,

    local            : {
        password     : String
    },

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },

    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

userSchema.statics.findByEmailOrQuery = function(email,query,callback) {
    this.findOne( { $or:[ {email:email}, query ]}, callback);
};

module.exports = mongoose.model('User', userSchema);
