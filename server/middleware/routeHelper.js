var tokenLib = require('../lib/token');
var db = require("../models");

module.exports = {
  ensureCorrectUserForGroup: function(req, res, next) {
    try{
      var decoded = tokenLib.verify(req);
      db.Group.findById(req.params.groupId).populate("owner").exec(function(err,group){
        if (group.owner.id !== decoded.id) {
          res.status(401).send("Not Authorized");
        }
        else  next();
      });
    }catch(err){
      res.status(500).send(err.message);
    }
  }
};
