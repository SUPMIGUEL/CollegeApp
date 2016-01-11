var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
                    content: String,
                    user: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User"
                          },
                    group: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Group"
                          },
                });

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;