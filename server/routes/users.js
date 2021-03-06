var express = require("express");
var apiRouter = express.Router();
var db = require("../models");
var auth = require("../middleware/auth");
var tokenLib = require("../lib/token");
var token;

apiRouter.use(auth.checkHeaders);

apiRouter.post('/signup',function(req,res){
  db.User.create(req.body, function(err,user){
    if(err) return res.status(400).send(err);
    if (user && !user.imageUrl) {
      user.imageUrl = "https://ucarecdn.com/85841e9d-e4b7-4b26-80c0-093d48afd900/20160119131731.jpg";
      user.save();
    }
    var listedItems = {id: user._id, username: user.username};
    token = tokenLib.sign(user._id);
    res.json({token:token, user:listedItems});
  });
});

apiRouter.post('/login',function(req,res){
  db.User.authenticate(req.body, function(err,user){
    if(err) return res.status(400).send(err);
    if (!user) return res.status(400).send({error: "Username/password invalid"});
    var listedItems = {id: user._id, username: user.username};
    token = tokenLib.sign(user._id);
    res.json({token:token, user:listedItems});
  });
});

// GET INFO OF ALL the users, DELETE later!
apiRouter.get('/', auth.checkToken, function(req,res){
  db.User.find({}, 'username _id', function(err,users){
    if (err) res.status(500).send(err);
    res.status(200).send(users);
  });
});



apiRouter.get('/:id', auth.checkToken, function(req,res){
  db.User.findById(req.params.id).populate("groups").exec(function(err,user){
    if (err) res.status(500).send(err);
    if (!user) res.status(401).send(err); 
    /*var listedItems = {id: user._id, username: user.username};*/
    res.status(200).send(user);
  });
});

apiRouter.put('/:id', auth.checkToken, function(req,res){
 db.User.findByIdAndUpdate(req.decoded_id, req.body, {new: true}, function(err,user){
   if (err) res.status(400).send(err);
   else { //MAYBE NOT NEEDED?
    if (user && !user.imageUrl) {
      user.imageUrl = "https://ucarecdn.com/85841e9d-e4b7-4b26-80c0-093d48afd900/20160119131731.jpg";
      user.save();
    }
    var listedItems = {id: user._id, username: user.username};
    res.status(200).send(listedItems);
   }
 });
});

apiRouter.delete('/:id', auth.checkToken, function(req,res){
  db.User.findById(req.decoded_id, function(err,user){
    if (err) res.status(500).send(err);
    if (!user) res.status(401).send(err);
    user.remove();
    res.status(200).send("Removed");
  });
});

module.exports = apiRouter;