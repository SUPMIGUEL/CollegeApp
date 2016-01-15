var express = require("express");
var apiRouter = express.Router();
var db = require("../models");
var auth = require("../middleware/auth");
var routeMiddleware = require("../middleware/routeHelper"); 

apiRouter.use(auth.checkHeaders);

//////////// NEEEEEED MIDDLEWARE SECURITY
apiRouter.post('/', auth.checkToken, function(req,res){
  db.Group.findById(req.body.group_id, function(error,group){
    if (error) return res.status(400).send(error);
    group.notes.push({note: req.body.content});
    group.save();
    res.json({ message: 'note created!' });
  });
});

apiRouter.delete('/:noteId', auth.checkToken, function(req,res){
  console.log("HIIIIIIII!");
  db.Group.findById(req.params.noteId, function(error,group){
    if (error) return res.status(400).send(error);

    console.log("NOT DELETED YET!!!!!");
    console.log(group);
    console.log(req.body);
    
 
    res.json({ message: 'note deleted!' });
  });
});

module.exports = apiRouter;