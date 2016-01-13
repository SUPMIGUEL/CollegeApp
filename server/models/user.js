var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var Group = require("./group");

var userSchema = new mongoose.Schema({
  username: {
              type: String,
              required: true,
              unique: true
            },
  password:{
              type:String,
              required: true
            },
  imageUrl:{ type:String },
  firstname: {
              type:String,
              required: true
             },
  lastname: {
              type:String,
              required: true
             },
  description: {
              type:String,
              required: true
             },
  email: {
          type:String,
          required: true
         },
  type: {
          type:String,
          required: true
         },
  personalweb: { type:String },
  twitter: { type:String },
  phone: { type:String },
  groups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
           }]
});

userSchema.pre('remove', function(next) {
    Group.remove( { owner: this._id } ).exec();
    next();
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.statics.authenticate = function (formData, callback) {
  this.findOne({
    username: formData.username
  },
  function (err, user) {
    if (user === null){
      callback("Invalid username or password",null);
    }
    else {
      user.checkPassword(formData.password, callback);
    }
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

var User = mongoose.model("User",userSchema);
module.exports = User;

/*username, imageurl, firstname, lastname, 
description, email, type, personalweb, 
twitter, phone, linkedin, groups*/
