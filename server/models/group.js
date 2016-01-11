var mongoose = require("mongoose");
var User = require("./user");

var Homeworks = new mongoose.Schema({ homework: String });
var Projects = new mongoose.Schema({ project: String });
var Notes = new mongoose.Schema({ note: String });

var groupSchema = new mongoose.Schema({
                    name: { 
                            type: String, 
                            required: true, 
                            },
                    description: {
                                  type: String,
                                  required: true, 
                                 },
                    type: {
                            type: String,
                            required: true, 
                           },
                    imageUrl: {
                                type: String,
                                required: true, 
                              },
                    startDate: {
                                  type: String,
                                  required: true, 
                                },
                    endDate: {
                              type: String,
                              required: true, 
                               },
                    address: {
                              type: String,
                              required: true, 
                               },
                    locationDetails: { type: String },
                    rules: { type: String },
                    owner: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User"
                           },
                    comments: [{
                              type: mongoose.Schema.Types.ObjectId,
                              ref: "Comment"
                            }],
                    homeworks: [Homeworks],
                    projects: [Projects],
                    notes: [Notes]
});

var Group = mongoose.model("group", groupSchema);

module.exports = Group;

/*name, description, type, imageUrl, startdate, 
endDate, address, locationDetails, rules
comments, homeworks, projects, notes*/