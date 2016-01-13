var express = require("express");
var apiRouter = express.Router();
var db = require("../models");
var auth = require("../middleware/auth");
var routeMiddleware = require("../middleware/routeHelper");

apiRouter.get('/', function(req,res){
  db.Group.find({}).populate("owner").exec(function(error,groups){
    if(error) return res.status(500).send(error);
    res.status(200).json(groups);
  });
});

apiRouter.get('/:groupId', function(req,res){
  db.Group.findById(req.params.groupId).populate({ path: 'owner comments'}).exec(function(error,group){
    if (error) return res.json({message: "Sorry, there was an error finding that group!", error: error});
    db.Comment.find({ _id: { $in: group.comments }}).populate("user").exec(function(err, comments){
      console.log("COMMENTS"+comments);
      res.json({group: group, comments: comments});
    });
  });
});

apiRouter.use(auth.checkHeaders);

apiRouter.post('/', auth.checkToken, function(req,res){
  db.Group.create(req.body,function(error, group){
    if (error) return res.status(400).send(error);
    if (group && !group.imageUrl) {
      group.imageUrl = "https://www.junkfreejune.org.nz/themes/base/production/images/default-profile.png";
    }
    group.owner = req.decoded_id;
    group.save();
    res.json({ message: 'Group created!' });
  });
});

apiRouter.put('/:groupId', auth.checkToken, routeMiddleware.ensureCorrectUserForGroup, function(req,res){
  db.Group.findByIdAndUpdate(req.params.groupId, req.body, function(error,group){
    if (error) return res.json({message: "Sorry, there was an error!", error: error});
    if (group && !group.imageUrl) {
      group.imageUrl = "https://www.junkfreejune.org.nz/themes/base/production/images/default-profile.png";
      group.save();
    }
    res.json({ message: 'Group updated!' });
  });
});

apiRouter.delete('/:groupId', auth.checkToken, routeMiddleware.ensureCorrectUserForGroup, function(req,res){
  db.Group.findById(req.params.groupId, function(error,group){
    if (error) return res.json({message: "Sorry, there was an error finding that group!", error: error});
    group.remove();
    res.json({ message: 'Group successfully deleted' });
  });
}); 

module.exports = apiRouter;