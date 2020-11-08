/***********************************
*Node JS & Express JS server for Shopify API
*Author: Mikhail Arden
***********************************/

//Load node.js modules
const express = require('express'); //Require the Express Module
const cors = require('cors') // Cors
const PORT = process.env.PORT || 5000;
const $ = require("jquery");
var axios = require('axios');

// Config modules

var storeURL = "https://bijoux-medusa.myshopify.com/admin/";
var apiVersion = "2020-10";

// API Config
var accessToken = process.env.ACCESS_TOKEN;
var AuthKey = process.env.AUTH_KEY;

//Runs every time a request is recieved
function logger(req, res, next) {
    console.log('Request from: ' + req.ip + ' For: ' + req.path); //Log the request to the console
    next(); //Run the next handler (IMPORTANT, otherwise your page won't be served)
}

var port = 8000;
var app = express(); //Initialize the app

//Configure the settings of the app
app.use(cors()); // Enables CORS
app.use(logger); //Tells the app to send all requests through the 'logger' function
app.use(express.static('/public')); //Tells the app to serve static files from ./public_html/
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//Dynamic get handler
app.route('/inventory')
    .get(function (req, res) {
        res.setHeader('Content-Type', 'application/json'); //Tell the client you are sending plain text
        res.end(req.cookies);
        console.log(req)
    })
    .post(function (req, res) {
        console.log(req.body)
        var variantID = req.body.product,
            config = {
                method: 'get',
                url: 'https://bijoux-medusa.myshopify.com/admin/api/2020-10/inventory_levels.json?inventory_item_ids='++'&location_ids='',
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json',
                    'Authorization': AuthKey
                }
            };
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                var result = response.data;
                res.json(result)
            })
            .catch(function (error) {
                console.log(error);
            })
    });

app.route('/location')
    .get(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.end(req.cookies);
        console.log(req)
    })
    .post(function (req, res) {
        console.log(req.body)
            config = {
                method: 'get',
                url: 'https://bijoux-medusa.myshopify.com/admin/api/2020-10/locations.json',
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json',
                    'Authorization': AuthKey
                }
            };
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                var result = response.data;
                res.json(result)
            })
            .catch(function (error) {
                console.log(error);
            })
    });

app.route('/product')
    .get(function (req, res) {
        console.log('Page is active')
        res.setHeader('Content-Type', 'application/json'); //Tell the client you are sending plain text
        res.end(req.cookies);

    })
    .post(function (req, res) {
        console.log(req.body)
        var productID = req.body.product,
            config = {
                method: 'get',
                url: 'https://bijoux-medusa.myshopify.com/admin/api/2020-10/products/' + productID + '.json',
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json',
                    'Authorization': AuthKey
                }
            };
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                var result = response.data;
                res.json(result)
            })
            .catch(function (error) {
                console.log(error);
            });
    });

app.listen(PORT, () => console.log(`Listening on ${PORT}`))