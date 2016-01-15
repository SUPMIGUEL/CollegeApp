var mongoose = require("mongoose");

var homeworkSchema = new mongoose.Schema({
                    content: String,
                    group: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Group"
                          }
                });

var Homework = mongoose.model("Homework", homeworkSchema);

module.exports = Homework;