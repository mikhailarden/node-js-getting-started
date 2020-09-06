/***********************************
*Node JS & Express JS server for Shopify API
*Author: Mikhail Arden
***********************************/

//Load node.js modules
const express = require('express'); //Require the Express Module
const cors = require('cors') // Cors
const PORT = process.env.PORT || 5000;
const $ = require("jquery");

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
}

var port = 8000;
var app = express(); //Initialize the app



//Configure the settings of the app
app.use(cors()); // Enables CORS
app.use(logger); //Tells the app to send all requests through the 'logger' function
app.use(express.static('/public')); //Tells the app to serve static files from ./public_html/
app.use(express.json());

//Example of a dynamic get handler
app.route('/draft_order')
.get(function(req, res) {
console.log('Page is active')
    res.setHeader('Content-Type', 'text/plain'); //Tell the client you are sending plain text
    res.end(req.cookies);
    console.log(process.env.BASIC_AUTH)
   
})
.post(function(req, res) {
    var lineJSON = req.body;
    draftOrder(lineJSON)
    console.log(req.body);
    console.log('This is the full:' + req);
    res.end(req.cookies);
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))