var express = require("express");
var apiRouter = express.Router();
var db = require("../models");
var auth = require("../middleware/auth");
var routeMiddleware = require("../middleware/routeHelper");

apiRouter.use(auth.checkHeaders);

apiRouter.post('/', auth.checkToken, function(req,res){
  db.Comment.create(req.body,function(error, comment){
    if (error) return res.status(400).send(error);
    else {
      db.Group.findById(req.body.group_id,function(err,group){
        if (error) return res.status(400).send(error);
        else {
          group.comments.push(comment);  
          comment.group = group._id;
          comment.user = req.decoded_id;
          comment.save();
          group.save();
          res.json({ message: 'Comment created!' });
        } 
      });
    }  
  });
});

apiRouter.delete('/:commentId', auth.checkToken, routeMiddleware.ensureCorrectUserForComment, function(req,res){
  db.Comment.findById(req.params.commentId, function(error,comment){
    if (error) return res.json({message: "Sorry, there was an error finding that comment!", error: error});
    comment.remove();
    res.json({ message: 'Comment successfully deleted' });
  });
}); 

module.exports = apiRouter;