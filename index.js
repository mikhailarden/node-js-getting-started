const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();


const client_key = 'fakeToken';
const client_pass = 'nonFake';
const order_auth = 'nonFake';

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/cart.js', (req, res) => res.sendFile(__dirname + '/public/cart_function.js'))
     .post("/cart.js", (req, res) => {
                var key = req.body.key;
                var newKey = {key: key};
                key.push(newKey);
                console.log("key")
                res.redirect("/cart.js");
            })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

require('dotenv').config()

console.log('Server listening on port 9000 test');