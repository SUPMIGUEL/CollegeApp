var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/college_app");

mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Group = require("./group");
module.exports.Comment = require("./comment");
module.exports.Homework = require("./homework");
module.exports.Note = require("./note");
module.exports.Project = require("./project");

//var databaseName = ;
//mongoose.connect( process.env.AUTH_DB_NAME || "mongodb://localhost/college_app" );
