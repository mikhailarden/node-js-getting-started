/***********************************
*Node JS & Express JS server for Shopify API
*Author: Mikhail Arden
***********************************/

//Load node.js modules
var express = require('express'); //Require the Express Module
var cors = require('cors') // Cors

// Config modules

var storeURL = "https://comfortgroup.myshopify.com/admin/";
var apiVersion = "2020-07";

// API Config
    
    var apiPass = process.env.BASIC_AUTH;
    var orderAuth = process.env.CLIENT_PASS;


//Runs every time a request is recieved
function logger(req, res, next) {
    console.log('Request from: ' + req.ip + ' For: ' + req.path); //Log the request to the console
    next(); //Run the next handler (IMPORTANT, otherwise your page won't be served)
}

// Draft Order function
function draftOrder(lineJSON) {
    var settings = {
        "url": storeURL+"api/"+apiVersion+"/draft_orders.json",
        "method": "POST",
        "headers": {
            "X-Shopify-Access-Token": apiPass,
            "Content-Type": "application/json",
            "Authorization": orderAuth,

        },
        "data": JSON.stringify({ "draft_order": { "line_items": lineJSON } }),
    };

    $.ajax(settings).done(function(response) {
        window.location.href = response.draft_order.invoice_url;
    });
}

var port = 8000;
var app = express(); //Initialize the app


//Configure the settings of the app
app.use(cors()); // Enables CORS
app.use(logger); //Tells the app to send all requests through the 'logger' function
app.use(express.static('/public')); //Tells the app to serve static files from ./public_html/

//Example of a dynamic get handler
app.get('/draft_order', function(req, res) {
    res.setHeader('Content-Type', 'text/plain'); //Tell the client you are sending plain text
    res.end(req.cookies);
    var lineJSON = req.body.content;
    draftOrder(lineJSON)
    console.log(req.body.content);
});

//Example of a dynamic post handler
app.post('/dynamicfile.txt', function(req, res) {
    res.setHeader('Content-Type', 'text/plain'); //Tell the client you are sending plain text
    res.write('Posted data to server: '); //Send data to the client
    res.end(req.body); //Send the post data to the client and end the request
});

app.listen(port); //Listen on the specified port
console.log('Listening on port ' + port); //Write to the console