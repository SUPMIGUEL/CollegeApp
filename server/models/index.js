var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/college_app");

mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Group = require("./group");
module.exports.Comment = require("./comment");

//var databaseName = ;
//mongoose.connect( process.env.AUTH_DB_NAME || "mongodb://localhost/college_app" );