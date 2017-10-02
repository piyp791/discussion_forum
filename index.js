var fs = require('fs');
var http = require('http');
var https = require('https');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var dbHelper = require('./db-helper');


var express = require('express');
var app = express();

// your express configuration here

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));


app.set('view engine', 'ejs');
var routes = require('./routes')(app); 


app.get('/', function(req, res) {
	res.redirect('/home')
})

//handle 404 errors for all the unhandled requests
app.get('/*', function(req, res) {
    res.status(404).write("404")
    res.end();
 
})

var httpServer = http.createServer(app);

httpServer.listen({
  port: process.env.PORT || 3000
}, function(err, result){
	if(err){
		console.log("error starting app server");
	}else{
		dbHelper.connect(function(error, res){
    		if(error){
      			console.log('DB connection error' + error);
      			process.exit(1)
    		}else{
      			console.log('App server and DB server up and running at port 3000')
    		}
  		})
	}
});