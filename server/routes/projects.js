var express = require("express");
var apiRouter = express.Router();
var db = require("../models");
var auth = require("../middleware/auth");
var routeMiddleware = require("../middleware/routeHelper"); 

apiRouter.use(auth.checkHeaders);

//////////// NEEEEEED MIDDLEWARE SECURITY
apiRouter.post('/', auth.checkToken, function(req,res){
  db.Project.create(req.body,function(error, project){
    if (error) return res.status(400).send(error);
    else {
      db.Group.findById(req.body.group_id,function(err,group){
        if (error) return res.status(400).send(error);
        else {
          group.projects.push(project);  
          project.group = group._id;
          project.save(); 
          group.save();
          res.json({ message: 'Project created!' });
        }
      });
    }  
  });
});

apiRouter.delete('/:projectId', auth.checkToken, function(req,res){
  db.Project.findById(req.params.projectId, function(error,project){
    if (error) return res.json({message: "Sorry, there was an error finding that project!", error: error});
    project.remove();
    res.json({ message: 'Project successfully deleted' });
  });
});

module.exports = apiRouter;