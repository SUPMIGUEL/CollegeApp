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
      db.Homework.find({ _id: { $in: group.homeworks }}).exec(function(err, homeworks){
        db.Note.find({ _id: { $in: group.notes }}).exec(function(err, notes){
          db.Project.find({ _id: { $in: group.projects }}).exec(function(err, projects){
            res.json({group: group, comments: comments, homeworks: homeworks, notes: notes, projects: projects});
          });
        });
      });
    });
  });
});

apiRouter.use(auth.checkHeaders);

apiRouter.post('/', auth.checkToken, function(req,res){
  db.Group.create(req.body,function(error, group){
    if (error) return res.status(400).send(error);
    if (group && !group.imageUrl) {
      group.imageUrl = "https://ucarecdn.com/d380ea71-23cd-4a29-845d-a5a3e7cef1b9/20160119133234.jpg";
    }

    db.User.findById(req.decoded_id, function(error,user){
      if (error) return res.json({message: "Sorry, there was an error finding that user!", error: error});
      user.groups.push(group);
      user.save();
    });

    group.owner = req.decoded_id; 
    group.save();
    res.json({ message: 'Group created!' });
  });
});

apiRouter.put('/:groupId', auth.checkToken, routeMiddleware.ensureCorrectUserForGroup, function(req,res){
  db.Group.findByIdAndUpdate(req.params.groupId, req.body, function(error,group){
    if (error) return res.json({message: "Sorry, there was an error!", error: error});
    if (group && !group.imageUrl) {
      group.imageUrl = "https://ucarecdn.com/d380ea71-23cd-4a29-845d-a5a3e7cef1b9/20160119133234.jpg";
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