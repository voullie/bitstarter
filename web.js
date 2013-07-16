var express = require('express');

var app = express.createServer(express.logger());
var fs = require('fs');
//var indexHtml = fs.readFileSync('./index.html').toString();

//var bsCSS = fs.readFileSync('./bootstrap/css/bootstrap-responsive.min.css').toString();
//	app.get('/bootstrap/css/bootstrap-responsive.min.css', function(request, response) {
//	response.send(bsCSS);
//});

app.get('/', function(request, response) {
	var indexHtml = fs.readFileSync('./index.html').toString();
	response.send(indexHtml);
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
