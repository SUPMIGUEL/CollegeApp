var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
                    content: String,
                    group: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Group"
                          }
                });

var Project = mongoose.model("Project", projectSchema);

module.exports = Project;