var express = require("express"),
app = express(),
methodOverride = require("method-override"), //¿¿¿¿?????
path = require("path"),
bodyParser = require("body-parser"),
morgan = require("morgan"),
apiRouter = require("./routes");

app.use('/css',express.static(path.join(__dirname, '../client/css')));
app.use('/js',express.static(path.join(__dirname, '../client/js')));
app.use('/templates',express.static(path.join(__dirname, '../client/js/templates')));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/users/', apiRouter.users);
app.use('/api/groups/', apiRouter.groups);

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.listen(3001, function() {
  console.log("Listening on localhost: 3001");
});

module.exports = app;