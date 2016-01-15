var express = require("express");
var apiRouter = express.Router();
var db = require("../models");
var auth = require("../middleware/auth");
var routeMiddleware = require("../middleware/routeHelper"); 

apiRouter.use(auth.checkHeaders);

//////////// NEEEEEED MIDDLEWARE SECURITY
apiRouter.post('/', auth.checkToken, function(req,res){
  db.Note.create(req.body,function(error, note){
    if (error) return res.status(400).send(error);
    else {
      db.Group.findById(req.body.group_id,function(err,group){
        if (error) return res.status(400).send(error);
        else {
          group.notes.push(note);  
          note.group = group._id;
          note.save(); 
          group.save();
          res.json({ message: 'Note created!' });
        }
      });
    }  
  });
});

apiRouter.delete('/:noteId', auth.checkToken, function(req,res){
  db.Note.findById(req.params.noteId, function(error,note){
    if (error) return res.json({message: "Sorry, there was an error finding that note!", error: error});
    note.remove();
    res.json({ message: 'Note successfully deleted' });
  });
});

module.exports = apiRouter;