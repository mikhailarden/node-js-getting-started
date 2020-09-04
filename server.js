// grab express
var express = require("express");

// create an express app
var app = express();

// CONFIGURE THE APP
// ==================================================
// tell node where to look for site resources
app.use('/', express.static(__dirname + '/public'));
// create an express route for a homepage
// http://localhost:8080/
app.get('/cart_script.js', function(req, res) {
    res.sendfile(__dirname + '/public/cart_function.js');
});

app.listen(8080);
console.log('Server has started');