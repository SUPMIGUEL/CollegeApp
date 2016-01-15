var express = require("express");
var apiRouter = express.Router();
var db = require("../models");
var auth = require("../middleware/auth");
var routeMiddleware = require("../middleware/routeHelper"); 

apiRouter.use(auth.checkHeaders);

//////////// NEEEEEED MIDDLEWARE SECURITY
apiRouter.post('/', auth.checkToken, function(req,res){
  db.Homework.create(req.body,function(error, homework){
    if (error) return res.status(400).send(error);
    else {
      db.Group.findById(req.body.group_id,function(err,group){
        if (error) return res.status(400).send(error);
        else {
          group.homeworks.push(homework);  
          homework.group = group._id;
          homework.save();
          group.save();
          res.json({ message: 'Homework created!' });
        }
      });
    }  
  });
});

apiRouter.delete('/:homeworkId', auth.checkToken, function(req,res){
  db.Homework.findById(req.params.homeworkId, function(error,homework){
    if (error) return res.json({message: "Sorry, there was an error finding that homework!", error: error});
    homework.remove();
    res.json({ message: 'Homework successfully deleted' });
  });
});

module.exports = apiRouter;