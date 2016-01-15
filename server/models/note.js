var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
                    content: String,
                    group: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Group"
                          }
                });

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;